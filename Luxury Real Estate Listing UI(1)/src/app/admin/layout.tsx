"use client";
import React, { useEffect } from "react";
import { AuthProvider, useAdminAuth } from "./AuthGuard";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Home, FileText, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (pathname !== "/admin/login") {
        if (!user) {
          router.replace("/admin/login");
        } else if (!isAdmin) {
          toast.error("Access Denied: You do not have administrator privileges.");
          logout().then(() => router.replace("/admin/login"));
        }
      } else {
        if (user && isAdmin) {
          router.replace("/admin");
        }
      }
    }
  }, [user, isAdmin, loading, pathname, router, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center text-white/55 font-['Montserrat']">
        <Loader2 className="w-8 h-8 animate-spin text-[#fbbf24] mb-4" />
        <span>Authenticating...</span>
      </div>
    );
  }

  // If we are on login page, render child component directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If auth guard blocks rendering to prevent flash of content
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-white/55 font-['Montserrat']">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col lg:flex-row font-['Montserrat']">
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 bg-[#1A1A1A] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <Link href="/" className="font-['Cormorant_Garamond'] text-2xl font-light tracking-wider text-white">
              NOUVELLE MAISON
            </Link>
          </div>
          {/* Nav Links */}
          <nav className="p-4 space-y-2">
            <Link
              href="/admin"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                pathname === "/admin"
                  ? "bg-[#fbbf24] text-[#1A1A1A] font-semibold"
                  : "text-white/75 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/listings"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                pathname.startsWith("/admin/listings")
                  ? "bg-[#fbbf24] text-[#1A1A1A] font-semibold"
                  : "text-white/75 hover:text-white hover:bg-white/5"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Listings</span>
            </Link>
            <Link
              href="/admin/submissions"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                pathname.startsWith("/admin/submissions")
                  ? "bg-[#fbbf24] text-[#1A1A1A] font-semibold"
                  : "text-white/75 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Submissions</span>
            </Link>
          </nav>
        </div>
        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => logout().then(() => router.replace("/admin/login"))}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
