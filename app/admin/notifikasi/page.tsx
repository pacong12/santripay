"use client"

import { Bell, ArrowLeft, Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
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
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

interface Notifikasi {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export default function NotifikasiPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: notifikasi, isLoading } = useQuery<Notifikasi[]>({
    queryKey: ["notifikasi-admin"],
    queryFn: async () => {
      const response = await fetch("/api/notifikasi/admin", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Gagal mengambil notifikasi")
      }
      return response.json()
    },
  })

  const markAsRead = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const response = await fetch("/api/notifikasi/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id, isRead }),
      })
      if (!response.ok) {
        throw new Error("Gagal memperbarui notifikasi")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifikasi-admin"] })
      toast.success("Notifikasi diperbarui")
    },
    onError: () => {
      toast.error("Gagal memperbarui notifikasi")
    },
  })

  const unreadCount = notifikasi?.filter((n) => !n.isRead).length || 0

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
                  <BreadcrumbPage>Notifikasi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight">Notifikasi</h2>
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
            <CardTitle>Notifikasi Anda</CardTitle>
            <CardDescription>Kelola dan lihat semua notifikasi di sini.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center py-10">
                  <p className="text-sm text-muted-foreground">Memuat notifikasi...</p>
                </div>
              ) : notifikasi?.length === 0 ? (
                <div className="flex h-full items-center justify-center py-10">
                  <p className="text-sm text-muted-foreground">Tidak ada notifikasi</p>
                </div>
              ) : (
                <div className="grid gap-1 p-2">
                  {notifikasi?.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex cursor-pointer flex-col items-start gap-1 rounded-lg p-3 transition-colors hover:bg-accent hover:text-accent-foreground",
                        !item.isRead && "bg-muted"
                      )}
                      onClick={() => {
                        if (!item.isRead) {
                          markAsRead.mutate({ id: item.id, isRead: true })
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 