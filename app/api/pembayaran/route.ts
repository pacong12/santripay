import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const pembayaranSchema = z.object({
  tagihanId: z.string().uuid("Pilih tagihan yang valid"),
  amount: z.coerce.number().min(0, "Jumlah harus lebih dari atau sama dengan 0"),
  paymentMethod: z.enum(["transfer", "cash", "qris"]),
  paymentProof: z.string().optional(), // URL bukti pembayaran
  note: z.string().optional(),
});

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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const validatedData = pembayaranSchema.parse(body);

    // Cek tagihan
    const tagihan = await prisma.tagihan.findUnique({
      where: { id: validatedData.tagihanId },
      include: {
        santri: {
          include: {
            user: true,
            kelas: true,
          },
        },
        jenisTagihan: true,
      },
    });

    if (!tagihan) {
      return NextResponse.json(
        { message: "Tagihan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Verifikasi bahwa santri yang login adalah pemilik tagihan
    if (tagihan.santri.user.id !== session.user.id) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses untuk membayar tagihan ini" },
        { status: 403 }
      );
    }

    // Cek status tagihan
    if (tagihan.status === "paid") {
      return NextResponse.json(
        { message: "Tagihan ini sudah dibayar" },
        { status: 400 }
      );
    }

    // Cek apakah sudah ada transaksi untuk tagihan ini
    const existingTransaksi = await prisma.transaksi.findUnique({
      where: { tagihanId: validatedData.tagihanId },
    });

    if (existingTransaksi) {
      return NextResponse.json(
        { message: "Tagihan ini sudah memiliki transaksi" },
        { status: 400 }
      );
    }

    // Validasi jumlah pembayaran
    if (Number(validatedData.amount) < Number(tagihan.amount)) {
      return NextResponse.json(
        { message: "Jumlah pembayaran tidak boleh kurang dari jumlah tagihan" },
        { status: 400 }
      );
    }

    // Buat transaksi dan update status tagihan dalam satu transaksi
    const result = await prisma.$transaction(async (tx) => {
      // Buat transaksi
      const transaksi = await tx.transaksi.create({
        data: {
          tagihanId: validatedData.tagihanId,
          santriId: tagihan.santriId,
          amount: validatedData.amount,
          paymentDate: new Date(),
          note: validatedData.note,
          status: "pending",
        },
        include: {
          santri: {
            include: {
              kelas: true,
            },
          },
          tagihan: {
            include: {
              jenisTagihan: true,
            },
          },
        },
      });

      // Buat notifikasi untuk admin
      // Dapatkan semua user dengan role 'admin'
      const adminUsers = await tx.user.findMany({
        where: {
          role: "admin",
          receiveAppNotifications: true, // Hanya kirim ke admin yang mengaktifkan notifikasi aplikasi
        },
        select: {
          id: true,
        },
      });

      // Buat notifikasi untuk setiap admin
      await Promise.all(adminUsers.map(async (adminUser) => {
        await tx.notifikasi.create({
          data: {
            userId: adminUser.id,
            title: "Pembayaran Baru",
            message: `Pembayaran baru dari ${tagihan.santri.name} untuk ${tagihan.jenisTagihan.name} sebesar ${new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(Number(validatedData.amount))}`,
            type: "pembayaran_diterima",
          },
        });
      }));

      return transaksi;
    });

    const serializedResult = serializeBigInt(result);

    return NextResponse.json({
      message: "Pembayaran berhasil dibuat dan menunggu konfirmasi admin",
      data: serializedResult,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const pembayaran = await prisma.transaksi.findMany({
      include: {
        santri: {
          include: {
            kelas: true,
          },
        },
        tagihan: {
          include: {
            jenisTagihan: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedPembayaran = serializeBigInt(pembayaran);
    return NextResponse.json(serializedPembayaran);
  } catch (error) {
    console.error("[PAYMENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 