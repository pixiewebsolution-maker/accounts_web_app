"use client";
import { useState } from "react";
import { Bell, Search, Menu, Moon, Sun, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/lib/store";

const notifications = [
  { id: "n1", title: "Welcome to AgencyOS", message: "Supabase cloud CRM migration has been successfully finalized.", type: "success", read: false, createdAt: new Date().toISOString().split("T")[0] },
  { id: "n2", title: "Auth Updates", message: "User Sign Up & Password Reset features are now live.", type: "info", read: false, createdAt: new Date().toISOString().split("T")[0] }
];

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMobileMenu?: () => void;
  action?: { label: string; onClick: () => void };
}

export default function Topbar({ title, subtitle, onMobileMenu, action }: TopbarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const unread = notifications.filter((n) => !n.read).length;
  const { toggleMobileMenu } = useLayoutStore();

  const notifColors: Record<string, string> = {
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        minHeight: 64,
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-lg cursor-pointer"
          style={{ color: "#94a3b8", background: "rgba(255,255,255,0.05)" }}
          onClick={onMobileMenu || toggleMobileMenu}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
          {subtitle && <p className="text-xs" style={{ color: "#475569" }}>{subtitle}</p>}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          {showSearch ? (
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => { setShowSearch(false); setSearchQuery(""); }}
              placeholder="Search clients, projects..."
              className="text-sm"
              style={{
                width: 280,
                padding: "0.4rem 0.875rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: 8,
                color: "#f1f5f9",
                outline: "none",
              }}
            />
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-lg cursor-pointer flex items-center gap-2"
              style={{ color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Search size={16} />
              <span className="text-sm hidden md:block">Search...</span>
              <span className="text-xs px-1.5 py-0.5 rounded ml-8 hidden md:block" style={{ background: "rgba(255,255,255,0.08)", color: "#475569" }}>⌘K</span>
            </button>
          )}
        </div>

        {/* Action Button */}
        {action && (
          <button className="btn btn-primary" onClick={action.onClick}>
            <Plus size={16} />
            <span className="hidden sm:block">{action.label}</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-lg cursor-pointer"
            style={{ color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white"
                style={{ background: "#ef4444", fontSize: "0.6rem" }}
              >
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-xl overflow-hidden shadow-2xl z-50"
              style={{ background: "#12121f", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="font-semibold text-sm text-white">Notifications</span>
                {unread > 0 && (
                  <span className="badge" style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1", borderColor: "rgba(99,102,241,0.2)", fontSize: "0.65rem" }}>
                    {unread} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 flex items-start gap-3 cursor-pointer"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background: !n.read ? "rgba(99,102,241,0.04)" : "transparent",
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: notifColors[n.type] || "#6366f1" }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{n.message}</p>
                      <p className="text-xs mt-1" style={{ color: "#334155" }}>{formatDate(n.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="avatar cursor-pointer" style={{ width: 36, height: 36 }}>SF</div>
      </div>
    </header>
  );
}
