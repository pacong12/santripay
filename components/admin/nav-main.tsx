"use client"

import {
  BarChart3,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  School,
  Settings2,
  Users,
  Bell,
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

export function NavMain() {
  const pathname = usePathname()

  const items: NavItem[] = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/admin/dashboard",
    },
    {
      title: "Santri",
      url: "/admin/santri",
      icon: Users,
      isActive: pathname.startsWith("/admin/santri"),
    },
    {
      title: "Pembayaran",
      url: "/admin/pembayaran",
      icon: CreditCard,
      isActive: pathname.startsWith("/admin/pembayaran"),
    },
    {
      title: "Notifikasi",
      url: "/admin/notifikasi",
      icon: Bell,
      isActive: pathname.startsWith("/admin/notifikasi"),
    },
    {
      title: "Transaksi",
      url: "/admin/transaksi",
      icon: BarChart3,
      isActive: pathname.startsWith("/admin/transaksi"),
    },
    {
      title: "Kelas",
      url: "/admin/kelas",
      icon: School,
      isActive: pathname.startsWith("/admin/kelas"),
    },
    {
      title: "Naik Kelas",
      url: "/admin/naik-kelas",
      icon: School,
      isActive: pathname.startsWith("/admin/naik-kelas"),
    },
    {
      title: "Tahun Ajaran",
      url: "/admin/tahun-ajaran",
      icon: School,
      isActive: pathname.startsWith("/admin/tahun-ajaran"),
    },
    {
      title: "Jenis Tagihan",
      url: "/admin/jenis-tagihan",
      icon: BookOpen,
      isActive: pathname.startsWith("/admin/jenis-tagihan"),
    },
    {
      title: "Pengaturan",
      url: "/admin/pengaturan",
      icon: Settings2,
      isActive: pathname.startsWith("/admin/pengaturan"),
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild data-active={item.isActive}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
} 