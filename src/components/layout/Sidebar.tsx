"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  CreditCard,
  UserCog,
  TrendingUp,
  Receipt,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  X,
  Wallet,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Expenses", href: "/dashboard/expenses", icon: Wallet },
  { label: "Employees", href: "/dashboard/employees", icon: UserCog },
  { label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { label: "Quotations", href: "/dashboard/quotations", icon: Receipt },
  { label: "Todos Monitor", href: "/dashboard/todos", icon: CheckSquare },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
      style={{ background: "#0d0d1a", borderRight: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }}
        >
          <Building2 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-bold text-base text-white tracking-tight">Pixie Webs</span>
            <p className="text-xs" style={{ color: "#475569" }}>Management Suite</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-semibold px-3 mb-2 uppercase tracking-widest" style={{ color: "#334155" }}>
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn("sidebar-link", active && "active")}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" style={{ color: active ? "#6366f1" : undefined }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-0.5 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/dashboard/settings" onClick={onMobileClose} className={cn("sidebar-link", pathname === "/dashboard/settings" && "active")}>
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        {/* User */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: "0.65rem" }}>SF</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Syed Farhan PN</p>
              <p className="text-xs" style={{ color: "#475569" }}>Admin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-full relative">
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 cursor-pointer"
          style={{
            background: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#6366f1",
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={onMobileClose}
          />
          <div className="relative z-10 flex flex-col h-full">
            <SidebarContent />
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-1 rounded-lg"
              style={{ color: "#94a3b8" }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
