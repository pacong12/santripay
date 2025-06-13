import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama (opsional, bisa diaktifkan jika ingin reset penuh setiap seed)
  await prisma.transaksi.deleteMany({});
  await prisma.tagihan.deleteMany({});
  await prisma.jenisTagihan.deleteMany({});
  await prisma.santri.deleteMany({});
  await prisma.kelas.deleteMany({});
  await prisma.notifikasi.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Old data deleted.');

  // Buat user admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("Admin created:", admin.email);

  // Buat user santri 1
  const santri1Password = await bcrypt.hash("santri123", 10);
  const userSantri1 = await prisma.user.create({
    data: {
      username: "santri1",
      email: "santri1@example.com",
      password: santri1Password,
      role: "santri",
    },
  });
  console.log("User Santri 1 created:", userSantri1.email);

  // Buat user santri 2
  const santri2Password = await bcrypt.hash("santri123", 10);
  const userSantri2 = await prisma.user.create({
    data: {
      username: "santri2",
      email: "santri2@example.com",
      password: santri2Password,
      role: "santri",
    },
  });
  console.log("User Santri 2 created:", userSantri2.email);

  // Buat user santri 3
  const santri3Password = await bcrypt.hash("santri123", 10);
  const userSantri3 = await prisma.user.create({
    data: {
      username: "budi",
      email: "budi@example.com",
      password: santri3Password,
      role: "santri",
    },
  });
  console.log("User Santri 3 created:", userSantri3.username);

  // Buat data Kelas
  const kelas1 = await prisma.kelas.create({
    data: { name: "1A", level: "Tsanawiyah" },
  });
  const kelas2 = await prisma.kelas.create({
    data: { name: "2B", level: "Aliyah" },
  });
  console.log("Kelas created:", kelas1.name, kelas2.name);

  // Buat data Santri yang terhubung dengan User dan Kelas
  const santriAhmad = await prisma.santri.create({
    data: {
      userId: userSantri1.id,
      name: "Ahmad Fauzi",
      santriId: "S001",
      kelasId: kelas1.id,
      phone: "08111222333",
    },
  });
  console.log("Santri Ahmad created:", santriAhmad.name);

  const santriSiti = await prisma.santri.create({
    data: {
      userId: userSantri2.id,
      name: "Siti Rahmawati",
      santriId: "S002",
      kelasId: kelas2.id,
      phone: "08444555666",
    },
  });
  console.log("Santri Siti created:", santriSiti.name);

  // Buat data JenisTagihan
  const iuranBulanan = await prisma.jenisTagihan.create({
    data: { name: "Iuran Bulanan", amount: BigInt(150000), description: "Iuran bulanan rutin" },
  });
  const kegiatanTahunan = await prisma.jenisTagihan.create({
    data: { name: "Kegiatan Tahunan", amount: BigInt(250000), description: "Biaya kegiatan pesantren" },
  });
  const seragam = await prisma.jenisTagihan.create({
    data: { name: "Seragam", amount: BigInt(200000), description: "Biaya seragam pesantren" },
  });
  const buku = await prisma.jenisTagihan.create({
    data: { name: "Buku Pelajaran", amount: BigInt(100000), description: "Biaya buku pelajaran" },
  });
  console.log("Jenis Tagihan created:", iuranBulanan.name, kegiatanTahunan.name, seragam.name, buku.name);

  // Buat data Tagihan untuk Ahmad
  const tagihanAhmad1 = await prisma.tagihan.create({
    data: {
      santriId: santriAhmad.id,
      jenisTagihanId: iuranBulanan.id,
      amount: BigInt(150000),
      dueDate: new Date("2025-07-01T00:00:00Z"),
      status: "pending",
      description: "Iuran bulanan Juli Ahmad Fauzi",
    },
  });

  const tagihanAhmad2 = await prisma.tagihan.create({
    data: {
      santriId: santriAhmad.id,
      jenisTagihanId: kegiatanTahunan.id,
      amount: BigInt(250000),
      dueDate: new Date("2025-06-15T00:00:00Z"),
      status: "paid",
      description: "Biaya kegiatan tahunan Ahmad Fauzi",
    },
  });

  const tagihanAhmad3 = await prisma.tagihan.create({
    data: {
      santriId: santriAhmad.id,
      jenisTagihanId: seragam.id,
      amount: BigInt(200000),
      dueDate: new Date("2025-05-01T00:00:00Z"),
      status: "overdue",
      description: "Biaya seragam Ahmad Fauzi",
    },
  });

  // Buat data Tagihan untuk Siti
  const tagihanSiti1 = await prisma.tagihan.create({
    data: {
      santriId: santriSiti.id,
      jenisTagihanId: iuranBulanan.id,
      amount: BigInt(150000),
      dueDate: new Date("2025-07-01T00:00:00Z"),
      status: "pending",
      description: "Iuran bulanan Juli Siti Rahmawati",
    },
  });

  const tagihanSiti2 = await prisma.tagihan.create({
    data: {
      santriId: santriSiti.id,
      jenisTagihanId: buku.id,
      amount: BigInt(100000),
      dueDate: new Date("2025-06-20T00:00:00Z"),
      status: "paid",
      description: "Biaya buku pelajaran Siti Rahmawati",
    },
  });

  const tagihanSiti3 = await prisma.tagihan.create({
    data: {
      santriId: santriSiti.id,
      jenisTagihanId: kegiatanTahunan.id,
      amount: BigInt(250000),
      dueDate: new Date("2025-05-15T00:00:00Z"),
      status: "overdue",
      description: "Biaya kegiatan tahunan Siti Rahmawati",
    },
  });

  console.log("Tagihan created for Ahmad and Siti");

  // Buat data Santri tambahan
  const santriBudi = await prisma.santri.create({
    data: {
      userId: userSantri3.id,
      name: "Budi Santoso",
      santriId: "S003",
      kelasId: kelas1.id,
      phone: "08777888999",
    },
  });

  // Buat data Tagihan untuk Budi
  const tagihanBudi1 = await prisma.tagihan.create({
    data: {
      santriId: santriBudi.id,
      jenisTagihanId: iuranBulanan.id,
      amount: BigInt(150000),
      dueDate: new Date("2025-07-01T00:00:00Z"),
      status: "pending",
      description: "Iuran bulanan Juli Budi Santoso",
    },
  });

  const tagihanBudi2 = await prisma.tagihan.create({
    data: {
      santriId: santriBudi.id,
      jenisTagihanId: seragam.id,
      amount: BigInt(200000),
      dueDate: new Date("2025-06-25T00:00:00Z"),
      status: "pending",
      description: "Biaya seragam Budi Santoso",
    },
  });

  console.log("Tagihan created for Budi");

  // Buat data Transaksi
  await prisma.transaksi.create({
    data: {
      santriId: santriAhmad.id,
      tagihanId: tagihanAhmad1.id,
      amount: BigInt(150000),
      status: "pending",
      paymentDate: new Date(),
      note: "Menunggu konfirmasi pembayaran",
    },
  });
  console.log("Transaksi Ahmad 1 created.");

  await prisma.transaksi.create({
    data: {
      santriId: santriSiti.id,
      tagihanId: tagihanSiti1.id,
      amount: BigInt(250000),
      status: "pending",
      paymentDate: new Date(),
      note: "Menunggu konfirmasi pembayaran",
    },
  });
  console.log("Transaksi Siti 1 created.");

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 