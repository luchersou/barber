import { ReactNode } from "react";
import { AuthCarousel } from "./_components/auth-carousel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-1">
      <div className="grid h-[calc(100vh-1rem)] w-full max-w-[1600px] gap-4 lg:grid-cols-2">
        <div className="hidden lg:block lg:p-1">
          <AuthCarousel />
        </div>
        <div className="flex items-center justify-center py-8">
          {children}
        </div>
      </div>
    </main>
  );
}