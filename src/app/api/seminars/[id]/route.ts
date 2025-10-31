import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const seminar = await db.seminar.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            registrations: true
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

    // Format response
    const formattedSeminar = {
      id: seminar.id,
      title: seminar.title,
      description: seminar.description,
      shortDescription: seminar.shortDescription,
      imageUrl: seminar.imageUrl,
      date: seminar.date.toISOString(),
      time: seminar.time,
      duration: seminar.duration,
      location: seminar.location,
      locationType: seminar.locationType,
      speaker: seminar.speaker,
      speakerBio: seminar.speakerBio,
      maxParticipants: seminar.maxParticipants,
      currentParticipants: seminar._count.registrations,
      category: seminar.category,
      price: seminar.price,
      earlyBirdPrice: seminar.earlyBirdPrice,
      earlyBirdDeadline: seminar.earlyBirdDeadline?.toISOString(),
      status: seminar.status,
      tags: seminar.tags ? JSON.parse(seminar.tags) : [],
      requirements: seminar.requirements ? JSON.parse(seminar.requirements) : [],
      materials: seminar.materials ? JSON.parse(seminar.materials) : [],
      agenda: seminar.agenda ? JSON.parse(seminar.agenda) : [],
      createdAt: seminar.createdAt.toISOString(),
      updatedAt: seminar.updatedAt.toISOString(),
      creator: seminar.creator
    }

    return NextResponse.json({
      success: true,
      data: formattedSeminar
    })

  } catch (error) {
    console.error('Error fetching seminar:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch seminar' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json()
    
    // Check if seminar exists
    const existingSeminar = await db.seminar.findUnique({
      where: { id }
    })

    if (!existingSeminar) {
      return NextResponse.json(
        { success: false, error: 'Seminar not found' },
        { status: 404 }
      )
    }

    // Update seminar
    const seminar = await db.seminar.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        shortDescription: body.shortDescription,
        imageUrl: body.imageUrl,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time,
        duration: body.duration,
        location: body.location,
        locationType: body.locationType,
        speaker: body.speaker,
        speakerBio: body.speakerBio,
        maxParticipants: body.maxParticipants,
        category: body.category,
        price: body.price,
        earlyBirdPrice: body.earlyBirdPrice,
        earlyBirdDeadline: body.earlyBirdDeadline ? new Date(body.earlyBirdDeadline) : null,
        status: body.status,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        requirements: body.requirements ? JSON.stringify(body.requirements) : null,
        materials: body.materials ? JSON.stringify(body.materials) : null,
        agenda: body.agenda ? JSON.stringify(body.agenda) : null
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      }
    })

    // Format response
    const formattedSeminar = {
      id: seminar.id,
      title: seminar.title,
      description: seminar.description,
      shortDescription: seminar.shortDescription,
      imageUrl: seminar.imageUrl,
      date: seminar.date.toISOString(),
      time: seminar.time,
      duration: seminar.duration,
      location: seminar.location,
      locationType: seminar.locationType,
      speaker: seminar.speaker,
      speakerBio: seminar.speakerBio,
      maxParticipants: seminar.maxParticipants,
      currentParticipants: seminar._count.registrations,
      category: seminar.category,
      price: seminar.price,
      earlyBirdPrice: seminar.earlyBirdPrice,
      earlyBirdDeadline: seminar.earlyBirdDeadline?.toISOString(),
      status: seminar.status,
      tags: seminar.tags ? JSON.parse(seminar.tags) : [],
      requirements: seminar.requirements ? JSON.parse(seminar.requirements) : [],
      materials: seminar.materials ? JSON.parse(seminar.materials) : [],
      agenda: seminar.agenda ? JSON.parse(seminar.agenda) : [],
      createdAt: seminar.createdAt.toISOString(),
      updatedAt: seminar.updatedAt.toISOString(),
      creator: seminar.creator
    }

    return NextResponse.json({
      success: true,
      data: formattedSeminar
    })

  } catch (error) {
    console.error('Error updating seminar:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update seminar' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if seminar exists
    const existingSeminar = await db.seminar.findUnique({
      where: { id }
    })

    if (!existingSeminar) {
      return NextResponse.json(
        { success: false, error: 'Seminar not found' },
        { status: 404 }
      )
    }

    // Delete seminar (this will also delete related registrations due to cascade)
    await db.seminar.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Seminar deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting seminar:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete seminar' },
      { status: 500 }
    )
  }
}