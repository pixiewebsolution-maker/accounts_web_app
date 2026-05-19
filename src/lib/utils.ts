import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    completed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    overdue: "text-red-400 bg-red-400/10 border-red-400/20",
    paid: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    "partially paid": "text-amber-400 bg-amber-400/10 border-amber-400/20",
    unpaid: "text-red-400 bg-red-400/10 border-red-400/20",
    draft: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    sent: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    "in progress": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "on hold": "text-orange-400 bg-orange-400/10 border-orange-400/20",
    suspended: "text-red-400 bg-red-400/10 border-red-400/20",
    hold: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    demo: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };
  return colors[status.toLowerCase()] || "text-slate-400 bg-slate-400/10 border-slate-400/20";
}

export function calculateGST(amount: number, gstRate = 18): { subtotal: number; gst: number; total: number } {
  const gst = (amount * gstRate) / 100;
  return { subtotal: amount, gst, total: amount + gst };
}

export function generateInvoiceNumber(prefix = "INV"): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${year}${month}-${rand}`;
}

export function daysUntil(date: string | Date): number {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
