// Cron job untuk cleanup data lama
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Cleanup expired registrations (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const cleanupResult = await prisma.registration.deleteMany({
      where: {
        status: 'CANCELLED',
        cancelledAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${cleanupResult.count} expired registrations`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Cleanup failed',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}