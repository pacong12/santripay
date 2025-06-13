import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const notifikasiSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  message: z.string().min(1, "Pesan harus diisi"),
  type: z.enum([
    "tagihan_baru",
    "tagihan_jatuh_tempo",
    "pembayaran_diterima",
    "pembayaran_ditolak",
    "saldo_berkurang",
    "saldo_bertambah",
    "sistem"
  ]),
});

const updateNotifikasiSchema = z.object({
  id: z.string(),
  isRead: z.boolean(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notifikasi = await prisma.notifikasi.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifikasi);
  } catch (error) {
    console.error("[NOTIFIKASI_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, isRead } = updateNotifikasiSchema.parse(body);

    const notifikasi = await prisma.notifikasi.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!notifikasi) {
      return new NextResponse("Notifikasi tidak ditemukan", { status: 404 });
    }

    const updatedNotifikasi = await prisma.notifikasi.update({
      where: {
        id,
      },
      data: {
        isRead,
      },
    });

    return NextResponse.json(updatedNotifikasi);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    console.error("[NOTIFIKASI_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 