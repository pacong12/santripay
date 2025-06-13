import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
      if (key === 'paymentDate' || key === 'payment_date' || key === 'dueDate' || key === 'due_date') {
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

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tagihan = await prisma.tagihan.findMany({
      where: {
        santri: {
          user: {
            email: session.user.email,
          },
        },
      },
      include: {
        jenisTagihan: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        dueDate: "desc",
      },
    });

    const serializedTagihan = serializeBigInt(tagihan);

    return NextResponse.json({
      message: "Data tagihan berhasil diambil",
      data: serializedTagihan,
    });
  } catch (error) {
    console.error("[TAGIHAN_SANTRI_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 