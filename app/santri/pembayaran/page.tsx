"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Menu, CreditCard } from "lucide-react";
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

interface PembayaranForm {
  tagihanId: string;
  amount: number;
  paymentMethod: "transfer" | "cash" | "qris";
  paymentProof?: string;
  note?: string;
}

export default function PembayaranPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tagihan, setTagihan] = useState<Tagihan[]>([]);
  const [formData, setFormData] = useState<PembayaranForm>({
    tagihanId: "",
    amount: 0,
    paymentMethod: "transfer",
  });

  useEffect(() => {
    if (session?.user) {
      fetchTagihan();
    }
  }, [session]);

  const fetchTagihan = async () => {
    try {
      const response = await fetch("/api/tagihan/santri");
      if (!response.ok) throw new Error("Gagal mengambil data tagihan");
      const data = await response.json();
      setTagihan(data.data);
    } catch (error) {
      console.error("Error fetching tagihan:", error);
      toast.error("Gagal mengambil data tagihan");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/pembayaran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan pembayaran");
      }

      toast.success("Pembayaran berhasil dibuat dan menunggu konfirmasi admin");
      router.push("/santri/riwayat-pembayaran");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleTagihanChange = (value: string) => {
    const selectedTagihan = tagihan.find((t) => t.id === value);
    if (selectedTagihan) {
      setFormData({
        ...formData,
        tagihanId: value,
        amount: selectedTagihan.amount,
      });
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
                  <BreadcrumbPage>Pembayaran</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight">Pembayaran Tagihan</h2>
          </div>
        </div>
        <Button onClick={() => router.push("/santri/dashboard")}>
          <CreditCard className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </header>
      <div className="flex-1 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tagihan">Pilih Tagihan</Label>
                <Select
                  value={formData.tagihanId}
                  onValueChange={handleTagihanChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tagihan" />
                  </SelectTrigger>
                  <SelectContent>
                    {tagihan
                      .filter((t) => t.status !== "paid")
                      .map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.jenisTagihan.name} -{" "}
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(Number(t.amount))}
                          {t.status === "overdue" && " (Terlambat)"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Pembayaran</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value: "transfer" | "cash" | "qris") =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transfer">Transfer Bank</SelectItem>
                    <SelectItem value="cash">Tunai</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.paymentMethod === "transfer" && (
                <div className="space-y-2">
                  <Label htmlFor="paymentProof">Bukti Pembayaran</Label>
                  <Input
                    id="paymentProof"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // TODO: Implement file upload
                        toast.info("Fitur upload bukti pembayaran akan segera hadir");
                      }
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="note">Catatan (Opsional)</Label>
                <Input
                  id="note"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  placeholder="Tambahkan catatan jika diperlukan"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 