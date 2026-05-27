import React from "react";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/layout/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen =
    cookieStore.get("sidebar_state")?.value === "true" ||
    cookieStore.get("sidebar_state") === undefined;

  return (
    <TooltipProvider>
      <SidebarProvider
				defaultOpen={defaultOpen}
				style={{
					"--sidebar-width": "calc(var(--spacing) * 64)",
					"--header-height": "calc(var(--spacing) * 14)",
				} as React.CSSProperties}
			>
        <AppSidebar variant="inset" />
        <SidebarInset>
					<SiteHeader />
          <main className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}