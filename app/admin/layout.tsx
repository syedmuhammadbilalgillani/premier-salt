import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      {/* Scopes the shadcn theme CSS variables (see app/globals.css) to the
          admin panel only, so they never leak into the storefront, which
          has its own separate color system. `contents` keeps this wrapper
          out of the box/layout model entirely — CSS custom properties still
          inherit through it. */}
      <div className="admin-theme contents">
        {children}
        <Toaster />
      </div>
    </SessionProvider>
  );
}
