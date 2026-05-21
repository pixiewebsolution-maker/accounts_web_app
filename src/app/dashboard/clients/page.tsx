"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Globe,
  Instagram,
  Linkedin,
  Facebook,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronDown,
  X,
  ExternalLink,
  Users,
  FolderKanban,
  FileText,
  LayoutGrid,
  Table,
} from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import { StatusBadge, SectionHeader, PageWrapper, ProgressBar } from "@/components/ui";
import { dbService } from "@/lib/db";
import { formatDate, getInitials, cn } from "@/lib/utils";
import type { Client, Employee, Project } from "@/lib/data";

const SERVICES = [
  "Website Development", "E-commerce Development", "Social Media Management",
  "Meta Ads Management", "SEO", "Branding", "Graphic Design",
  "App Development", "Maintenance", "Hosting", "Custom Services",
];

const REQUIREMENTS = [
  { key: "domain", label: "Domain" },
  { key: "hosting", label: "Hosting" },
  { key: "ssl", label: "SSL Certificate" },
  { key: "businessEmail", label: "Business Email" },
  { key: "paymentGateway", label: "Payment Gateway" },
  { key: "whatsappIntegration", label: "WhatsApp Integration" },
  { key: "seo", label: "SEO" },
  { key: "logoDesign", label: "Logo Design" },
  { key: "uiuxDesign", label: "UI/UX Design" },
  { key: "contentWriting", label: "Content Writing" },
  { key: "socialMediaSetup", label: "Social Media Setup" },
  { key: "metaPixelSetup", label: "Meta Pixel Setup" },
  { key: "googleAnalytics", label: "Google Analytics" },
  { key: "maintenancePackage", label: "Maintenance Package" },
];

const STATUS_FILTERS = ["all", "active", "pending", "completed", "on hold", "suspended"];

const avatarColors = [
  "linear-gradient(135deg, #6366f1, #7c3aed)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  "linear-gradient(135deg, #ec4899, #be185d)",
];

const STATUS_COLORS: Record<string, string> = {
  active: "#10b981",
  pending: "#f59e0b",
  completed: "#6366f1",
  "on hold": "#f97316",
  suspended: "#ef4444",
};

interface ClientCardProps {
  client: Client;
  onClick: () => void;
  index: number;
  onRemove: (clientId: string) => void;
  projects: Project[];
}

function ClientCard({ client, onClick, index, onRemove, projects }: ClientCardProps) {
  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const isHighPriorityUpdate = client.latestUpdate?.toLowerCase().includes("buy domain") || client.latestUpdate?.toLowerCase().includes("connect hosting");

  return (
    <div
      className="card p-6 cursor-pointer glass-hover animate-fade-in flex flex-col justify-between relative group"
      onClick={onClick}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4 pr-6">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
              style={{ background: avatarColors[index % avatarColors.length] }}
            >
              {getInitials(client.name === "—" ? client.company : client.name)}
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm truncate max-w-[150px]">
                {client.name === "—" ? "Direct Client" : client.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold" style={{ color: "#6366f1" }}>{client.company}</span>
                {client.businessType && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
                    {client.businessType}
                  </span>
                )}
              </div>
            </div>
          </div>
          <StatusBadge status={client.status} size="sm" />
        </div>

        {/* Spacing updates and ledger additions */}
        {client.latestUpdate && (
          <div className="mb-3 p-3 rounded-lg text-xs transition-all duration-300" style={{ 
            background: isHighPriorityUpdate ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)",
            border: isHighPriorityUpdate ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(255,255,255,0.04)"
          }}>
            <p className="font-semibold mb-1 flex items-center gap-1.5" style={{ color: isHighPriorityUpdate ? "#ef4444" : "#f1f5f9" }}>
              {isHighPriorityUpdate && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />}
              Latest Update
            </p>
            <p style={{ color: isHighPriorityUpdate ? "#fca5a5" : "#94a3b8" }} className="leading-relaxed truncate" title={client.latestUpdate}>
              {client.latestUpdate}
            </p>
          </div>
        )}

        {/* Financial Metrics Mini Bar if active or setup */}
        <div className="mb-4 grid grid-cols-2 gap-2 p-2.5 rounded-lg border text-xs" style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.03)" }}>
          <div>
            <p style={{ color: "#475569" }} className="text-[10px] uppercase font-semibold">Project Cost</p>
            <p className="font-bold text-white mt-0.5">₹{(client.projectCost || 0).toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p style={{ color: "#475569" }} className="text-[10px] uppercase font-semibold">Received</p>
            <p className="font-bold mt-0.5" style={{ color: client.paymentStatus === "Completed" ? "#10b981" : "#f59e0b" }}>
              ₹{(client.paymentReceived || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 mb-4 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-2">
            <Mail size={12} color="#475569" className="flex-shrink-0" />
            <span className="text-xs truncate text-slate-400">{client.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={12} color="#475569" className="flex-shrink-0" />
            <span className="text-xs text-slate-400">{client.phone}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.03]" style={{ color: "#475569" }}>
        <div className="flex items-center gap-1">
          <FolderKanban size={12} />
          <span>{clientProjects.length} project{clientProjects.length !== 1 ? "s" : ""}</span>
        </div>
        {client.paymentStatus && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
            background: client.paymentStatus === "Completed" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
            color: client.paymentStatus === "Completed" ? "#10b981" : "#f59e0b",
          }}>
            {client.paymentStatus}
          </span>
        )}
      </div>
    </div>
  );
}

