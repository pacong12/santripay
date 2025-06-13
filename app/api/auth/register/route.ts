import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  kelasId: z.string().uuid("Pilih kelas yang valid"),
  phone: z.string().optional().transform(val => val === "" ? undefined : val),
});

export async function POST(req: Request) {
  try {
    console.log("Mulai proses registrasi...");
    const body = await req.json();
    console.log("Data yang diterima:", body);
    
    const validatedData = registerSchema.parse(body);
    console.log("Data yang sudah divalidasi:", validatedData);

    // Cek username sudah ada atau belum
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (existingUsername) {
      console.log("Username sudah digunakan:", validatedData.username);
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    // Cek email sudah ada atau belum
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      console.log("Email sudah digunakan:", validatedData.email);
      return NextResponse.json(
        { message: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    // Generate ID Santri otomatis
    const currentYear = new Date().getFullYear();
    console.log("Mencari ID Santri terakhir untuk tahun:", currentYear);
    
    const lastSantri = await prisma.santri.findFirst({
      orderBy: { santriId: 'desc' },
      where: {
        santriId: {
          startsWith: `${currentYear}`
        }
      }
    });

    let newSantriId;
    if (lastSantri) {
      const lastNumber = parseInt(lastSantri.santriId.slice(-4));
      newSantriId = `${currentYear}${String(lastNumber + 1).padStart(4, '0')}`;
      console.log("ID Santri terakhir ditemukan:", lastSantri.santriId);
    } else {
      newSantriId = `${currentYear}0001`;
      console.log("Tidak ada ID Santri sebelumnya, menggunakan ID awal");
    }
    console.log("ID Santri baru yang akan digunakan:", newSantriId);

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    console.log("Password berhasil di-hash");

    // Buat user dan santri dalam satu transaksi
    console.log("Memulai transaksi database...");
    const result = await prisma.$transaction(async (tx) => {
      // Buat user baru
      console.log("Membuat user baru...");
      const user = await tx.user.create({
        data: {
          username: validatedData.username,
          email: validatedData.email,
          password: hashedPassword,
          role: "santri",
        },
      });
      console.log("User berhasil dibuat:", user.id);

      // Buat santri baru dengan ID otomatis
      console.log("Membuat data santri...");
      const santri = await tx.santri.create({
        data: {
          userId: user.id,
          name: validatedData.name,
          santriId: newSantriId,
          kelasId: validatedData.kelasId,
          phone: validatedData.phone,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
          kelas: {
            select: {
              id: true,
              name: true,
              level: true
            }
          }
        }
      });
      console.log("Santri berhasil dibuat:", santri.id);

      return { user, santri };
    });

    // Hapus password dari response
    const { password, ...userWithoutPassword } = result.user;

    console.log("Registrasi berhasil untuk user:", result.user.id);
    return NextResponse.json({
      message: "Registrasi berhasil",
      data: {
        user: userWithoutPassword,
        santri: result.santri
      }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Error validasi:", error.errors);
      return NextResponse.json(
        { message: "Data tidak valid", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error saat registrasi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
} 