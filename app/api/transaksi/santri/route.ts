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

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transaksi = await prisma.transaksi.findMany({
      where: {
        santri: {
          user: {
            email: session.user.email,
          },
        },
      },
      include: {
        tagihan: {
          include: {
            jenisTagihan: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    const serializedTransaksi = serializeBigInt(transaksi);

    return NextResponse.json({
      message: "Data transaksi berhasil diambil",
      data: serializedTransaksi,
    });
  } catch (error) {
    console.error("[TRANSAKSI_SANTRI_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 