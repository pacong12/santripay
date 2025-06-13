import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { User, Santri, Kelas } from "@prisma/client"; // Import Prisma generated types

// Define a more specific type based on the Prisma query's select for GET
type UserWithSantriAndKelasAndNotifications = User & {
  santri: (Santri & { kelas: Kelas }) | null;
  receiveEmailNotifications: boolean;
  receiveAppNotifications: boolean;
};

// Define a more specific type based on the Prisma query's select for PATCH
type UserWithSantriAndNotifications = User & {
  santri: Santri | null;
  receiveEmailNotifications: boolean;
  receiveAppNotifications: boolean;
};

// Schema validasi untuk update profil
const updateProfileSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  phone: z.string().optional(),
  receiveEmailNotifications: z.boolean().optional(),
  receiveAppNotifications: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ambil data user dan santri
    const user = (await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
      include: {
        santri: {
          include: {
            kelas: true,
          },
        },
      },
    })) as UserWithSantriAndKelasAndNotifications; // Type assertion here

    if (!user || !user.santri || !user.santri.kelas) {
      return NextResponse.json(
        { message: "Data santri tidak ditemukan" },
        { status: 404 }
      );
    }

    // Transform data untuk response
    const profileData = {
      id: user.santri.id,
      name: user.santri.name,
      email: user.email,
      phone: user.santri.phone,
      nis: user.santri.santriId,
      kelas: user.santri.kelas.name,
      receiveEmailNotifications: user.receiveEmailNotifications,
      receiveAppNotifications: user.receiveAppNotifications,
    };

    return NextResponse.json({
      message: "Berhasil mengambil data profil",
      data: profileData,
    });
  } catch (error) {
    console.error("[SANTRI_PROFILE_GET]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // Update data santri dan user (untuk preferensi notifikasi)
    const user = (await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
      include: {
        santri: true,
      },
    })) as UserWithSantriAndNotifications; // Type assertion here

    if (!user || !user.santri) {
      return NextResponse.json(
        { message: "Data santri tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedSantri = await prisma.santri.update({
      where: {
        id: user.santri.id,
      },
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
      },
      include: {
        kelas: true,
      },
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        receiveEmailNotifications: validatedData.receiveEmailNotifications,
        receiveAppNotifications: validatedData.receiveAppNotifications,
      },
    });

    // Transform data untuk response
    const profileData = {
      id: updatedSantri.id,
      name: updatedSantri.name,
      email: updatedUser.email,
      phone: updatedSantri.phone,
      nis: updatedSantri.santriId,
      kelas: updatedSantri.kelas.name,
      receiveEmailNotifications: updatedUser.receiveEmailNotifications,
      receiveAppNotifications: updatedUser.receiveAppNotifications,
    };

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
      data: profileData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("[SANTRI_PROFILE_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 