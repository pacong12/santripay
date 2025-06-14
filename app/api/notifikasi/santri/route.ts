import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user.role !== "santri") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const notifikasi = await prisma.notifikasi.findMany({
      where: {
        role: Role.santri,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(notifikasi)
  } catch (error) {
    console.error("[NOTIFIKASI_SANTRI_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user.role !== "santri") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const { id, isRead } = body

    if (!id || typeof isRead !== "boolean") {
      return new NextResponse("Invalid request body", { status: 400 })
    }

    const notifikasi = await prisma.notifikasi.update({
      where: {
        id,
        userId: session.user.id,
        role: Role.santri,
      },
      data: {
        isRead,
      },
    })

    return NextResponse.json(notifikasi)
  } catch (error) {
    console.error("[NOTIFIKASI_SANTRI_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 