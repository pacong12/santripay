"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Menu, History } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SantriSidebar } from "@/components/santri/santri-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Transaksi {
  id: string;
  amount: number;
  status: string;
  paymentDate: string;
  note?: string;
  tagihan: {
    jenisTagihan: {
      name: string;
    };
  };
}

export default function RiwayatPembayaranPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchTransaksi();
    }
  }, [session]);

  const fetchTransaksi = async () => {
    try {
      const response = await fetch("/api/transaksi/santri");
      if (!response.ok) throw new Error("Gagal mengambil data transaksi");
      const data = await response.json();
      setTransaksi(data.data);
    } catch (error) {
      console.error("Error fetching transaksi:", error);
      toast.error("Gagal mengambil data transaksi");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "approved":
        return "Disetujui";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-4 p-4 pt-0 mt-6">
      <header className="flex h-14 shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SantriSidebar />
            </SheetContent>
          </Sheet>
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <div className="flex flex-col">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/santri/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Riwayat Pembayaran</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight">Riwayat Pembayaran</h2>
          </div>
        </div>
        <Button onClick={() => router.push("/santri/dashboard")}>
          <History className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </header>
      <div className="flex-1 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis Tagihan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaksi.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      {new Date(t.paymentDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{t.tagihan.jenisTagihan.name}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(Number(t.amount))}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(t.status)}>
                        {getStatusText(t.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{t.note || "-"}</TableCell>
                  </TableRow>
                ))}
                {transaksi.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Belum ada riwayat pembayaran
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 