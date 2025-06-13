import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const notifikasi = await prisma.notifikasi.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(notifikasi)
  } catch (error) {
    console.error("[NOTIFICATION_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const { title, message, type, userId } = body

    if (!title || !message || !type || !userId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const notifikasi = await prisma.notifikasi.create({
      data: {
        title,
        message,
        type,
        userId,
      },
    })

    return NextResponse.json(notifikasi)
  } catch (error) {
    console.error("[NOTIFICATION_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session:", session)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user.role !== "admin") {
      console.log("User role:", session.user.role)
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const { id, isRead } = body

    if (!id) {
      return new NextResponse("ID is required", { status: 400 })
    }

    const notifikasi = await prisma.notifikasi.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        isRead,
      },
    })

    return NextResponse.json(notifikasi)
  } catch (error) {
    console.error("[NOTIFICATION_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 