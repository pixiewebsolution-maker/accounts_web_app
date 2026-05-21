"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  FolderKanban,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import {
  StatCard,
  StatusBadge,
  SectionHeader,
  ProgressBar,
  PageWrapper,
} from "@/components/ui";
import { dbService } from "@/lib/db";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { Client, Project, Invoice, Payment, Expense, Employee } from "@/lib/data";

const CHART_COLORS = {
  indigo: "#6366f1",
  purple: "#8b5cf6",
  emerald: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
  blue: "#3b82f6",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3 text-sm shadow-xl"
        style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span style={{ color: "#94a3b8" }}>{entry.name}: </span>
            <span className="font-medium text-white">
              {entry.name === "clients" ? entry.value : formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pieMode, setPieMode] = useState<"service" | "ledger">("ledger");

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [
          clientsData,
          projectsData,
          invoicesData,
          paymentsData,
          expensesData,
          employeesData,
        ] = await Promise.all([
          dbService.getAll("clients"),
          dbService.getAll("projects"),
          dbService.getAll("invoices"),
          dbService.getAll("payments"),
          dbService.getAll("expenses"),
          dbService.getAll("employees"),
        ]);
        setClients(clientsData);
        setProjects(projectsData);
        setInvoices(invoicesData);
        setPayments(paymentsData);
        setExpenses(expensesData);
        setEmployees(employeesData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  // Computed analytics
  const totalRevenue = clients.reduce((s, c) => s + (c.projectCost || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPaid = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pendingPayments = invoices
    .filter(i => i.status !== "paid")
    .reduce((s, i) => s + (i.total - i.paidAmount), 0);
  const activeProjects = projects.filter(p => p.status === "active" || p.status === "in progress");
  const completedProjects = projects.filter(p => p.status === "completed");
  const overdueInvoices = invoices.filter(i => i.status === "overdue");
  const recentInvoices = invoices.slice(0, 5);

  const netProfit = totalRevenue - totalExpenses;
  const ledgerBreakdown = [
    { name: "Net Profit", value: Math.max(0, netProfit), color: "#10b981" },
    { name: "Total Expenses", value: totalExpenses, color: "#ef4444" },
  ];

  // Monthly revenue chart from payments
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenue = monthLabels.map((month, idx) => {
    const monthPayments = payments.filter(p => {
      const d = new Date(p.date);
      return d.getMonth() === idx;
    });
    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === idx;
    });
    const rev = monthPayments.reduce((s, p) => s + p.amount, 0);
    const exp = monthExpenses.reduce((s, e) => s + e.amount, 0);
    return { month, revenue: rev, expenses: exp, profit: rev - exp };
  });

  // Service revenue from clients
  const serviceMap: Record<string, number> = {};
  clients.forEach(c => {
    (c.services || []).forEach(s => {
      serviceMap[s] = (serviceMap[s] || 0) + (c.projectCost || 0);
    });
  });
  const serviceRevenue = Object.entries(serviceMap).map(([service, revenue], i) => ({
    name: service,
    value: revenue,
    color: ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#3b82f6"][i % 5],
  }));

  const pieData =
    pieMode === "service"
      ? serviceRevenue
      : ledgerBreakdown;

  if (isLoading) {
    return (
      <>
        <Topbar title="Dashboard" subtitle="Loading your data..." onMobileMenu={() => {}} />
        <PageWrapper>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle={`Welcome back 👋 — ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
        onMobileMenu={() => {}}
      />
      <PageWrapper>
        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            change={`${clients.length} clients`}
            changeType="up"
            gradient="linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.04))"
            icon={<DollarSign size={18} color={CHART_COLORS.indigo} />}
          />
          <StatCard
            title="Pending Payments"
            value={formatCurrency(pendingPayments)}
            change={`${overdueInvoices.length} overdue`}
            changeType="down"
            gradient="linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.04))"
            icon={<Clock size={18} color={CHART_COLORS.amber} />}
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            change={`${expenses.length} records`}
            changeType="up"
            gradient="linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.04))"
            icon={<TrendingDown size={18} color={CHART_COLORS.red} />}
          />
          <StatCard
            title="Active Projects"
            value={String(activeProjects.length)}
            change={`${completedProjects.length} completed`}
            changeType="neutral"
            gradient="linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.04))"
            icon={<FolderKanban size={18} color={CHART_COLORS.emerald} />}
          />
          <StatCard
            title="Total Clients"
            value={String(clients.length)}
            change={`${employees.length} employees`}
            changeType="up"
            gradient="linear-gradient(135deg, rgba(59,130,246,0.12), rgba(37,99,235,0.04))"
            icon={<Users size={18} color={CHART_COLORS.blue} />}
          />
        </div>

        {/* CHARTS ROW */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="card p-6 lg:col-span-2">
            <SectionHeader
              title="Revenue & Expenses"
              subtitle="Monthly performance overview"
              action={
                <select
                  className="text-xs"
                  style={{ padding: "0.25rem 0.75rem", width: "auto", background: "rgba(255,255,255,0.05)", borderRadius: 6 }}
                >
                  <option>Last 12 months</option>
                </select>
              }
            />
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fill="url(#colorExpenses)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Service Revenue Pie / Ledger Pie */}
          <div className="card p-6">
            <SectionHeader
              title={pieMode === "service" ? "Revenue by Service" : "Revenue vs Expenses"}
              subtitle={pieMode === "service" ? "Breakdown by service type" : "Allocation of profit vs expenses"}
              action={
                <div className="flex items-center gap-1 p-0.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                  <button
                    onClick={() => setPieMode("ledger")}
                    className={cn(
                      "px-2 py-1 text-[10px] font-semibold rounded-md cursor-pointer transition-all",
                      pieMode === "ledger" ? "bg-[#6366f1] text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Ledger
                  </button>
                  <button
                    onClick={() => setPieMode("service")}
                    className={cn(
                      "px-2 py-1 text-[10px] font-semibold rounded-md cursor-pointer transition-all",
                      pieMode === "service" ? "bg-[#6366f1] text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Services
                  </button>
                </div>
              }
            />
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(v)} contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-xs" style={{ color: "#64748b" }}>{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Invoices */}
          <div className="card p-6 lg:col-span-2">
            <SectionHeader
               title="Recent Invoices"
               subtitle="Latest billing activity"
               action={
                 <a href="/dashboard/invoices" className="text-xs font-medium flex items-center gap-1" style={{ color: "#6366f1" }}>
                   View all <ArrowUpRight size={12} />
                 </a>
               }
             />
             <div className="overflow-x-auto">
               <table className="data-table">
                 <thead>
                   <tr>
                     <th>Invoice</th>
                     <th>Client</th>
                     <th>Amount</th>
                     <th>Status</th>
                     <th>Due</th>
                   </tr>
                 </thead>
                 <tbody>
                   {recentInvoices.map((inv) => (
                     <tr key={inv.id}>
                       <td>
                         <span className="font-medium text-white text-xs">{inv.invoiceNumber}</span>
                       </td>
                       <td>
                         <div className="flex items-center gap-2">
                           <div className="avatar" style={{ width: 26, height: 26, fontSize: "0.55rem" }}>
                             {inv.clientName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                           </div>
                           <span className="text-xs text-white">{inv.clientName}</span>
                         </div>
                       </td>
                       <td>
                         <span className="font-semibold text-white text-xs">{formatCurrency(inv.total)}</span>
                       </td>
                       <td>
                         <StatusBadge status={inv.status} size="sm" />
                       </td>
                       <td>
                         <span className="text-xs" style={{ color: "#475569" }}>{formatDate(inv.dueDate)}</span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

          {/* Active Projects + Activity */}
          <div className="space-y-6">
            {/* Active Projects */}
            <div className="card p-6">
              <SectionHeader
                title="Active Projects"
                action={
                  <a href="/dashboard/projects" className="text-xs" style={{ color: "#6366f1" }}>View all</a>
                }
              />
              <div className="space-y-4">
                {activeProjects.slice(0, 3).map((proj) => (
                  <div key={proj.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-xs font-semibold text-white">{proj.name}</p>
                        <p className="text-xs" style={{ color: "#475569" }}>{proj.clientName}</p>
                      </div>
                      <span className="text-xs font-bold" style={{ color: proj.progress >= 75 ? "#10b981" : proj.progress >= 40 ? "#6366f1" : "#f59e0b" }}>
                        {proj.progress}%
                      </span>
                    </div>
                    <ProgressBar value={proj.progress} showLabel={false} />
                    <p className="text-xs mt-1" style={{ color: "#334155" }}>Due {formatDate(proj.dueDate)}</p>
                  </div>
                ))}
                {activeProjects.length === 0 && (
                  <p className="text-xs" style={{ color: "#475569" }}>No active projects</p>
                )}
              </div>
            </div>

            {/* Quick Activity */}
            <div className="card p-6">
              <SectionHeader title="Quick Stats" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} color="#10b981" />
                    <span className="text-xs" style={{ color: "#64748b" }}>Cash received</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: "#10b981" }}>
                    {formatCurrency(totalPaid)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} color="#f59e0b" />
                    <span className="text-xs" style={{ color: "#64748b" }}>Overdue invoices</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>
                    {overdueInvoices.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={14} color="#6366f1" />
                    <span className="text-xs" style={{ color: "#64748b" }}>Active employees</span>
                  </div>
                  <span className="text-xs font-bold text-white">
                    {employees.filter((e) => e.status === "active").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} color="#3b82f6" />
                    <span className="text-xs" style={{ color: "#64748b" }}>Avg. project value</span>
                  </div>
                  <span className="text-xs font-bold text-white">
                    {projects.length > 0
                      ? formatCurrency(projects.reduce((s, p) => s + p.budget, 0) / projects.length)
                      : "₹0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
