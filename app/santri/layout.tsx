"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SantriSidebar } from "@/components/santri/santri-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function SantriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "santri") {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Memuat...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <SantriSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
} 