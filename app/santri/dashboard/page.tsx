"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Receipt, 
  Wallet,
  Menu,
  Bell,
} from "lucide-react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Tagihan {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
  jenisTagihan: {
    id: string;
    name: string;
  };
}

interface Transaksi {
  id: string;
  amount: number;
  status: string;
  paymentDate: string;
  tagihan: {
    jenisTagihan: {
      name: string;
    };
  };
}

interface Statistik {
  totalTagihan: number;
  totalDibayar: number;
  totalMenunggu: number;
  totalTerlambat: number;
}

interface Notifikasi {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function DashboardSantriPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);

  const { data: tagihanResponse, isLoading: isLoadingTagihan } = useQuery({
    queryKey: ["tagihan"],
    queryFn: async () => {
      const response = await fetch("/api/tagihan/santri");
      if (!response.ok) {
        throw new Error("Gagal mengambil data tagihan");
      }
      return response.json();
    },
  });

  const { data: transaksiResponse, isLoading: isLoadingTransaksi } = useQuery({
    queryKey: ["transaksi"],
    queryFn: async () => {
      const response = await fetch("/api/transaksi/santri");
      if (!response.ok) {
        throw new Error("Gagal mengambil data transaksi");
      }
      return response.json();
    },
  });

  const { data: notifikasi = [], isLoading: isLoadingNotifikasi } = useQuery<Notifikasi[]>({
    queryKey: ["notifikasi"],
    queryFn: async () => {
      const response = await fetch("/api/notifikasi");
      if (!response.ok) {
        throw new Error("Gagal mengambil notifikasi");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (!isLoadingTagihan && !isLoadingTransaksi && !isLoadingNotifikasi) {
      setLoading(false);
    }
  }, [isLoadingTagihan, isLoadingTransaksi, isLoadingNotifikasi]);

  const markAsRead = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const response = await fetch("/api/notifikasi", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isRead }),
      });
      if (!response.ok) {
        throw new Error("Gagal memperbarui notifikasi");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifikasi"] });
      toast.success("Notifikasi diperbarui");
    },
    onError: () => {
      toast.error("Gagal memperbarui notifikasi");
    },
  });

  const calculateStatistik = (tagihan: Tagihan[], transaksi: Transaksi[]): Statistik => {
    const totalTagihan = tagihan?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalDibayar = transaksi
      ?.filter(t => t.status === "approved")
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalMenunggu = tagihan
      ?.filter(t => t.status === "pending")
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalTerlambat = tagihan
      ?.filter(t => t.status === "overdue")
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    return {
      totalTagihan,
      totalDibayar,
      totalMenunggu,
      totalTerlambat,
    };
  };

  const tagihan = tagihanResponse?.data || [];
  const transaksi = transaksiResponse?.data || [];
  const statistik = calculateStatistik(tagihan, transaksi);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "approved":
        return "Disetujui";
      case "rejected":
        return "Ditolak";
      case "overdue":
        return "Terlambat";
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Memuat data...</div>;
  }

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Notifikasi
                {notifikasi.filter((n) => !n.isRead).length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {notifikasi.filter((n) => !n.isRead).length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-medium">Notifikasi</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push("/santri/notifikasi")}
                >
                  Lihat Semua
                </Button>
              </div>
              <ScrollArea className="h-[300px]">
                {notifikasi.length === 0 ? (
                  <div className="flex h-full items-center justify-center py-10">
                    <p className="text-sm text-muted-foreground">Tidak ada notifikasi</p>
                  </div>
                ) : (
                  <div className="grid gap-1 p-2">
                    {notifikasi.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex cursor-pointer flex-col items-start gap-1 rounded-lg p-3 transition-colors hover:bg-accent hover:text-accent-foreground",
                          !item.isRead && "bg-muted"
                        )}
                        onClick={() => {
                          if (!item.isRead) {
                            markAsRead.mutate({ id: item.id, isRead: true });
                          }
                        }}
                      >
                        <div className="flex w-full items-start justify-between gap-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {item.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.message}
                            </p>
                          </div>
                          {!item.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </header>
      <div className="flex-1 space-y-6">
        {/* Statistik Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(statistik.totalTagihan)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dibayar</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(statistik.totalDibayar)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu Pembayaran</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(statistik.totalMenunggu)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tagihan Terlambat</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(statistik.totalTerlambat)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Tagihan yang Perlu Dibayar */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Tagihan yang Perlu Dibayar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Tagihan</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Jatuh Tempo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tagihan
                    .filter((t: Tagihan) => t.status !== "paid")
                    .map((t: Tagihan) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.jenisTagihan.name}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(Number(t.amount))}
                        </TableCell>
                        <TableCell>
                          {new Date(t.dueDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(t.status)}>
                            {getStatusText(t.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/santri/pembayaran")}
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            Bayar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {tagihan.filter((t: Tagihan) => t.status !== "paid").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Tidak ada tagihan yang perlu dibayar
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Riwayat Pembayaran Terakhir */}
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Riwayat Pembayaran</CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push("/santri/riwayat-pembayaran")}>
                  Lihat Semua
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jenis Tagihan</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaksi.slice(0, 5).map((t: Transaksi) => (
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
                    </TableRow>
                  ))}
                  {transaksi.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
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
    </div>
  );
}