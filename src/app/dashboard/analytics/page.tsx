"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import Topbar from "@/components/layout/Topbar";
import { SectionHeader, PageWrapper } from "@/components/ui";
import { dbService } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import type { Employee, Project, Expense } from "@/lib/data";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#4f46e5", "#3730a3"];

// Static trend analytics datasets defined locally to decouple from deprecated/removed mock database arrays
const monthlyRevenue = [
  { month: "Jan", revenue: 45000, expenses: 15000, profit: 30000 },
  { month: "Feb", revenue: 52000, expenses: 18000, profit: 34000 },
  { month: "Mar", revenue: 61000, expenses: 22000, profit: 39000 },
  { month: "Apr", revenue: 78000, expenses: 25000, profit: 53000 },
  { month: "May", revenue: 95000, expenses: 31000, profit: 64000 },
];

const serviceRevenue = [
  { service: "Website Development", revenue: 68000 },
  { service: "UI/UX Design", revenue: 32000 },
  { service: "Digital Marketing", revenue: 24000 },
  { service: "SEO Optimization", revenue: 15000 },
];

const clientAcquisition = [
  { month: "Jan", clients: 2 },
  { month: "Feb", clients: 3 },
  { month: "Mar", clients: 5 },
  { month: "Apr", clients: 8 },
  { month: "May", clients: 12 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 text-sm shadow-xl" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}>
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span style={{ color: "#94a3b8" }}>{entry.name}: </span>
            <span className="font-medium text-white">
              {typeof entry.value === "number" && entry.name !== "clients"
                ? formatCurrency(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [empData, projData, expData] = await Promise.all([
          dbService.getAll("employees"),
          dbService.getAll("projects"),
          dbService.getAll("expenses"),
        ]);
        setEmployees(empData);
        setProjects(projData);
        setExpenses(expData);
      } catch (err) {
        console.error("Failed to load analytics data from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Team workload data (assigned projects) calculated dynamically
  const teamWorkload = employees.map((e) => ({
    name: e.name.split(" ")[0],
    projects: projects.filter((p) => p.assignedEmployees.includes(e.id)).length,
  }));

  // Expense by category calculated dynamically
  const expenseByCategory = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalExpense = monthlyRevenue.reduce((s, m) => s + m.expenses, 0);
  const totalProfit = totalRevenue - totalExpense;

  return (
    <>
      <Topbar title="Analytics" subtitle="Business performance insights" onMobileMenu={() => {}} />
      <PageWrapper>
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
              {[
                { label: "Total Revenue (YTD)", value: formatCurrency(totalRevenue), color: "#6366f1" },
                { label: "Total Expenses (YTD)", value: formatCurrency(totalExpense), color: "#ef4444" },
                { label: "Net Profit/Loss", value: formatCurrency(Math.abs(totalProfit)), sub: totalProfit < 0 ? "Loss" : "Profit", color: totalProfit >= 0 ? "#10b981" : "#ef4444" },
                { label: "Avg Revenue/Client", value: formatCurrency(totalRevenue / 7), color: "#f59e0b" },
              ].map(({ label, value, color, sub }) => (
                <div key={label} className="card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>{label}</p>
                  <p className="text-xl font-bold" style={{ color }}>{value}</p>
                  {sub && <p className="text-xs mt-0.5" style={{ color }}>{sub}</p>}
                </div>
              ))}
            </div>

            {/* Revenue vs Expenses vs Profit */}
            <div className="card p-6 mb-6">
              <SectionHeader title="Revenue vs Expenses" subtitle="Overview with profit/loss" />
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyRevenue} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#64748b", fontSize: 12 }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.7} />
                  <Bar dataKey="profit" name="Profit/Loss" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Service Revenue Pie */}
              <div className="card p-6">
                <SectionHeader title="Revenue by Service" />
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={serviceRevenue} cx="50%" cy="50%" outerRadius={80} dataKey="revenue" label={({ service, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {serviceRevenue.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatCurrency(v)} contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {serviceRevenue.map((s, i) => (
                    <div key={s.service} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-xs" style={{ color: "#64748b" }}>{s.service}</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{formatCurrency(s.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Acquisition */}
              <div className="card p-6">
                <SectionHeader title="Client Acquisition" subtitle="New clients per month" />
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={clientAcquisition}>
                    <defs>
                      <linearGradient id="clientGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }} />
                    <Area type="monotone" dataKey="clients" name="Clients" stroke="#10b981" fill="url(#clientGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Expense Categories */}
              <div className="card p-6">
                <SectionHeader title="Expenses by Category" />
                {expenseByCategory.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center text-xs text-slate-500">
                    No expense data found.
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value">
                          {expenseByCategory.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => formatCurrency(v)} contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                      {expenseByCategory.slice(0, 4).map((item, i) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="text-xs capitalize" style={{ color: "#64748b" }}>{item.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-white">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Team Workload */}
            <div className="card p-6">
              <SectionHeader title="Team Workload" subtitle="Assigned projects per employee" />
              {teamWorkload.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-xs text-slate-500">
                  No employee workload data found.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={teamWorkload} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, "dataMax + 1"]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }} formatter={(v) => [`${v} projects`, "Workload"]} />
                    <Bar dataKey="projects" radius={[0, 4, 4, 0]}>
                      {teamWorkload.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.projects >= 3 ? "#ef4444" : entry.projects >= 2 ? "#6366f1" : "#10b981"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </PageWrapper>
    </>
  );
}
