"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SantriSidebar } from "@/components/santri/santri-sidebar";
import { Separator } from "@/components/ui/separator";

import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

export default function PembayaranSantriPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const { data: tagihanResponse, isLoading } = useQuery({
    queryKey: ["tagihan"],
    queryFn: async () => {
      const response = await fetch("/api/tagihan/santri");
      if (!response.ok) {
        throw new Error("Gagal mengambil data tagihan");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const tagihan = tagihanResponse?.data || [];
  const selectedTagihanId = searchParams.get("tagihan");
  const selectedTagihan = tagihan.find((t: Tagihan) => t.id === selectedTagihanId);

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
    <div className="flex flex-col flex-1 gap-4 p-4 pt-0 mt-6 max-w-[1400px] mx-auto w-full">
      <header className="flex h-14 shrink-0 items-center justify-between w-full">
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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Pembayaran</h2>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daftar Tagihan</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {tagihan.length === 0 ? (
                <div className="flex h-32 items-center justify-center">
                  <p className="text-sm text-muted-foreground">Tidak ada tagihan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tagihan.map((t: Tagihan) => (
                    <div
                      key={t.id}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4 w-full",
                        selectedTagihanId === t.id && "border-primary"
                      )}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {t.jenisTagihan.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Jatuh tempo: {new Date(t.dueDate).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Rp {Number(t.amount).toLocaleString("id-ID")}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn("mt-1", getStatusColor(t.status))}
                          >
                            {getStatusText(t.status)}
                          </Badge>
                        </div>
                        {t.status === "pending" && (
                          <Button
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => router.push(`/santri/pembayaran?tagihan=${t.id}`)}
                          >
                            Bayar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {selectedTagihan && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Detail Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Jenis Tagihan</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTagihan.jenisTagihan.name}
                  </p>
                </div>
              <div className="space-y-2">
                  <p className="text-sm font-medium">Jumlah</p>
                  <p className="text-sm text-muted-foreground">
                    Rp {Number(selectedTagihan.amount).toLocaleString("id-ID")}
                  </p>
              </div>
              <div className="space-y-2">
                  <p className="text-sm font-medium">Jatuh Tempo</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedTagihan.dueDate).toLocaleDateString("id-ID")}
                  </p>
              </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant="outline"
                    className={cn(getStatusColor(selectedTagihan.status))}
                  >
                    {getStatusText(selectedTagihan.status)}
                  </Badge>
                </div>
                {selectedTagihan.status === "pending" && (
                  <Button className="w-full" onClick={() => router.push("/santri/pembayaran/bayar")}>
                    Lanjutkan Pembayaran
                  </Button>
                )}
              </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
} 