"use client";

import { AppSidebar } from "@/components/admin/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  )
} 