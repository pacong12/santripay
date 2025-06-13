"use client"

import {
  BarChart3,
  CreditCard,
  History,
  LayoutDashboard,
  User,
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
      url: "/santri/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/santri/dashboard",
    },
    {
      title: "Pembayaran",
      url: "/santri/pembayaran",
      icon: CreditCard,
      isActive: pathname === "/santri/pembayaran",
    },
    {
      title: "Riwayat Pembayaran",
      url: "/santri/riwayat-pembayaran",
      icon: History,
      isActive: pathname === "/santri/riwayat-pembayaran",
    },
    {
      title: "Notifikasi",
      url: "/santri/notifikasi",
      icon: Bell,
      isActive: pathname === "/santri/notifikasi",
    },
    {
      title: "Profil",
      url: "/santri/profil",
      icon: User,
      isActive: pathname === "/santri/profil",
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