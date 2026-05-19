"use client";

import { useState } from "react";
import { Search, Download, Send, Eye, FileText, Filter, Plus, X, Trash2, Edit } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import { StatusBadge, SectionHeader, PageWrapper } from "@/components/ui";
import { invoices as initialInvoices, clients, projects } from "@/lib/data";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Invoice, InvoiceItem } from "@/lib/data";

const TYPE_LABELS: Record<string, string> = {
  quotation: "Quotation",
  proforma: "Proforma",
  advance: "Advance Invoice",
  final: "Final Invoice",
  maintenance: "Maintenance Renewal",
};

const TYPE_COLORS: Record<string, string> = {
  quotation: "#8b5cf6",
  proforma: "#3b82f6",
  advance: "#f59e0b",
  final: "#10b981",
  maintenance: "#6366f1",
};

interface InvoiceDetailModalProps {
  invoice: Invoice;
  onClose: () => void;
  onUpdateInvoice: (invId: string, updates: Partial<Invoice>) => void;
}

function InvoiceDetailModal({ invoice, onClose, onUpdateInvoice }: InvoiceDetailModalProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    invoiceNumber: invoice.invoiceNumber,
    type: invoice.type,
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail,
    clientAddress: invoice.clientAddress,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    status: invoice.status,
    items: [...invoice.items],
    gstRate: invoice.gstRate,
    paidAmount: invoice.paidAmount,
    notes: invoice.notes || "",
  });

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, val: string | number) => {
    const updatedItems = form.items.map((item, idx) => {
      if (idx === index) {
        const next = { ...item, [field]: val };
        next.amount = next.quantity * next.rate;
        return next;
      }
      return item;
    });
    setForm({ ...form, items: updatedItems });
  };

  const handleAddItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "New Invoice Item", quantity: 1, rate: 1000, amount: 1000 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setForm({
      ...form,
      items: form.items.filter((_, idx) => idx !== index),
    });
  };

  const handleSave = () => {
    const subtotal = form.items.reduce((s, item) => s + item.amount, 0);
    const gstAmount = Math.round(subtotal * (form.gstRate / 100));
    const total = subtotal + gstAmount;

    onUpdateInvoice(invoice.id, {
      invoiceNumber: form.invoiceNumber,
      type: form.type,
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      clientAddress: form.clientAddress,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      status: form.status,
      items: form.items,
      gstRate: form.gstRate,
      gstAmount,
      subtotal,
      total,
      paidAmount: Number(form.paidAmount) || 0,
      notes: form.notes,
    });
    setEditing(false);
  };

  // Static/calculated totals
  const subtotal = form.items.reduce((s, item) => s + item.amount, 0);
  const gstAmount = Math.round(subtotal * (form.gstRate / 100));
  const total = subtotal + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #fff !important;
            color: #000 !important;
            box-shadow: none !important;
            border: none !important;
          }
          #printable-invoice * {
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      ` }} />

      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div
        id="printable-invoice"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header Section */}
        <div
          className="p-6 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
                >
                  <FileText size={14} color="white" />
                </div>
                <span className="font-bold text-white text-lg">AgencyOS</span>
              </div>
              <p className="text-xs text-slate-400">Digital Marketing & Development Agency</p>
            </div>
            <div className="text-right">
              {editing ? (
                <div className="space-y-1 text-xs">
                  <input
                    type="text"
                    value={form.invoiceNumber}
                    onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                    className="bg-white/[0.04] border border-white/[0.08] text-white px-2 py-1 rounded w-32 focus:outline-none focus:border-[#6366f1]"
                  />
                  <div className="flex justify-end gap-1 mt-1">
                    <input
                      type="date"
                      value={form.issueDate}
                      onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                      className="bg-white/[0.04] border border-white/[0.08] text-[10px] text-white px-1.5 py-0.5 rounded focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-bold text-white text-base">{invoice.invoiceNumber}</p>
                  <p className="text-[11px] text-slate-400">Issued: {formatDate(invoice.issueDate)}</p>
                  <p className="text-[11px] text-slate-400">Due: {formatDate(invoice.dueDate)}</p>
                </>
              )}
              <div className="mt-2 flex justify-end">
                {editing ? (
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Invoice["status"] })}
                    className="bg-[#0d0d1a] border border-white/[0.08] text-xs text-white p-1 rounded focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="partially paid">Partially Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                ) : (
                  <StatusBadge status={invoice.status} size="sm" />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-slate-500">Bill To</p>
              {editing ? (
                <div className="space-y-1">
                  <select
                    value={form.clientName}
                    onChange={(e) => {
                      const cl = clients.find(c => c.company === e.target.value);
                      setForm({
                        ...form,
                        clientName: e.target.value,
                        clientEmail: cl?.email || "",
                        clientAddress: cl?.address || "",
                      });
                    }}
                    className="bg-[#0d0d1a] border border-white/[0.08] text-xs text-white p-1 rounded focus:outline-none"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.company}>{c.company}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <p className="font-semibold text-white text-sm">{invoice.clientName}</p>
                  <p className="text-xs text-slate-400">{invoice.clientEmail}</p>
                  <p className="text-xs text-slate-400">{invoice.clientAddress}</p>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-slate-500">Invoice Type</p>
              {editing ? (
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Invoice["type"] })}
                  className="bg-[#0d0d1a] border border-white/[0.08] text-xs text-white p-1 rounded focus:outline-none"
                >
                  <option value="quotation">Quotation</option>
                  <option value="proforma">Proforma</option>
                  <option value="advance">Advance Invoice</option>
                  <option value="final">Final Invoice</option>
                  <option value="maintenance">Maintenance Renewal</option>
                </select>
              ) : (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: `${TYPE_COLORS[invoice.type]}20`, color: TYPE_COLORS[invoice.type] }}
                >
                  {TYPE_LABELS[invoice.type]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6">
          <table className="data-table mb-6 w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs text-slate-400">
                <th className="py-2">Description</th>
                <th className="text-right py-2 w-16">Qty</th>
                <th className="text-right py-2 w-28">Rate (₹)</th>
                <th className="text-right py-2 w-28">Amount</th>
                {editing && <th className="no-print w-10 text-center py-2"></th>}
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, i) => (
                <tr key={i} className="border-b border-white/[0.02]">
                  <td className="py-3 text-white text-xs">
                    {editing ? (
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(i, "description", e.target.value)}
                        className="bg-white/[0.02] border border-white/[0.06] text-white text-xs px-2 py-1 rounded w-full focus:outline-none"
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td className="text-right py-3 text-xs">
                    {editing ? (
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(i, "quantity", Number(e.target.value) || 1)}
                        className="bg-white/[0.02] border border-white/[0.06] text-white text-xs px-2 py-1 rounded w-full text-right focus:outline-none"
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="text-right py-3 text-xs">
                    {editing ? (
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(i, "rate", Number(e.target.value) || 0)}
                        className="bg-white/[0.02] border border-white/[0.06] text-white text-xs px-2 py-1 rounded w-full text-right focus:outline-none"
                      />
                    ) : (
                      formatCurrency(item.rate)
                    )}
                  </td>
                  <td className="text-right py-3 font-semibold text-white text-xs">
                    {formatCurrency(item.amount)}
                  </td>
                  {editing && (
                    <td className="text-center py-3 no-print">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(i)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {editing && (
            <button
              type="button"
              onClick={handleAddItem}
              className="no-print w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-white/[0.1] hover:border-indigo-500/50 text-indigo-400 text-xs transition-all cursor-pointer mb-6"
            >
              <Plus size={13} />
              Add Line Item
            </button>
          )}

          {/* Ledger Calculation / Totals */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              {editing ? (
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Internal Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="Provide notes or payment terms..."
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg p-2 focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
              ) : (
                invoice.notes && (
                  <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-slate-500">Notes</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{invoice.notes}</p>
                  </div>
                )
              )}
            </div>

            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">GST Rate (%)</span>
                {editing ? (
                  <input
                    type="number"
                    value={form.gstRate}
                    onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) || 0 })}
                    className="bg-white/[0.02] border border-white/[0.06] text-white px-2 py-0.5 rounded text-right w-16 focus:outline-none"
                  />
                ) : (
                  <span className="text-white font-medium">{invoice.gstRate}%</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GST Amount</span>
                <span className="text-white font-medium">{formatCurrency(gstAmount)}</span>
              </div>
              <div
                className="flex justify-between font-bold pt-2 border-t"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <span className="text-white">Total Amount</span>
                <span className="text-indigo-400 text-sm">{formatCurrency(total)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">Amount Paid (₹)</span>
                {editing ? (
                  <input
                    type="number"
                    value={form.paidAmount}
                    onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) || 0 })}
                    className="bg-white/[0.02] border border-white/[0.06] text-white px-2 py-0.5 rounded text-right w-20 focus:outline-none"
                  />
                ) : (
                  <span className="text-emerald-400 font-semibold">{formatCurrency(invoice.paidAmount)}</span>
                )}
              </div>

              {!editing && total - invoice.paidAmount > 0 && (
                <div className="flex justify-between pt-1 font-bold text-amber-500">
                  <span>Balance Due</span>
                  <span>{formatCurrency(total - invoice.paidAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-8 flex justify-between items-end text-xs">
            <div>
              <div className="w-24 h-px mb-1 bg-white/[0.1]" />
              <p className="text-[10px] text-slate-500">Client Signature</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">Syed Fahad</p>
              <p className="text-[10px] text-slate-500">Authorized Signatory</p>
              <div className="w-24 h-px mt-1 ml-auto bg-white/[0.1]" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="flex justify-end gap-3 p-4 no-print"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}
        >
          {editing ? (
            <>
              <button className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.02]" onClick={() => setEditing(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#6366f1] hover:bg-[#5356e1] cursor-pointer shadow-lg" onClick={handleSave}>Save Changes</button>
            </>
          ) : (
            <>
              <button className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.02]" onClick={onClose}>Close</button>
              <button 
                className="px-4 py-2 rounded-lg text-xs font-semibold text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 cursor-pointer flex items-center gap-1.5" 
                onClick={() => setEditing(true)}
              >
                <Edit size={12} />
                Edit Invoice
              </button>
              <button className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 border border-white/[0.08] hover:text-white hover:bg-white/[0.02] cursor-pointer flex items-center gap-1.5">
                <Send size={12} />
                Send Invoice
              </button>
              <button 
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#6366f1] hover:bg-[#5356e1] cursor-pointer flex items-center gap-1.5 shadow-lg"
                onClick={handlePrint}
              >
                <Download size={12} />
                Download PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for creating new invoice
  const [form, setForm] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    type: "quotation" as Invoice["type"],
    clientCompany: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0],
    status: "draft" as Invoice["status"],
    gstRate: "18",
    notes: "",
    items: [
      { description: "Website Development Fee", quantity: 1, rate: 45000 },
    ],
  });

  const handleUpdateFormItem = (index: number, field: string, val: string | number) => {
    const updated = form.items.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    setForm({ ...form, items: updated });
  };

  const handleAddFormItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "Extra Service Fee", quantity: 1, rate: 5000 }],
    });
  };

  const handleRemoveFormItem = (index: number) => {
    setForm({
      ...form,
      items: form.items.filter((_, idx) => idx !== index),
    });
  };

  const handleAddInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientCompany || form.items.length === 0) return;

    const cl = clients.find(c => c.company === form.clientCompany);

    const itemsWithAmounts: InvoiceItem[] = form.items.map(item => ({
      description: item.description,
      quantity: Number(item.quantity) || 1,
      rate: Number(item.rate) || 0,
      amount: (Number(item.quantity) || 1) * (Number(item.rate) || 0),
    }));

    const subtotal = itemsWithAmounts.reduce((s, it) => s + it.amount, 0);
    const gstRateNum = Number(form.gstRate) || 0;
    const gstAmount = Math.round(subtotal * (gstRateNum / 100));
    const total = subtotal + gstAmount;

    const newInvoice: Invoice = {
      id: `inv${invoicesList.length + 1}`,
      invoiceNumber: form.invoiceNumber,
      type: form.type,
      clientId: cl?.id || `cl-${Date.now()}`,
      clientName: form.clientCompany,
      clientEmail: cl?.email || "billing@client.com",
      clientAddress: cl?.address || "Client HQ Address",
      projectId: undefined,
      items: itemsWithAmounts,
      subtotal,
      gstRate: gstRateNum,
      gstAmount,
      total,
      paidAmount: form.status === "paid" ? total : 0,
      status: form.status,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      notes: form.notes || undefined,
    };

    const updated = [newInvoice, ...invoicesList];
    setInvoicesList(updated);

    // Sync globally
    initialInvoices.unshift(newInvoice);

    // Reset state & close
    setForm({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      type: "quotation",
      clientCompany: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0],
      status: "draft",
      gstRate: "18",
      notes: "",
      items: [{ description: "Website Development Fee", quantity: 1, rate: 45000 }],
    });
    setIsModalOpen(false);
  };

  const handleUpdateInvoice = (invId: string, updates: Partial<Invoice>) => {
    setInvoicesList(prev => prev.map(inv => inv.id === invId ? { ...inv, ...updates } : inv));
    const idx = initialInvoices.findIndex(inv => inv.id === invId);
    if (idx !== -1) {
      initialInvoices[idx] = { ...initialInvoices[idx], ...updates };
    }
  };

  const filtered = invoicesList.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || inv.type === typeFilter;
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalInvoiced = invoicesList.reduce((s, i) => s + i.total, 0);
  const totalPaid = invoicesList.reduce((s, i) => s + i.paidAmount, 0);
  const totalPending = totalInvoiced - totalPaid;

  return (
    <>
      <Topbar
        title="Invoices"
        subtitle={`${invoicesList.length} invoices`}
        onMobileMenu={() => {}}
        action={{ label: "New Invoice", onClick: () => setIsModalOpen(true) }}
      />
      <PageWrapper>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          {[
            { label: "Total Invoiced", value: formatCurrency(totalInvoiced), color: "#6366f1" },
            { label: "Total Paid", value: formatCurrency(totalPaid), color: "#10b981" },
            { label: "Outstanding", value: formatCurrency(totalPending), color: "#f59e0b" },
            { label: "Overdue", value: invoicesList.filter((i) => i.status === "overdue").length + " invoices", color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>{label}</p>
              <p className="text-xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice number or client..."
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ width: "auto", padding: "0.5rem 0.875rem" }}
          >
            <option value="all">All Types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "auto", padding: "0.5rem 0.875rem" }}
          >
            <option value="all">All Status</option>
            {["draft", "sent", "paid", "partially paid", "overdue"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <span className="font-medium text-white text-xs">{inv.invoiceNumber}</span>
                    </td>
                    <td>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${TYPE_COLORS[inv.type]}15`, color: TYPE_COLORS[inv.type] }}
                      >
                        {TYPE_LABELS[inv.type]}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar" style={{ width: 26, height: 26, fontSize: "0.55rem" }}>
                          {inv.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-xs text-white">{inv.clientName}</span>
                      </div>
                    </td>
                    <td><span className="font-semibold text-white text-xs">{formatCurrency(inv.total)}</span></td>
                    <td><span className="text-xs" style={{ color: "#10b981" }}>{formatCurrency(inv.paidAmount)}</span></td>
                    <td>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: inv.total - inv.paidAmount > 0 ? "#f59e0b" : "#10b981" }}
                      >
                        {formatCurrency(inv.total - inv.paidAmount)}
                      </span>
                    </td>
                    <td><StatusBadge status={inv.status} size="sm" /></td>
                    <td><span className="text-xs" style={{ color: "#475569" }}>{formatDate(inv.dueDate)}</span></td>
                    <td>
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
                        style={{ color: "#6366f1", background: "rgba(99,102,241,0.08)" }}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageWrapper>

      {/* Selected Invoice Details and Edit Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
          onUpdateInvoice={handleUpdateInvoice}
        />
      )}

      {/* New Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-xl border border-white/[0.08] bg-[#0d0d1a] p-6 shadow-2xl relative animate-scale-in"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.04] transition-all"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Generate Professional Invoice</h3>
            <p className="text-xs text-slate-400 mb-6">Build quotes, proformas, advance invoices, or final bills.</p>

            <form onSubmit={handleAddInvoiceSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Invoice Number</label>
                  <input
                    required
                    type="text"
                    value={form.invoiceNumber}
                    onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Select Client</label>
                  <select
                    required
                    value={form.clientCompany}
                    onChange={(e) => setForm({ ...form, clientCompany: e.target.value })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="">Select a Client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.company}>{c.company}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Invoice Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as Invoice["type"] })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="quotation">Quotation</option>
                    <option value="proforma">Proforma</option>
                    <option value="advance">Advance Invoice</option>
                    <option value="final">Final Invoice</option>
                    <option value="maintenance">Maintenance Renewal</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Invoice Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Invoice["status"] })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent (Unpaid)</option>
                    <option value="paid">Paid (Cleared)</option>
                    <option value="partially paid">Partially Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Issue Date</label>
                  <input
                    required
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Due Date</label>
                  <input
                    required
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 border-t border-white/[0.04] pt-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wider">Invoice Items List</label>
                  <button
                    type="button"
                    onClick={handleAddFormItem}
                    className="text-[#6366f1] hover:text-white flex items-center gap-1 font-semibold text-[10px] cursor-pointer"
                  >
                    <Plus size={12} /> Add Item
                  </button>
                </div>

                {form.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center animate-fade-in">
                    <input
                      required
                      type="text"
                      placeholder="Line item description"
                      value={item.description}
                      onChange={(e) => handleUpdateFormItem(idx, "description", e.target.value)}
                      className="flex-1 text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                    <input
                      required
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleUpdateFormItem(idx, "quantity", Number(e.target.value) || 1)}
                      className="w-12 text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-center focus:outline-none"
                    />
                    <input
                      required
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => handleUpdateFormItem(idx, "rate", Number(e.target.value) || 0)}
                      className="w-20 text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-right focus:outline-none"
                    />
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFormItem(idx)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-white/[0.04] pt-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">GST Rate (%)</label>
                  <input
                    required
                    type="number"
                    value={form.gstRate}
                    onChange={(e) => setForm({ ...form, gstRate: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Payment Notes & Terms</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Payment details, bank accounts etc..."
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg p-2.5 focus:border-[#6366f1] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.02]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#6366f1] hover:bg-[#5356e1] cursor-pointer shadow-lg"
                >
                  Create & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
