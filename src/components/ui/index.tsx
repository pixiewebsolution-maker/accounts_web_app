"use client";
import { cn, getStatusColor } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

// ========================
// STAT CARD
// ========================
interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: ReactNode;
  gradient?: string;
  subtitle?: string;
}

export function StatCard({ title, value, change, changeType, icon, gradient, subtitle }: StatCardProps) {
  return (
    <div
      className="card p-6 flex flex-col gap-4 animate-fade-in"
      style={gradient ? { background: gradient, border: "1px solid rgba(255,255,255,0.06)" } : {}}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>{title}</p>
          {subtitle && <p className="text-xs mt-1" style={{ color: "#334155" }}>{subtitle}</p>}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</p>
        {change && (
          <div className="flex items-center gap-1.5 mt-2">
            {changeType === "up" && <TrendingUp size={13} color="#10b981" />}
            {changeType === "down" && <TrendingDown size={13} color="#ef4444" />}
            <span
              className="text-xs font-medium"
              style={{ color: changeType === "up" ? "#10b981" : changeType === "down" ? "#ef4444" : "#64748b" }}
            >
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================
// STATUS BADGE
// ========================
interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const colors = getStatusColor(status);
  return (
    <span
      className={cn("badge", colors)}
      style={{ fontSize: size === "sm" ? "0.65rem" : "0.7rem" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "currentColor", opacity: 0.8 }}
      />
      {status}
    </span>
  );
}

// ========================
// SECTION HEADER
// ========================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ========================
// PROGRESS BAR
// ========================
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  height?: number;
}

export function ProgressBar({ value, max = 100, color, showLabel = true, height = 6 }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = color || (pct >= 75 ? "#10b981" : pct >= 40 ? "#6366f1" : "#f59e0b");

  return (
    <div className="flex items-center gap-3">
      <div className="progress-bar flex-1" style={{ height }}>
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: barColor,
            height: "100%",
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#64748b", minWidth: 32 }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}

// ========================
// AVATAR GROUP
// ========================
interface AvatarGroupProps {
  names: string[];
  max?: number;
}

export function AvatarGroup({ names, max = 3 }: AvatarGroupProps) {
  const visible = names.slice(0, max);
  const overflow = names.length - max;

  const colors = [
    "linear-gradient(135deg, #6366f1, #7c3aed)",
    "linear-gradient(135deg, #10b981, #059669)",
    "linear-gradient(135deg, #f59e0b, #d97706)",
    "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    "linear-gradient(135deg, #ec4899, #be185d)",
  ];

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((name, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white border-2 border-[#12121f]"
          style={{
            background: colors[i % colors.length],
            fontSize: "0.6rem",
            zIndex: visible.length - i,
          }}
          title={name}
        >
          {name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center font-bold border-2 border-[#12121f]"
          style={{ background: "rgba(255,255,255,0.1)", color: "#64748b", fontSize: "0.6rem" }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

// ========================
// EMPTY STATE
// ========================
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm mb-4" style={{ color: "#475569", maxWidth: 280 }}>{description}</p>
      {action}
    </div>
  );
}

// ========================
// PAGE WRAPPER
// ========================
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn("p-6 max-w-[1600px] mx-auto", className)}>{children}</div>
  );
}
