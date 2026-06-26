import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import React from "react";

import { ActiveThemeProvider } from "@/components/theme-customizer/active-theme";
import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "@/lib/fonts";
import { DEFAULT_THEME } from "@/lib/themes/themes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tio Dog Barbearia",
  description: "Sistema de gestão para barbearias",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeSettings = {
    preset: (cookieStore.get("theme_preset")?.value ?? DEFAULT_THEME.preset) as any,
    scale: (cookieStore.get("theme_scale")?.value ?? DEFAULT_THEME.scale) as any,
    radius: (cookieStore.get("theme_radius")?.value ?? DEFAULT_THEME.radius) as any,
    contentLayout: (cookieStore.get("theme_content_layout")?.value ??
      DEFAULT_THEME.contentLayout) as any
  };

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([_, value]) => value)
      .map(([key, value]) => [`data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value])
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://dashboard.shadcnuikit.com/iframe-listener.js" strategy="afterInteractive" />
      </head>
      <body
        suppressHydrationWarning
        className={cn("bg-background group/layout font-sans", fontVariables)}
        {...bodyAttributes}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          <ClerkProvider
            signInForceRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/dashboard"
            afterSignOutUrl="/sign-in"
          >
            <ActiveThemeProvider initialTheme={themeSettings}>
              {children}
              <Toaster position="top-center" richColors />
              <NextTopLoader color="var(--primary)" showSpinner={false} height={2} shadow-sm="none" />
            </ActiveThemeProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}