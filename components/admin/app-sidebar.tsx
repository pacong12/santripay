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
  useSidebar,
} from "@/components/ui/sidebar"

function SidebarHeaderContent() {
  const { state } = useSidebar()
  
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-4">
      <School className="size-7 shrink-0" />
      {state === "expanded" && (
        <span className="font-bold text-lg truncate">Santri Pay</span>
      )}
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar collapsible="icon" className="hidden md:block" {...props}>
        <SidebarHeader>
          <SidebarHeaderContent />
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
