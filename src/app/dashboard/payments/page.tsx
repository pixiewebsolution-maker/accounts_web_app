"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X, Trash2, Edit } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import { StatusBadge, PageWrapper } from "@/components/ui";
import { clients, invoices } from "@/lib/data";
import { dbService } from "@/lib/db";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Payment } from "@/lib/data";

const METHOD_COLORS: Record<string, string> = {
  "bank transfer": "#6366f1",
  "upi": "#10b981",
  "cheque": "#f59e0b",
  "cash": "#94a3b8",
  "card": "#3b82f6",
};

export default function PaymentsPage() {
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    invoiceNumber: "",
    clientName: "",
    amount: "",
    method: "upi" as Payment["method"],
    date: new Date().toISOString().split("T")[0],
    status: "completed" as Payment["status"],
    notes: "",
  });

  useEffect(() => {
    const loadPayments = async () => {
      const data = await dbService.getAll("payments");
      setPaymentsList(data);
      setIsLoading(false);
    };
    loadPayments();
  }, []);

  const filtered = paymentsList.filter(
    (p) =>
      p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const totalReceived = paymentsList.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);

  const handleOpenAddModal = () => {
    setEditPayment(null);
    setForm({
      invoiceNumber: "",
      clientName: "",
      amount: "",
      method: "upi",
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pay: Payment) => {
    setEditPayment(pay);
    setForm({
      invoiceNumber: pay.invoiceNumber === "DIRECT-CR" ? "" : pay.invoiceNumber,
      clientName: pay.clientName,
      amount: String(pay.amount),
      method: pay.method,
      date: pay.date,
      status: pay.status,
      notes: pay.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.amount) return;

    // Retrieve corresponding invoice if any
    const associatedInvoice = invoices.find(inv => inv.invoiceNumber === form.invoiceNumber);

    if (editPayment) {
      // Prior invoice adjustment: subtract old payment amount from previously associated invoice if any
      const oldInvoice = invoices.find(inv => inv.invoiceNumber === editPayment.invoiceNumber);
      if (oldInvoice && editPayment.status === "completed") {
        oldInvoice.paidAmount -= editPayment.amount;
        if (oldInvoice.paidAmount >= oldInvoice.total) {
          oldInvoice.status = "paid";
        } else if (oldInvoice.paidAmount > 0) {
          oldInvoice.status = "partially paid";
        } else {
          oldInvoice.status = "sent";
        }
      }

      // Update in database and local state
      const updatedPayment = {
        invoiceId: associatedInvoice?.id || `inv-${Date.now()}`,
        invoiceNumber: form.invoiceNumber || "DIRECT-CR",
        clientName: form.clientName,
        amount: Number(form.amount) || 0,
        method: form.method,
        date: form.date,
        status: form.status,
        notes: form.notes || undefined,
      };

      await dbService.update("payments", editPayment.id, updatedPayment);

      setPaymentsList((prev) =>
        prev.map((pay) => (pay.id === editPayment.id ? { ...pay, ...updatedPayment } : pay))
      );

      // Add new payment amount to the newly associated invoice if any
      if (associatedInvoice && form.status === "completed") {
        associatedInvoice.paidAmount += Number(form.amount) || 0;
        if (associatedInvoice.paidAmount >= associatedInvoice.total) {
          associatedInvoice.status = "paid";
        } else if (associatedInvoice.paidAmount > 0) {
          associatedInvoice.status = "partially paid";
        }
      }

    } else {
      // Add mode
      const newPayment: Payment = {
        id: `pay${Date.now()}`,
        invoiceId: associatedInvoice?.id || `inv-${Date.now()}`,
        invoiceNumber: form.invoiceNumber || "DIRECT-CR",
        clientName: form.clientName,
        amount: Number(form.amount) || 0,
        method: form.method,
        date: form.date,
        status: form.status,
        notes: form.notes || undefined,
      };

      await dbService.add("payments", newPayment);
      setPaymentsList((prev) => [newPayment, ...prev]);

      // If invoice found, add paid amount to invoice dynamically as well
      if (associatedInvoice && form.status === "completed") {
        associatedInvoice.paidAmount += newPayment.amount;
        if (associatedInvoice.paidAmount >= associatedInvoice.total) {
          associatedInvoice.status = "paid";
        } else if (associatedInvoice.paidAmount > 0) {
          associatedInvoice.status = "partially paid";
        }
      }
    }

    // Reset and close
    setForm({
      invoiceNumber: "",
      clientName: "",
      amount: "",
      method: "upi",
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      notes: "",
    });
    setEditPayment(null);
    setIsModalOpen(false);
  };

  const handleRemovePayment = (payId: string) => {
    setDeleteConfirmId(payId);
  };

  const executeDeletePayment = async () => {
    if (!deleteConfirmId) return;
    const paymentToDelete = paymentsList.find((pay) => pay.id === deleteConfirmId);
    
    // Subtract from invoice paid amount
    if (paymentToDelete && paymentToDelete.status === "completed") {
      const associatedInvoice = invoices.find(inv => inv.invoiceNumber === paymentToDelete.invoiceNumber);
      if (associatedInvoice) {
        associatedInvoice.paidAmount -= paymentToDelete.amount;
        if (associatedInvoice.paidAmount >= associatedInvoice.total) {
          associatedInvoice.status = "paid";
        } else if (associatedInvoice.paidAmount > 0) {
          associatedInvoice.status = "partially paid";
        } else {
          associatedInvoice.status = "sent";
        }
      }
    }

    await dbService.delete("payments", deleteConfirmId);
    setPaymentsList((prev) => prev.filter((pay) => pay.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  return (
    <>
      <Topbar
        title="Payments"
        subtitle={`${paymentsList.length} payment records`}
        onMobileMenu={() => {}}
        action={{ label: "Record Payment", onClick: handleOpenAddModal }}
      />
      <PageWrapper>
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>Total Received</p>
            <p className="text-xl font-bold" style={{ color: "#10b981" }}>{formatCurrency(totalReceived)}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>Payments Count</p>
            <p className="text-xl font-bold text-white">{paymentsList.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>Avg Payment</p>
            <p className="text-xl font-bold" style={{ color: "#6366f1" }}>{paymentsList.length > 0 ? formatCurrency(totalReceived / paymentsList.length) : "₹0"}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice or client..."
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pay) => (
                  <tr key={pay.id}>
                    <td><span className="font-medium text-white text-xs">{pay.invoiceNumber}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar" style={{ width: 26, height: 26, fontSize: "0.55rem" }}>
                          {pay.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-xs text-white">{pay.clientName}</span>
                      </div>
                    </td>
                    <td><span className="font-bold text-white">{formatCurrency(pay.amount)}</span></td>
                    <td>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                        style={{
                          background: `${METHOD_COLORS[pay.method] || "#6366f1"}15`,
                          color: METHOD_COLORS[pay.method] || "#6366f1",
                        }}
                      >
                        {pay.method}
                      </span>
                    </td>
                    <td><span className="text-xs" style={{ color: "#475569" }}>{formatDate(pay.date)}</span></td>
                    <td><StatusBadge status={pay.status} size="sm" /></td>
                    <td className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(pay)}
                          className="p-1 rounded text-indigo-400 hover:text-white hover:bg-indigo-500/10 transition-all cursor-pointer"
                          title="Edit Payment Record"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleRemovePayment(pay.id)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/[0.04] transition-all cursor-pointer"
                          title="Remove Payment Record"
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
      </PageWrapper>

      {/* Record / Edit Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-md overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d1a] p-6 shadow-2xl relative animate-scale-in"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setEditPayment(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.04] transition-all"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              {editPayment ? "Edit Payment Details" : "Record Client Payment"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {editPayment ? "Update existing transaction parameters and clearance." : "File payment receipts to update invoice and financial summaries."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Invoice / Reference</label>
                  <select
                    value={form.invoiceNumber}
                    onChange={(e) => {
                      const inv = invoices.find(i => i.invoiceNumber === e.target.value);
                      setForm({
                        ...form,
                        invoiceNumber: e.target.value,
                        clientName: inv ? inv.clientName : form.clientName,
                        amount: inv ? String(inv.total - inv.paidAmount) : form.amount,
                      });
                    }}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="">Direct Entry (No Invoice)</option>
                    {invoices.map(inv => (
                      <option key={inv.id} value={inv.invoiceNumber}>{inv.invoiceNumber} ({inv.clientName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Associated Client</label>
                  <select
                    required
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="">Select Client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.company}>{c.company}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Amount (₹)</label>
                  <input
                    required
                    type="number"
                    placeholder="25000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Payment Method</label>
                  <select
                    value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value as Payment["method"] })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="upi">UPI (GPay / PhonePe)</option>
                    <option value="bank transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash Payment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Payment Date</label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Clearance Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Payment["status"] })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="completed">Completed (Cleared)</option>
                    <option value="pending">Pending Processing</option>
                    <option value="failed">Failed / Returned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Internal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Cleared via standard UPI gateway"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditPayment(null);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.02]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#10b981] hover:bg-[#0da270] cursor-pointer shadow-lg"
                >
                  {editPayment ? "Save Payment Details" : "Record Payment Ledger"}
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
            <p className="text-xs text-slate-400 mb-6">Are you sure you want to permanently remove this payment record? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.02]"
              >
                Cancel
              </button>
              <button
                onClick={executeDeletePayment}
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
