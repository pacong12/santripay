"use client"

import { ArrowLeft, Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface Pembayaran {
  id: string
  tagihanId: string
  santriId: string
  amount: number
  paymentDate: string
  note: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
  santri: {
    name: string
    kelas: {
      name: string
    }
  }
  tagihan: {
    jenisTagihan: {
      name: string
    }
  }
}

export default function PembayaranPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [selectedPembayaran, setSelectedPembayaran] = useState<Pembayaran | null>(null)
  const [rejectionNote, setRejectionNote] = useState("")

  const { data: pembayaran, isLoading } = useQuery<Pembayaran[]>({
    queryKey: ["pembayaran"],
    queryFn: async () => {
      const response = await fetch("/api/pembayaran", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Gagal mengambil data pembayaran")
      }
      return response.json()
    },
  })

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/pembayaran/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast.success("Pembayaran berhasil disetujui")
      queryClient.invalidateQueries({ queryKey: ["pembayaran"] })
    } catch (error) {
      console.error("Error approving payment:", error)
      toast.error(error instanceof Error ? error.message : "Gagal menyetujui pembayaran")
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectionNote) {
      toast.error("Alasan penolakan harus diisi")
      return
    }

    try {
      const response = await fetch(`/api/pembayaran/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: rejectionNote }),
        credentials: "include",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast.success("Pembayaran berhasil ditolak")
      setRejectionNote("")
      setSelectedPembayaran(null)
      queryClient.invalidateQueries({ queryKey: ["pembayaran"] })
    } catch (error) {
      console.error("Error rejecting payment:", error)
      toast.error(error instanceof Error ? error.message : "Gagal menolak pembayaran")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Menunggu</Badge>
      case "approved":
        return <Badge variant="success">Disetujui</Badge>
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-4 p-4 pt-0 mt-6 max-w-[1400px] mx-auto w-full pb-8">
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
              <AppSidebar />
            </SheetContent>
          </Sheet>
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <div className="flex flex-col">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Pembayaran</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <Button onClick={() => router.push("/admin/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </header>

      <div className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Daftar Pembayaran</CardTitle>
              <CardDescription>Kelola dan verifikasi pembayaran dari santri.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-full items-center justify-center py-10">
                <p className="text-sm text-muted-foreground">Memuat data pembayaran...</p>
              </div>
            ) : pembayaran?.length === 0 ? (
              <div className="flex h-full items-center justify-center py-10">
                <p className="text-sm text-muted-foreground">Tidak ada pembayaran</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Santri</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Jenis Tagihan</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Catatan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pembayaran?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.santri.name}</TableCell>
                        <TableCell>{item.santri.kelas.name}</TableCell>
                        <TableCell>{item.tagihan.jenisTagihan.name}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.amount)}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(item.paymentDate), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.note}</TableCell>
                        <TableCell>
                          {item.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(item.id)}
                              >
                                Setujui
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setSelectedPembayaran(item)}
                                  >
                                    Tolak
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Tolak Pembayaran</DialogTitle>
                                    <DialogDescription>
                                      Berikan alasan penolakan pembayaran ini.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="note">Alasan Penolakan</Label>
                                      <Textarea
                                        id="note"
                                        value={rejectionNote}
                                        onChange={(e) => setRejectionNote(e.target.value)}
                                        placeholder="Masukkan alasan penolakan..."
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleReject(item.id)}
                                    >
                                      Tolak Pembayaran
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 