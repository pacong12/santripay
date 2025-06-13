import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { StatusTransaksi } from "@prisma/client";

const transaksiSchema = z.object({
  santriId: z.string(),
  tagihanId: z.string(),
  amount: z.number().positive(),
  paymentDate: z.string(),
  paymentMethod: z.enum(["cash", "transfer"]),
  status: z.enum(["pending", "approved", "rejected"]),
  note: z.string().optional(),
});

// Fungsi untuk memformat tanggal ke ISO string
function formatDateToISO(date: string | Date): string {
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format');
    }
    return parsedDate.toISOString();
  }
  return date.toISOString();
}

// Fungsi untuk mengkonversi BigInt ke string
function serializeBigInt(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "bigint") {
    return data.toString();
  }

  if (Array.isArray(data)) {
    return data.map(serializeBigInt);
  }

  if (typeof data === "object") {
    const result: any = {};
    for (const key in data) {
      if (key === 'paymentDate' || key === 'payment_date') {
        result[key] = data[key] ? new Date(data[key]).toISOString() : null;
      } else {
        result[key] = serializeBigInt(data[key]);
      }
    }
    return result;
  }

  return data;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transaksi = await prisma.transaksi.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        santri: true,
        tagihan: {
          include: {
            jenisTagihan: true,
          },
        },
      },
    });

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("[TRANSACTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = transaksiSchema.parse(body);

    const transaksi = await prisma.transaksi.create({
        data: {
        santriId: validatedData.santriId,
          tagihanId: validatedData.tagihanId,
          amount: validatedData.amount,
        paymentDate: new Date(validatedData.paymentDate),
        paymentMethod: validatedData.paymentMethod,
        status: validatedData.status,
        note: validatedData.note,
        },
        include: {
        santri: true,
          tagihan: {
            include: {
              jenisTagihan: true,
            },
          },
        },
      });

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("[TRANSACTION_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID transaksi tidak ditemukan." }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = transaksiSchema.partial().parse({
      ...body,
      amount: body.amount ? BigInt(body.amount) : undefined,
    });

    const updatedTransaksi = await prisma.transaksi.update({
      where: { id },
      data: {
        ...validatedData,
        paymentDate: validatedData.paymentDate ? new Date(validatedData.paymentDate) : undefined,
      },
    });

    return NextResponse.json(updatedTransaksi, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    console.error("Error updating transaksi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memperbarui transaksi." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID transaksi tidak ditemukan." }, { status: 400 });
    }

    await prisma.transaksi.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transaksi berhasil dihapus." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting transaksi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus transaksi." },
      { status: 500 }
    );
  }
} 