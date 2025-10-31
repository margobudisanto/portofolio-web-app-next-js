import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId')
    const seminarId = searchParams.get('seminarId')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (seminarId) {
      where.seminarId = seminarId
    }
    
    if (status) {
      where.status = status
    }
    
    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    // Get registrations
    const registrations = await db.registration.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        seminar: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            location: true,
            category: true,
            price: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count
    const total = await db.registration.count({ where })

    // Format response
    const formattedRegistrations = registrations.map(registration => ({
      id: registration.id,
      userId: registration.userId,
      seminarId: registration.seminarId,
      status: registration.status,
      paymentStatus: registration.paymentStatus,
      paymentMethod: registration.paymentMethod,
      paymentUrl: registration.paymentUrl,
      paidAt: registration.paidAt?.toISOString(),
      registeredAt: registration.registeredAt.toISOString(),
      cancelledAt: registration.cancelledAt?.toISOString(),
      notes: registration.notes,
      certificateUrl: registration.certificateUrl,
      attended: registration.attended,
      rating: registration.rating,
      review: registration.review,
      createdAt: registration.createdAt.toISOString(),
      updatedAt: registration.updatedAt.toISOString(),
      user: registration.user,
      seminar: {
        ...registration.seminar,
        date: registration.seminar.date.toISOString()
      }
    }))

    return NextResponse.json({
      success: true,
      data: formattedRegistrations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['userId', 'seminarId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Field ${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: body.userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if seminar exists
    const seminar = await db.seminar.findUnique({
      where: { id: body.seminarId },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: { not: 'CANCELLED' }
              }
            }
          }
        }
      }
    })

    if (!seminar) {
      return NextResponse.json(
        { success: false, error: 'Seminar not found' },
        { status: 404 }
      )
    }

    // Check if seminar is full
    if (seminar._count.registrations >= seminar.maxParticipants) {
      return NextResponse.json(
        { success: false, error: 'Seminar is full' },
        { status: 400 }
      )
    }

    // Check if user already registered
    const existingRegistration = await db.registration.findUnique({
      where: {
        userId_seminarId: {
          userId: body.userId,
          seminarId: body.seminarId
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, error: 'User already registered for this seminar' },
        { status: 400 }
      )
    }

    // Create registration
    const registration = await db.registration.create({
      data: {
        userId: body.userId,
        seminarId: body.seminarId,
        status: body.status || 'PENDING',
        paymentStatus: body.paymentStatus || 'PENDING',
        paymentMethod: body.paymentMethod,
        paymentUrl: body.paymentUrl,
        notes: body.notes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        seminar: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            location: true,
            category: true,
            price: true,
            imageUrl: true
          }
        }
      }
    })

    // Format response
    const formattedRegistration = {
      id: registration.id,
      userId: registration.userId,
      seminarId: registration.seminarId,
      status: registration.status,
      paymentStatus: registration.paymentStatus,
      paymentMethod: registration.paymentMethod,
      paymentUrl: registration.paymentUrl,
      paidAt: registration.paidAt?.toISOString(),
      registeredAt: registration.registeredAt.toISOString(),
      cancelledAt: registration.cancelledAt?.toISOString(),
      notes: registration.notes,
      certificateUrl: registration.certificateUrl,
      attended: registration.attended,
      rating: registration.rating,
      review: registration.review,
      createdAt: registration.createdAt.toISOString(),
      updatedAt: registration.updatedAt.toISOString(),
      user: registration.user,
      seminar: {
        ...registration.seminar,
        date: registration.seminar.date.toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      data: formattedRegistration
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}