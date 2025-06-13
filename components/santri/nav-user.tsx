"use client"

import { LogOut, Settings, User, Moon, Sun, Bell } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Notifikasi {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const queryClient = useQueryClient()

  const { data: notifikasi = [] } = useQuery<Notifikasi[]>({
    queryKey: ["notifikasi"],
    queryFn: async () => {
      const response = await fetch("/api/notifikasi")
      if (!response.ok) {
        throw new Error("Gagal mengambil notifikasi")
      }
      return response.json()
    },
  })

  const markAsRead = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const response = await fetch("/api/notifikasi", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isRead }),
      })
      if (!response.ok) {
        throw new Error("Gagal memperbarui notifikasi")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifikasi"] })
      toast.success("Notifikasi diperbarui")
    },
    onError: () => {
      toast.error("Gagal memperbarui notifikasi")
    },
  })

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const unreadNotifikasi = notifikasi.filter((n) => !n.isRead)
      await Promise.all(
        unreadNotifikasi.map((n) =>
          fetch("/api/notifikasi", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: n.id, isRead: true }),
          })
        )
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifikasi"] })
      toast.success("Semua notifikasi ditandai sebagai telah dibaca")
    },
    onError: () => {
      toast.error("Gagal memperbarui notifikasi")
    },
  })

  const handleProfileClick = () => {
    router.push("/santri/profil")
  }

  const unreadCount = notifikasi.filter((n) => !n.isRead).length

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <div className="relative">
                  <Avatar className="size-8">
                    <AvatarImage src="/avatars/santri.png" alt="Santri" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{session?.user?.name || "Santri"}</span>
                  <span className="truncate text-xs">{session?.user?.email || "santri@example.com"}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Akun
              </DropdownMenuLabel>
              <DropdownMenuItem 
                className="gap-2 p-2"
                onClick={handleProfileClick}
              >
                <User className="size-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem 
                    className="gap-2 p-2"
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Settings className="size-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Pengaturan</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Kelola preferensi akun Anda di sini.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Moon className="size-4" />
                        <h4 className="text-sm font-medium">Tampilan</h4>
                      </div>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label className="text-base">Mode Gelap</Label>
                            <p className="text-sm text-muted-foreground">
                              Ubah tampilan aplikasi ke mode gelap
                            </p>
                          </div>
                          <Switch
                            id="theme"
                            checked={theme === "dark"}
                            onCheckedChange={(checked) => {
                              setTheme(checked ? "dark" : "light")
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Bell className="size-4" />
                        <h4 className="text-sm font-medium">Notifikasi</h4>
                      </div>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label className="text-base">Notifikasi Aplikasi</Label>
                            <p className="text-sm text-muted-foreground">
                              Terima notifikasi di dalam aplikasi
                            </p>
                          </div>
                          <Switch
                            id="notifications"
                            checked={notifications}
                            onCheckedChange={setNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label className="text-base">Notifikasi Email</Label>
                            <p className="text-sm text-muted-foreground">
                              Terima notifikasi melalui email
                            </p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Bell className="size-4" />
                    <span>Notifikasi</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {unreadCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <DialogTitle className="text-xl font-semibold">Notifikasi</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                          Lihat dan kelola notifikasi Anda
                        </DialogDescription>
                      </div>
                      {unreadCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAllAsRead.mutate()}
                        >
                          Tandai Semua Dibaca
                        </Button>
                      )}
                    </div>
                  </DialogHeader>
                  <ScrollArea className="h-[400px]">
                    {notifikasi.length === 0 ? (
                      <div className="flex h-full items-center justify-center py-10">
                        <p className="text-sm text-muted-foreground">Tidak ada notifikasi</p>
                      </div>
                    ) : (
                      <div className="grid gap-1 p-2">
                        {notifikasi.map((item) => (
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
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/santri/notifikasi")}
                    >
                      Lihat Semua Notifikasi
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="gap-2 p-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <LogOut className="size-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin ingin keluar?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Anda akan keluar dari sistem. Anda perlu login kembali untuk mengakses sistem.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => signOut()}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                      Keluar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}