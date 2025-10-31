// Server-Sent Events untuk real-time communication di Vercel
import { NextRequest } from 'next/server';

// Store untuk connections (dalam production gunakan Redis/database)
const connections = new Map<string, ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';

    const stream = new ReadableStream({
        start(controller) {
            // Store connection
            connections.set(userId, controller);

            // Send initial connection message
            controller.enqueue(`data: ${JSON.stringify({
                type: 'connected',
                userId,
                timestamp: new Date().toISOString()
            })}\n\n`);

            // Heartbeat to keep connection alive
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(`data: ${JSON.stringify({
                        type: 'heartbeat',
                        timestamp: new Date().toISOString()
                    })}\n\n`);
                } catch (error) {
                    clearInterval(heartbeat);
                    connections.delete(userId);
                }
            }, 30000);

            // Cleanup on close
            request.signal.addEventListener('abort', () => {
                clearInterval(heartbeat);
                connections.delete(userId);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, data, targetUserId, broadcast } = body;

        const message = JSON.stringify({
            type,
            data,
            timestamp: new Date().toISOString(),
        });

        if (broadcast) {
            // Broadcast ke semua connections
            connections.forEach((controller, userId) => {
                try {
                    controller.enqueue(`data: ${message}\n\n`);
                } catch (error) {
                    connections.delete(userId);
                }
            });
        } else if (targetUserId && connections.has(targetUserId)) {
            // Send ke user tertentu
            const controller = connections.get(targetUserId);
            try {
                controller?.enqueue(`data: ${message}\n\n`);
            } catch (error) {
                connections.delete(targetUserId);
            }
        }

        return Response.json({
            success: true,
            activeConnections: connections.size
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: 'Failed to process message'
        }, { status: 500 });
    }
}