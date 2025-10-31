import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registration = await db.registration.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profession: true,
            institution: true
          }
        },
        seminar: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            time: true,
            location: true,
            category: true,
            price: true,
            imageUrl: true,
            speaker: true,
            speakerBio: true
          }
        }
      }
    })

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      )
    }

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
    })

  } catch (error) {
    console.error('Error fetching registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registration' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Check if registration exists
    const existingRegistration = await db.registration.findUnique({
      where: { id: params.id }
    })

    if (!existingRegistration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      )
    }

    // Update registration
    const registration = await db.registration.update({
      where: { id: params.id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
        paymentMethod: body.paymentMethod,
        paymentUrl: body.paymentUrl,
        paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
        cancelledAt: body.cancelledAt ? new Date(body.cancelledAt) : undefined,
        notes: body.notes,
        certificateUrl: body.certificateUrl,
        attended: body.attended,
        rating: body.rating,
        review: body.review
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profession: true,
            institution: true
          }
        },
        seminar: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            time: true,
            location: true,
            category: true,
            price: true,
            imageUrl: true,
            speaker: true,
            speakerBio: true
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
    })

  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if registration exists
    const existingRegistration = await db.registration.findUnique({
      where: { id: params.id }
    })

    if (!existingRegistration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      )
    }

    // Delete registration
    await db.registration.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete registration' },
      { status: 500 }
    )
  }
}