"use client"

import * as React from "react"
import { School } from "lucide-react"

import { NavMain } from "@/components/admin/nav-main"
import { NavUser } from "@/components/admin/nav-user"
import { AdminNavBottom } from "@/components/admin/nav-bottom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar collapsible="icon" className="hidden md:block" {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4">
            <School className="size-6" />
            <span className="font-bold">Santri Pay</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <AdminNavBottom />
    </>
  )
}
