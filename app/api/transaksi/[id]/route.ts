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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    const transaksi = await prisma.transaksi.findUnique({
      where: {
        id,
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

    if (!transaksi) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("[TRANSACTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const validatedData = transaksiSchema.parse(body);

    const transaksi = await prisma.transaksi.update({
      where: {
        id,
      },
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
    console.error("[TRANSACTION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    await prisma.transaksi.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TRANSACTION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 