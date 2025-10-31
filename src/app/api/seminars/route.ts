import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (category) {
      where.category = category
    }
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { speaker: { contains: search } }
      ]
    }

    // Get seminars
    const seminars = await db.seminar.findMany({
      where,
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
      },
      orderBy: {
        date: 'asc'
      },
      skip,
      take: limit
    })

    // Get total count
    const total = await db.seminar.count({ where })

    // Format response
    const formattedSeminars = seminars.map(seminar => ({
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
    }))

    return NextResponse.json({
      success: true,
      data: formattedSeminars,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching seminars:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch seminars' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'speaker', 'maxParticipants', 'category', 'price', 'creatorId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Field ${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create seminar
    const seminar = await db.seminar.create({
      data: {
        title: body.title,
        description: body.description,
        shortDescription: body.shortDescription,
        imageUrl: body.imageUrl,
        date: new Date(body.date),
        time: body.time,
        duration: body.duration,
        location: body.location,
        locationType: body.locationType || 'OFFLINE',
        speaker: body.speaker,
        speakerBio: body.speakerBio,
        maxParticipants: body.maxParticipants,
        category: body.category,
        price: body.price,
        earlyBirdPrice: body.earlyBirdPrice,
        earlyBirdDeadline: body.earlyBirdDeadline ? new Date(body.earlyBirdDeadline) : null,
        status: body.status || 'DRAFT',
        tags: body.tags ? JSON.stringify(body.tags) : null,
        requirements: body.requirements ? JSON.stringify(body.requirements) : null,
        materials: body.materials ? JSON.stringify(body.materials) : null,
        agenda: body.agenda ? JSON.stringify(body.agenda) : null,
        creatorId: body.creatorId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
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
      currentParticipants: 0,
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
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating seminar:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create seminar' },
      { status: 500 }
    )
  }
}