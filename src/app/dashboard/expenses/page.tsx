"use client";

import { useState, useEffect } from "react";
import { Search, TrendingDown, ShoppingCart, Server, Monitor, Megaphone, Building, CreditCard, Plus, X, Trash2, Edit } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import { StatusBadge, SectionHeader, PageWrapper } from "@/components/ui";
import { clients } from "@/lib/data";
import { dbService } from "@/lib/db";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Expense } from "@/lib/data";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  hosting: <Server size={14} />,
  domain: <Monitor size={14} />,
  software: <CreditCard size={14} />,
  salary: <CreditCard size={14} />,
  marketing: <Megaphone size={14} />,
  office: <Building size={14} />,
  ads: <Megaphone size={14} />,
  other: <ShoppingCart size={14} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  hosting: "#6366f1",
  domain: "#8b5cf6",
  software: "#3b82f6",
  salary: "#10b981",
  marketing: "#f59e0b",
  office: "#ec4899",
  ads: "#ef4444",
  other: "#64748b",
};

export default function ExpensesPage() {
  const [expensesList, setExpensesList] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    description: "",
    category: "hosting" as Expense["category"],
    type: "operational" as Expense["type"],
    clientName: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await dbService.getAll("expenses");
      setExpensesList(data);
      setIsLoading(false);
    };
    loadExpenses();
  }, []);

  const filtered = expensesList.filter((e) => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
      (e.clientName || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || e.category === categoryFilter;
    const matchType = typeFilter === "all" || e.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  const totalExpenses = expensesList.reduce((s, e) => s + e.amount, 0);
  const clientSpecific = expensesList.filter((e) => e.type === "client-specific").reduce((s, e) => s + e.amount, 0);
  const operational = expensesList.filter((e) => e.type === "operational").reduce((s, e) => s + e.amount, 0);

  // Category breakdown
  const categoryTotals = expensesList.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  const handleOpenAddModal = () => {
    setEditExpense(null);
    setForm({
      description: "",
      category: "hosting",
      type: "operational",
      clientName: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exp: Expense) => {
    setEditExpense(exp);
    setForm({
      description: exp.description,
      category: exp.category,
      type: exp.type,
      clientName: exp.clientName || "",
      amount: String(exp.amount),
      date: exp.date,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    if (editExpense) {
      // Edit mode
      const updatedExpense = {
        description: form.description,
        category: form.category,
        type: form.type,
        clientName: form.type === "client-specific" ? form.clientName : undefined,
        amount: Number(form.amount) || 0,
        date: form.date,
      };

      await dbService.update("expenses", editExpense.id, updatedExpense);

      setExpensesList((prev) =>
        prev.map((exp) => (exp.id === editExpense.id ? { ...exp, ...updatedExpense } : exp))
      );
    } else {
      // Add mode
      const newExpense: Expense = {
        id: `exp${Date.now()}`,
        description: form.description,
        category: form.category,
        type: form.type,
        clientName: form.type === "client-specific" ? form.clientName : undefined,
        amount: Number(form.amount) || 0,
        date: form.date,
      };

      await dbService.add("expenses", newExpense);
      setExpensesList((prev) => [...prev, newExpense]);
    }

    // Reset and close
    setForm({
      description: "",
      category: "hosting",
      type: "operational",
      clientName: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditExpense(null);
    setIsModalOpen(false);
  };

  const handleRemoveExpense = (expId: string) => {
    setDeleteConfirmId(expId);
  };

  const executeDeleteExpense = async () => {
    if (!deleteConfirmId) return;
    await dbService.delete("expenses", deleteConfirmId);
    setExpensesList((prev) => prev.filter((exp) => exp.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  return (
    <>
      <Topbar
        title="Expenses"
        subtitle={`${expensesList.length} expense records`}
        onMobileMenu={() => {}}
        action={{ label: "Add Expense", onClick: handleOpenAddModal }}
      />
      <PageWrapper>
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>Total Expenses</p>
            <p className="text-xl font-bold" style={{ color: "#ef4444" }}>{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>Client-Specific</p>
            <p className="text-xl font-bold" style={{ color: "#f59e0b" }}>{formatCurrency(clientSpecific)}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>Operational</p>
            <p className="text-xl font-bold" style={{ color: "#6366f1" }}>{formatCurrency(operational)}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          {/* Category Breakdown */}
          <div className="card p-6 lg:col-span-1">
            <SectionHeader title="By Category" />
            <div className="space-y-3">
              {categories.map(([cat, amount]) => {
                const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span style={{ color: CATEGORY_COLORS[cat] }}>{CATEGORY_ICONS[cat]}</span>
                        <span className="text-xs capitalize" style={{ color: "#94a3b8" }}>{cat}</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="card lg:col-span-3">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search expenses..."
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
              >
                <option value="all">All Categories</option>
                {Object.keys(CATEGORY_COLORS).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
              >
                <option value="all">All Types</option>
                <option value="client-specific">Client Specific</option>
                <option value="operational">Operational</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th className="text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((exp) => (
                    <tr key={exp.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span style={{ color: CATEGORY_COLORS[exp.category] }}>{CATEGORY_ICONS[exp.category]}</span>
                          <span className="text-xs capitalize" style={{ color: "#94a3b8" }}>{exp.category}</span>
                        </div>
                      </td>
                      <td><span className="text-sm text-white">{exp.description}</span></td>
                      <td>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: exp.type === "client-specific" ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.05)",
                            color: exp.type === "client-specific" ? "#a5b4fc" : "#64748b",
                          }}
                        >
                          {exp.type === "client-specific" ? "Client" : "Operational"}
                        </span>
                      </td>
                      <td><span className="text-xs" style={{ color: "#64748b" }}>{exp.clientName || "—"}</span></td>
                      <td><span className="font-semibold text-xs" style={{ color: "#ef4444" }}>{formatCurrency(exp.amount)}</span></td>
                      <td><span className="text-xs" style={{ color: "#475569" }}>{formatDate(exp.date)}</span></td>
                      <td className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(exp)}
                            className="p-1 rounded text-indigo-400 hover:text-white hover:bg-indigo-500/10 transition-all cursor-pointer"
                            title="Edit Expense Record"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveExpense(exp.id)}
                            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/[0.04] transition-all cursor-pointer"
                            title="Remove Expense Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-md overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d1a] p-6 shadow-2xl relative animate-scale-in"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setEditExpense(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.04] transition-all"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              {editExpense ? "Edit Expense Details" : "Record New Expense"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {editExpense ? "Update existing transaction parameters and classifications." : "Log general operational costs or client project expenses."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Description</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. AWS Cloud Server Hosting Renewal"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Expense["category"] })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="hosting">Hosting</option>
                    <option value="domain">Domain Name</option>
                    <option value="software">Software SaaS</option>
                    <option value="salary">Salary Payroll</option>
                    <option value="marketing">Marketing Material</option>
                    <option value="office">Office Utility</option>
                    <option value="ads">Ad Campaigns</option>
                    <option value="other">Other Expense</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Expense Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as Expense["type"] })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="operational">Operational</option>
                    <option value="client-specific">Client Specific</option>
                  </select>
                </div>
              </div>

              {form.type === "client-specific" && (
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Associated Client</label>
                  <select
                    required
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="">Select a Client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.company}>{c.company}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Amount (₹)</label>
                  <input
                    required
                    type="number"
                    placeholder="12000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Date Recorded</label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditExpense(null);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.02]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#6366f1] hover:bg-[#5356e1] cursor-pointer shadow-lg"
                >
                  {editExpense ? "Save Transaction" : "Record Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-sm overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d1a] p-6 shadow-2xl relative animate-scale-in"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <h3 className="text-base font-bold text-white mb-2">Confirm Deletion</h3>
            <p className="text-xs text-slate-400 mb-6">Are you sure you want to permanently remove this expense record? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.02]"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteExpense}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 cursor-pointer shadow-lg"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