interface ClientDrawerProps {
  client: Client;
  onClose: () => void;
  onUpdateClient: (clientId: string, updates: Partial<Client>) => void;
  onRemoveClient: (clientId: string) => void;
  employees: Employee[];
  projects: Project[];
}

function ClientDrawer({ client, onClose, onUpdateClient, onRemoveClient, employees, projects }: ClientDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "projects">("overview");
  const [editingUpdate, setEditingUpdate] = useState(false);
  const [tempUpdate, setTempUpdate] = useState(client.latestUpdate || "");
  const [editingInfo, setEditingInfo] = useState(false);

  // Sync tempUpdate if client prop changes
  useState(() => {
    setTempUpdate(client.latestUpdate || "");
  });

  // Edit info form state
  const [infoForm, setInfoForm] = useState({
    name: client.name,
    company: client.company,
    email: client.email,
    phone: client.phone,
    address: client.address,
    businessType: client.businessType || "",
    status: client.status,
    projectCost: client.projectCost || 0,
    paymentReceived: client.paymentReceived || 0,
    paymentStatus: client.paymentStatus || "Pending",
    notes: client.notes || "",
    assignedEmployees: client.assignedEmployees || [],
    services: client.services || [],
  });

  const assignedEmps = employees.filter((e) => (editingInfo ? infoForm.assignedEmployees : client.assignedEmployees).includes(e.id));
  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const completedReqs = Object.values(client.requirements || {}).filter(Boolean).length;
  const totalReqs = Object.values(client.requirements || {}).length || 1;

  const handleSaveInfo = () => {
    onUpdateClient(client.id, {
      name: infoForm.name,
      company: infoForm.company,
      email: infoForm.email,
      phone: infoForm.phone,
      address: infoForm.address,
      businessType: infoForm.businessType,
      status: infoForm.status,
      projectCost: Number(infoForm.projectCost) || 0,
      paymentReceived: Number(infoForm.paymentReceived) || 0,
      paymentStatus: infoForm.paymentStatus,
      notes: infoForm.notes,
      assignedEmployees: infoForm.assignedEmployees,
      services: infoForm.services,
    });
    setEditingInfo(false);
  };

  const handleToggleService = (srv: string) => {
    const current = infoForm.services.includes(srv)
      ? infoForm.services.filter(s => s !== srv)
      : [...infoForm.services, srv];
    setInfoForm({ ...infoForm, services: current });
  };

  const handleToggleEmployee = (empId: string) => {
    const current = infoForm.assignedEmployees.includes(empId)
      ? infoForm.assignedEmployees.filter(id => id !== empId)
      : [...infoForm.assignedEmployees, empId];
    setInfoForm({ ...infoForm, assignedEmployees: current });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />
      <div
        className="w-full max-w-xl overflow-y-auto flex-shrink-0 animate-slide-in flex flex-col"
        style={{ background: "#0d0d1a", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: "#0d0d1a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
              {getInitials(client.name === "—" ? client.company : client.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white leading-tight">
                  {editingInfo ? (
                    <input
                      type="text"
                      value={infoForm.name}
                      onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                      className="bg-white/[0.04] border border-white/[0.1] text-sm text-white rounded px-2 py-0.5 focus:outline-none focus:border-[#6366f1] max-w-[150px]"
                    />
                  ) : (
                    client.name === "—" ? "Direct Client" : client.name
                  )}
                </h2>
                <button
                  onClick={() => {
                    if (editingInfo) {
                      handleSaveInfo();
                    } else {
                      setInfoForm({
                        name: client.name,
                        company: client.company,
                        email: client.email,
                        phone: client.phone,
                        address: client.address,
                        businessType: client.businessType || "",
                        status: client.status,
                        projectCost: client.projectCost || 0,
                        paymentReceived: client.paymentReceived || 0,
                        paymentStatus: client.paymentStatus || "Pending",
                        notes: client.notes || "",
                        assignedEmployees: client.assignedEmployees || [],
                        services: client.services || [],
                      });
                      setEditingInfo(true);
                    }
                  }}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
                >
                  {editingInfo ? "Save Info" : "Edit Info"}
                </button>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "#6366f1" }}>
                {editingInfo ? (
                  <input
                    type="text"
                    value={infoForm.company}
                    onChange={(e) => setInfoForm({ ...infoForm, company: e.target.value })}
                    className="bg-white/[0.04] border border-white/[0.1] text-xs text-indigo-300 rounded px-2 py-0.5 focus:outline-none focus:border-[#6366f1]"
                  />
                ) : (
                  client.company
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to remove this client from the directory?")) {
                  onRemoveClient(client.id);
                }
              }}
              className="p-1.5 rounded-lg cursor-pointer text-slate-500 hover:text-red-400 hover:bg-white/[0.04] transition-all"
              title="Remove Client"
            >
              <Trash2 size={16} />
            </button>
            <StatusBadge status={editingInfo ? infoForm.status : client.status} />
            <button onClick={onClose} className="p-1.5 rounded-lg cursor-pointer" style={{ color: "#475569", background: "rgba(255,255,255,0.04)" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-1 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {(["overview", "requirements", "projects"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-sm font-medium capitalize cursor-pointer rounded-t-lg transition-all"
              style={{
                color: activeTab === tab ? "#f1f5f9" : "#475569",
                borderBottom: activeTab === tab ? "2px solid #6366f1" : "2px solid transparent",
                background: "transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {activeTab === "overview" && (
            <>
              {editingInfo ? (
                /* Full Editing Form Overlay/Section */
                <div className="space-y-4 animate-fade-in">
                  <div className="card p-4 space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Edit Client Particulars</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Business Type</label>
                        <input
                          type="text"
                          value={infoForm.businessType}
                          onChange={(e) => setInfoForm({ ...infoForm, businessType: e.target.value })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                          placeholder="e.g. Travel / Salon"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Operational Status</label>
                        <select
                          value={infoForm.status}
                          onChange={(e) => setInfoForm({ ...infoForm, status: e.target.value as Client["status"] })}
                          className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="on hold">On Hold</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          value={infoForm.email}
                          onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Phone Number</label>
                        <input
                          type="text"
                          value={infoForm.phone}
                          onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Address / City</label>
                      <input
                        type="text"
                        value={infoForm.address}
                        onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                        className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="card p-4 space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Financial Records & Ledger</h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Project Cost (₹)</label>
                        <input
                          type="number"
                          value={infoForm.projectCost}
                          onChange={(e) => setInfoForm({ ...infoForm, projectCost: Number(e.target.value) })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Amount Paid (₹)</label>
                        <input
                          type="number"
                          value={infoForm.paymentReceived}
                          onChange={(e) => setInfoForm({ ...infoForm, paymentReceived: Number(e.target.value) })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Payment status</label>
                        <select
                          value={infoForm.paymentStatus}
                          onChange={(e) => setInfoForm({ ...infoForm, paymentStatus: e.target.value })}
                          className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        >
                          <option value="Completed">Completed</option>
                          <option value="Advance">Advance</option>
                          <option value="Pending">Pending</option>
                          <option value="Unpaid">Unpaid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="card p-4 space-y-3">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Assign Team Members</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto">
                      {employees.map((emp) => {
                        const checked = infoForm.assignedEmployees.includes(emp.id);
                        return (
                          <div
                            key={emp.id}
                            onClick={() => handleToggleEmployee(emp.id)}
                            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white/[0.04] transition-all"
                            style={{ background: checked ? "rgba(99,102,241,0.08)" : "transparent" }}
                          >
                            <div className="w-3.5 h-3.5 rounded border border-white/[0.1] flex items-center justify-center text-[10px] text-white flex-shrink-0" style={{ background: checked ? "#6366f1" : "transparent" }}>
                              {checked && "✓"}
                            </div>
                            <span className="text-xs text-slate-300 truncate">{emp.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="card p-4 space-y-3">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Services Availed</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto">
                      {SERVICES.map((srv) => {
                        const checked = infoForm.services.includes(srv);
                        return (
                          <div
                            key={srv}
                            onClick={() => handleToggleService(srv)}
                            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white/[0.04] transition-all"
                            style={{ background: checked ? "rgba(99,102,241,0.08)" : "transparent" }}
                          >
                            <div className="w-3.5 h-3.5 rounded border border-white/[0.1] flex items-center justify-center text-[10px] text-white flex-shrink-0" style={{ background: checked ? "#6366f1" : "transparent" }}>
                              {checked && "✓"}
                            </div>
                            <span className="text-xs text-slate-300 truncate">{srv}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="card p-4 space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Internal Business Notes</label>
                    <textarea
                      value={infoForm.notes}
                      onChange={(e) => setInfoForm({ ...infoForm, notes: e.target.value })}
                      placeholder="Add specific notes, project scopes, credentials..."
                      className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none min-h-[60px]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingInfo(false)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveInfo}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#6366f1] hover:bg-[#5356e1] cursor-pointer"
                    >
                      Save Info
                    </button>
                  </div>
                </div>
              ) : (
                /* Static view representing dynamic client state */
                <>
                  {/* Editable Latest Update */}
                  <div className="card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#475569" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Latest Update
                      </h3>
                      {!editingUpdate ? (
                        <button
                          onClick={() => setEditingUpdate(true)}
                          className="text-xs font-medium px-2 py-0.5 rounded cursor-pointer hover:bg-white/[0.04]"
                          style={{ color: "#6366f1" }}
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onUpdateClient(client.id, { latestUpdate: tempUpdate });
                              setEditingUpdate(false);
                            }}
                            className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500 text-white cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setTempUpdate(client.latestUpdate || "");
                              setEditingUpdate(false);
                            }}
                            className="text-xs font-medium px-2 py-0.5 rounded text-slate-400 cursor-pointer hover:bg-white/[0.04]"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {!editingUpdate ? (
                      <p className="text-sm text-slate-300 bg-white/[0.01] p-2.5 rounded border border-white/[0.03] min-h-[40px] leading-relaxed">
                        {client.latestUpdate || "—"}
                      </p>
                    ) : (
                      <textarea
                        value={tempUpdate}
                        onChange={(e) => setTempUpdate(e.target.value)}
                        className="w-full text-sm text-white bg-[#0a0a14] p-2.5 rounded border border-white/[0.1] focus:border-[#6366f1] focus:outline-none min-h-[80px]"
                        placeholder="Enter latest update..."
                      />
                    )}
                  </div>

                  {/* Ledger Details */}
                  <div className="card p-4 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#475569" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Ledger & Financials
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p style={{ color: "#475569" }} className="uppercase font-semibold text-[10px]">Project Cost</p>
                        <p className="font-bold text-white text-sm mt-0.5">₹{(client.projectCost || 0).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <p style={{ color: "#475569" }} className="uppercase font-semibold text-[10px]">Paid Amount</p>
                        <p className="font-bold text-sm mt-0.5" style={{ color: client.paymentStatus === "Completed" ? "#10b981" : "#f59e0b" }}>
                          ₹{(client.paymentReceived || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: "#475569" }} className="uppercase font-semibold text-[10px]">Payment status</p>
                        <p className="font-bold text-sm mt-0.5" style={{ color: client.paymentStatus === "Completed" ? "#10b981" : "#f59e0b" }}>
                          {client.paymentStatus || "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="card p-4 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>Contact Information</h3>
                    {[
                      { icon: Mail, label: "Email", value: client.email },
                      { icon: Phone, label: "Phone", value: client.phone },
                      { icon: MapPin, label: "Address", value: client.address },
                      ...(client.website ? [{ icon: Globe, label: "Website", value: client.website }] : []),
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <Icon size={14} color="#475569" className="mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium" style={{ color: "#475569" }}>{label}</p>
                          <p className="text-sm text-white">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Services */}
                  <div className="card p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#475569" }}>Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {client.services && client.services.length > 0 ? (
                        client.services.map((s) => (
                          <span key={s} className="text-xs px-3 py-1 rounded-full animate-fade-in" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">No services active.</span>
                      )}
                    </div>
                  </div>

                  {/* Assigned Team */}
                  <div className="card p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#475569" }}>Assigned Team</h3>
                    <div className="space-y-2">
                      {assignedEmps.length > 0 ? (
                        assignedEmps.map((emp) => (
                          <div key={emp.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="avatar" style={{ width: 28, height: 28, fontSize: "0.6rem" }}>
                                {getInitials(emp.name)}
                              </div>
                              <span className="text-sm text-white">{emp.name}</span>
                            </div>
                            <span className="text-xs" style={{ color: "#475569" }}>{emp.role}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">No team members assigned yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {client.notes && (
                    <div className="card p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#475569" }}>Notes</h3>
                      <p className="text-sm" style={{ color: "#94a3b8" }}>{client.notes}</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "requirements" && (
            <div className="card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>Project Requirements</h3>
                <span className="text-xs font-medium" style={{ color: "#6366f1" }}>{completedReqs}/{totalReqs} completed</span>
              </div>
              <div className="mb-4">
                <ProgressBar value={completedReqs} max={totalReqs} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {REQUIREMENTS.map(({ key, label }) => {
                  const checked = client.requirements ? client.requirements[key] : false;
                  return (
                    <div
                      key={key}
                      onClick={() => {
                        const updatedReqs = {
                          ...client.requirements,
                          [key]: !checked
                        };
                        onUpdateClient(client.id, { requirements: updatedReqs });
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white/[0.04] transition-all"
                      style={{ background: checked ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)" }}
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          background: checked ? "#10b981" : "rgba(255,255,255,0.06)",
                          border: checked ? "none" : "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {checked && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-xs" style={{ color: checked ? "#f1f5f9" : "#475569" }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-3 animate-fade-in">
              {/* Show Project Cost and Paid Info as requested directly in profile */}
              <div className="card p-4 space-y-2 border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.02)" }}>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Project Summary Overview</h4>
                <div className="grid grid-cols-2 gap-4 text-xs mt-2">
                  <div>
                    <span className="text-slate-400 block">Assigned Total Project Cost</span>
                    <span className="font-bold text-white text-sm">₹{(client.projectCost || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Payments Received</span>
                    <span className="font-bold text-emerald-400 text-sm">₹{(client.paymentReceived || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {clientProjects.length === 0 && (
                <div className="card p-6 text-center">
                  <FolderKanban size={24} color="#334155" className="mx-auto mb-2" />
                  <p className="text-sm" style={{ color: "#475569" }}>No projects listed for this client</p>
                </div>
              )}
              {clientProjects.map((proj) => (
                <div key={proj.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white">{proj.name}</h3>
                    <StatusBadge status={proj.status} size="sm" />
                  </div>
                  <p className="text-xs mb-3" style={{ color: "#64748b" }}>{proj.description}</p>
                  <ProgressBar value={proj.progress} />
                  <div className="flex items-center justify-between mt-2 text-xs" style={{ color: "#475569" }}>
                    <span>Due {formatDate(proj.dueDate)}</span>
                    <span>{proj.tasks ? proj.tasks.filter((t) => t.status === "completed").length : 0}/{proj.tasks ? proj.tasks.length : 0} tasks</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [view, setView] = useState<"card" | "table">("card");
  const [sortBy, setSortBy] = useState<"date" | "priority">("priority");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for adding clients
  const [form, setForm] = useState({
    id: "",
    name: "",
    company: "",
    email: "",
    phone: "+91 ",
    address: "",
    businessType: "Website Development",
    latestUpdate: "Project initiated",
    projectCost: "",
    paymentReceived: "",
    paymentStatus: "Pending",
    status: "active" as Client["status"],
    services: ["Website Development"] as string[],
    assignedEmployees: [] as string[],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, employeesData, projectsData] = await Promise.all([
          dbService.getAll("clients"),
          dbService.getAll("employees"),
          dbService.getAll("projects"),
        ]);
        setClientsList(clientsData);
        setEmployees(employeesData);
        setProjects(projectsData);
        setForm(prev => ({ ...prev, id: `c${clientsData.length + 1}` }));
      } catch (err) {
        console.error("Failed to load clients data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateClient = async (clientId: string, updates: Partial<Client>) => {
    try {
      await dbService.update("clients", clientId, updates);
      setClientsList(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      console.error("Failed to update client:", err);
    }
  };

  const handleRemoveClient = async (clientId: string) => {
    if (confirm("Are you sure you want to remove this client from the directory?")) {
      try {
        await dbService.delete("clients", clientId);
        setClientsList(prev => prev.filter((c) => c.id !== clientId));
        setSelectedClient(null);
      } catch (err) {
        console.error("Failed to delete client:", err);
      }
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.email) return;

    // Create requirements template
    const reqs: Record<string, boolean> = {};
    REQUIREMENTS.forEach(r => {
      reqs[r.key] = false;
    });

    const newClient: Client = {
      id: form.id || `c_${Date.now()}`,
      name: form.name || "—",
      company: form.company,
      email: form.email,
      phone: form.phone || "—",
      address: form.address || "Kochi",
      businessType: form.businessType,
      latestUpdate: form.latestUpdate,
      projectCost: Number(form.projectCost) || 0,
      paymentReceived: Number(form.paymentReceived) || 0,
      paymentStatus: form.paymentStatus,
      status: form.status,
      onboardedAt: new Date().toISOString().split("T")[0],
      services: form.services,
      assignedEmployees: form.assignedEmployees,
      requirements: reqs,
    };

    try {
      await dbService.add("clients", newClient);
      const updatedList = [...clientsList, newClient];
      setClientsList(updatedList);

      // Reset Form
      setForm({
        id: `c_${Date.now()}`,
        name: "",
        company: "",
        email: "",
        phone: "+91 ",
        address: "",
        businessType: "Website Development",
        latestUpdate: "Project initiated",
        projectCost: "",
        paymentReceived: "",
        paymentStatus: "Pending",
        status: "active",
        services: ["Website Development"],
        assignedEmployees: [],
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add client:", err);
    }
  };

  const handleToggleFormService = (srv: string) => {
    const current = form.services.includes(srv)
      ? form.services.filter(s => s !== srv)
      : [...form.services, srv];
    setForm({ ...form, services: current });
  };

  const handleToggleFormEmployee = (empId: string) => {
    const current = form.assignedEmployees.includes(empId)
      ? form.assignedEmployees.filter(id => id !== empId)
      : [...form.assignedEmployees, empId];
    setForm({ ...form, assignedEmployees: current });
  };

  const filtered = clientsList.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityMap: Record<string, number> = {
        active: 1,
        "on hold": 2,
        completed: 3,
        pending: 4,
        suspended: 5,
      };
      const prioA = priorityMap[a.status] || 99;
      const prioB = priorityMap[b.status] || 99;
      
      if (prioA !== prioB) {
        return prioA - prioB;
      }
      return new Date(b.onboardedAt).getTime() - new Date(a.onboardedAt).getTime();
    } else {
      // Sort strictly by onboarded/listing date (newest first)
      return new Date(b.onboardedAt).getTime() - new Date(a.onboardedAt).getTime();
    }
  });

  return (
    <>
      <Topbar
        title="Clients"
        subtitle={`${clientsList.length} total clients`}
        onMobileMenu={() => {}}
        action={{ label: "Add Client", onClick: () => setIsModalOpen(true) }}
      />
      <PageWrapper>
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients by name, company, email, phone or city..."
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize cursor-pointer transition-all"
                style={{
                  background: statusFilter === s ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                  color: statusFilter === s ? "#a5b4fc" : "#475569",
                  border: statusFilter === s ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {s}
              </button>
            ))}

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-1.5 p-1 px-2.5 rounded-lg border border-white/[0.06] bg-[#0d0d1a] text-xs text-slate-400 h-[30px]">
              <span className="text-[10px] uppercase font-semibold text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "priority")}
                className="bg-transparent text-white border-none cursor-pointer outline-none font-medium text-xs pr-1"
                style={{ WebkitAppearance: "none", MozAppearance: "none" }}
              >
                <option value="priority" className="bg-[#0a0a0f] text-white">Priority (Active First)</option>
                <option value="date" className="bg-[#0a0a0f] text-white">Date of Listing</option>
              </select>
              <ChevronDown size={12} className="text-slate-500 flex-shrink-0" />
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-lg border border-white/[0.06] ml-2 h-[30px]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <button
                onClick={() => setView("card")}
                className={cn("p-1.5 rounded-md cursor-pointer transition-all flex items-center justify-center", view === "card" ? "bg-[#6366f1] text-white" : "text-[#475569] hover:text-white")}
                title="Card View"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setView("table")}
                className={cn("p-1.5 rounded-md cursor-pointer transition-all flex items-center justify-center", view === "table" ? "bg-[#6366f1] text-white" : "text-[#475569] hover:text-white")}
                title="Table View"
              >
                <Table size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row representing all 5 client activity states */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {["active", "pending", "completed", "on hold", "suspended"].map((s) => {
            const count = clientsList.filter((c) => c.status === s).length;
            return (
              <div key={s} className="card p-3 flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm" 
                  style={{ background: `${STATUS_COLORS[s]}20`, color: STATUS_COLORS[s] }}
                >
                  {count}
                </div>
                <span className="text-xs font-semibold capitalize" style={{ color: "#64748b" }}>{s}</span>
              </div>
            );
          })}
        </div>

        {/* Clients View Rendering */}
        {view === "card" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((client, i) => (
              <ClientCard
                key={client.id}
                client={client}
                index={i}
                onClick={() => setSelectedClient(client)}
                onRemove={handleRemoveClient}
                projects={projects}
              />
            ))}
            {sorted.length === 0 && (
              <div className="col-span-full card p-12 text-center">
                <Users size={32} color="#334155" className="mx-auto mb-3" />
                <p className="text-sm font-medium text-white mb-1">No clients found</p>
                <p className="text-xs" style={{ color: "#475569" }}>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        ) : (
          /* Table View Rendering */
          <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0d0d1a]/80 backdrop-blur-xl animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.01)" }}>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Business Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Type</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Ph Number</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">City</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Latest Update</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Project Cost</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Received</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Status</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {sorted.map((client) => {
                  const isHighPriorityUpdate = client.latestUpdate?.toLowerCase().includes("buy domain") || client.latestUpdate?.toLowerCase().includes("connect hosting");
                  return (
                    <tr 
                      key={client.id} 
                      onClick={() => setSelectedClient(client)}
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors duration-200"
                    >
                      <td className="p-4 text-sm font-semibold text-white">{client.company}</td>
                      <td className="p-4 text-xs">
                        {client.businessType && (
                          <span className="px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>
                            {client.businessType}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-300">{client.name === "—" ? "Direct Client" : client.name}</td>
                      <td className="p-4 text-xs text-slate-400">{client.phone}</td>
                      <td className="p-4 text-xs text-slate-400">{client.address}</td>
                      <td className="p-4 text-xs max-w-[280px]">
                        {client.latestUpdate && (
                          <div className="mb-1">
                            <span className="font-semibold block text-[10px] uppercase" style={{ color: isHighPriorityUpdate ? "#ef4444" : "#a5b4fc" }}>
                              Latest Update
                            </span>
                            <span className="text-slate-300 block truncate" title={client.latestUpdate}>
                              {client.latestUpdate}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-sm font-semibold text-white text-right">
                        ₹{(client.projectCost || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-sm font-semibold text-right" style={{ color: client.paymentStatus === "Completed" ? "#10b981" : "#f59e0b" }}>
                        ₹{(client.paymentReceived || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-center">
                        <StatusBadge status={client.status} size="sm" />
                      </td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleRemoveClient(client.id)}
                          className="p-1 rounded text-[#475569] hover:text-red-400 hover:bg-white/[0.04] transition-all cursor-pointer"
                          title="Remove Client"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-500">
                      <Users size={32} className="mx-auto mb-3" />
                      <p className="text-sm font-medium text-white mb-1">No clients found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </PageWrapper>

      {/* Add Client Modal Overlay */}
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

            <h3 className="text-base font-bold text-white mb-1">Add New Client profile</h3>
            <p className="text-xs text-slate-400 mb-6">Input client information, assign internal projects and record initial ledger costs.</p>

            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Business / Company Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. ONDEZYN"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Business Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Travel, Salon, Boutique"
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Client Name (Full Name)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sandra Suresh"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Client ID (Unique)</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. c7"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="sandra@ondezyn.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Phone Number</label>
                  <input
                    required
                    type="text"
                    placeholder="+91 99999 11111"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">City / Location</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Kochi, Trivandram"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Activity Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Client["status"] })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="completed">Completed</option>
                    <option value="on hold">On Hold</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Project Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="12000"
                    value={form.projectCost}
                    onChange={(e) => setForm({ ...form, projectCost: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Amount Paid (₹)</label>
                  <input
                    type="number"
                    placeholder="4000"
                    value={form.paymentReceived}
                    onChange={(e) => setForm({ ...form, paymentReceived: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Payment status</label>
                  <select
                    value={form.paymentStatus}
                    onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Advance">Advance</option>
                    <option value="Completed">Completed</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Initial Update</label>
                <input
                  type="text"
                  placeholder="e.g. Project initiated, specs finalised..."
                  value={form.latestUpdate}
                  onChange={(e) => setForm({ ...form, latestUpdate: e.target.value })}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                />
              </div>

              {/* Multi Selection: Services */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">Services Availed</label>
                <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.01]">
                  {SERVICES.map((srv) => {
                    const checked = form.services.includes(srv);
                    return (
                      <div
                        key={srv}
                        onClick={() => handleToggleFormService(srv)}
                        className="flex items-center gap-2 p-1.5 rounded-md cursor-pointer hover:bg-white/[0.04] transition-all"
                        style={{ background: checked ? "rgba(99,102,241,0.1)" : "transparent" }}
                      >
                        <div className="w-3.5 h-3.5 rounded border border-white/[0.1] flex items-center justify-center text-[10px] text-white flex-shrink-0" style={{ background: checked ? "#6366f1" : "transparent" }}>
                          {checked && "✓"}
                        </div>
                        <span className="text-xs text-slate-300 truncate">{srv}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Multi Selection: Employees */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">Assign Team Members</label>
                <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.01]">
                  {employees.map((emp) => {
                    const checked = form.assignedEmployees.includes(emp.id);
                    return (
                      <div
                        key={emp.id}
                        onClick={() => handleToggleFormEmployee(emp.id)}
                        className="flex items-center gap-2 p-1.5 rounded-md cursor-pointer hover:bg-white/[0.04] transition-all"
                        style={{ background: checked ? "rgba(99,102,241,0.1)" : "transparent" }}
                      >
                        <div className="w-3.5 h-3.5 rounded border border-white/[0.1] flex items-center justify-center text-[10px] text-white flex-shrink-0" style={{ background: checked ? "#6366f1" : "transparent" }}>
                          {checked && "✓"}
                        </div>
                        <span className="text-xs text-slate-300 truncate">{emp.name}</span>
                      </div>
                    );
                  })}
                </div>
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
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedClient && (
        <ClientDrawer 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
          onUpdateClient={handleUpdateClient}
          onRemoveClient={handleRemoveClient}
          employees={employees}
          projects={projects}
        />
      )}
    </>
  );
}
