"use client";

import { useState, useEffect } from "react";
import { Search, Phone, Mail, Briefcase, Trash2, MapPin, Hash, X, Plus, LayoutGrid, Table, Eye, DollarSign, Calendar } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import { PageWrapper, StatusBadge, ProgressBar } from "@/components/ui";
import { dbService } from "@/lib/db";
import { formatDate, formatCurrency, getInitials, cn } from "@/lib/utils";
import type { Employee, Project } from "@/lib/data";

const DEPT_COLORS: Record<string, string> = {
  Development: "#6366f1",
  Design: "#8b5cf6",
  Marketing: "#f59e0b",
  Management: "#10b981",
};

const STATUS_COLORS: Record<string, string> = {
  active: "#10b981",
  leave: "#3b82f6",
  suspended: "#ef4444",
  deactivated: "#64748b",
  inactive: "#64748b",
};

interface EmployeeDrawerProps {
  employee: Employee;
  onClose: () => void;
  onUpdateEmployee: (empId: string, updates: Partial<Employee>) => void;
  onRemoveEmployee: (empId: string) => void;
  projects: Project[];
}

function EmployeeDrawer({ employee, onClose, onUpdateEmployee, onRemoveEmployee, projects }: EmployeeDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "projects">("overview");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: employee.name,
    role: employee.role,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    salary: employee.salary,
    address: employee.address || "",
    status: employee.status,
  });

  const empProjects = projects.filter((p) => p.assignedEmployees.includes(employee.id));

  const handleSave = () => {
    onUpdateEmployee(employee.id, {
      name: form.name,
      role: form.role,
      email: form.email,
      phone: form.phone,
      department: form.department,
      salary: Number(form.salary) || 0,
      address: form.address,
      status: form.status,
    });
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="w-full max-w-md overflow-y-auto flex-shrink-0 animate-slide-in flex flex-col"
        style={{ background: "#0d0d1a", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: "#0d0d1a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${DEPT_COLORS[employee.department] || "#6366f1"}, ${DEPT_COLORS[employee.department] || "#6366f1"}88)` }}
            >
              {getInitials(employee.name)}
            </div>
            <div>
              <h2 className="font-bold text-white leading-tight">
                {editing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-white/[0.04] border border-white/[0.1] text-sm text-white rounded px-2 py-0.5 focus:outline-none focus:border-[#6366f1] max-w-[150px]"
                  />
                ) : (
                  employee.name
                )}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: DEPT_COLORS[employee.department] || "#6366f1" }}>
                {editing ? (
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="bg-white/[0.04] border border-white/[0.1] text-xs text-[#a5b4fc] rounded px-2 py-0.5 focus:outline-none focus:border-[#6366f1]"
                  />
                ) : (
                  employee.role
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (editing) {
                  handleSave();
                } else {
                  setEditing(true);
                }
              }}
              className="text-[10px] font-semibold px-2 py-1 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              {editing ? "Save Info" : "Edit Info"}
            </button>
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to remove ${employee.name} from the directory?`)) {
                  onRemoveEmployee(employee.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-lg cursor-pointer text-slate-500 hover:text-red-400 hover:bg-white/[0.04] transition-all"
              title="Remove Employee"
            >
              <Trash2 size={16} />
            </button>
            <StatusBadge status={editing ? form.status : employee.status} size="sm" />
            <button onClick={onClose} className="p-1.5 rounded-lg cursor-pointer" style={{ color: "#475569", background: "rgba(255,255,255,0.04)" }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-1 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {(["overview", "projects"] as const).map((tab) => (
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

        {/* Drawer Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {activeTab === "overview" && (
            <>
              {editing ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="card p-4 space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Edit Team Member Details</h3>
                    
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Department</label>
                        <select
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value })}
                          className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        >
                          <option value="Development">Development</option>
                          <option value="Design">Design</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Management">Management</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Monthly Salary (₹)</label>
                        <input
                          type="number"
                          value={form.salary}
                          onChange={(e) => setForm({ ...form, salary: Number(e.target.value) || 0 })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Home Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Operational Activity</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(["active", "leave", "suspended", "deactivated"] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setForm({ ...form, status: st })}
                            className="py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider border transition-all cursor-pointer text-center"
                            style={{
                              background: form.status === st ? `${STATUS_COLORS[st]}20` : "rgba(255,255,255,0.02)",
                              color: form.status === st ? STATUS_COLORS[st] : "#475569",
                              borderColor: form.status === st ? STATUS_COLORS[st] : "rgba(255,255,255,0.06)",
                            }}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove ${employee.name} from the directory?`)) {
                        onRemoveEmployee(employee.id);
                        onClose();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-semibold text-xs cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Remove Team Member
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {/* Summary Profile */}
                  <div className="card p-4 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>Directory Particulars</h3>
                    
                    <div className="flex items-center gap-3">
                      <Hash size={14} color="#475569" className="flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-400">Employee ID</p>
                        <p className="text-sm font-semibold text-white">{employee.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail size={14} color="#475569" className="flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-400">Email Address</p>
                        <p className="text-sm text-white">{employee.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone size={14} color="#475569" className="flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-400">Phone Number</p>
                        <p className="text-sm text-white">{employee.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Briefcase size={14} color="#475569" className="flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-400">Department</p>
                        <p className="text-sm text-white">{employee.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign size={14} color="#475569" className="flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-400">Monthly Compensation</p>
                        <p className="text-sm font-bold text-emerald-400">{formatCurrency(employee.salary)}</p>
                      </div>
                    </div>

                    {employee.address && (
                      <div className="flex items-start gap-3">
                        <MapPin size={14} color="#475569" className="flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-slate-400">Home Address</p>
                          <p className="text-sm text-white leading-relaxed">{employee.address}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Calendar size={14} color="#475569" className="flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-400">Joined Agency</p>
                        <p className="text-sm text-white">{formatDate(employee.joinedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "projects" && (
            <div className="space-y-3 animate-fade-in">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#475569" }}>Assigned Projects ({empProjects.length})</h3>
              {empProjects.length === 0 ? (
                <div className="card p-6 text-center">
                  <Briefcase size={20} color="#334155" className="mx-auto mb-2" />
                  <p className="text-xs" style={{ color: "#475569" }}>No active projects assigned</p>
                </div>
              ) : (
                empProjects.map((p) => (
                  <div key={p.id} className="card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <StatusBadge status={p.status} size="sm" />
                    </div>
                    <ProgressBar value={p.progress} />
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span>Due {formatDate(p.dueDate)}</span>
                      <span>{p.progress}% Completed</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [view, setView] = useState<"card" | "table">("card");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for adding employees
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "+91 ",
    role: "",
    department: "Development",
    salary: "",
    address: "",
    status: "active" as Employee["status"],
  });

  useEffect(() => {
    const loadEmployees = async () => {
      const [empData, projectsData] = await Promise.all([
        dbService.getAll("employees"),
        dbService.getAll("projects"),
      ]);
      setEmployeesList(empData);
      setProjectsList(projectsData);
      setIsLoading(false);
      setForm((prev) => ({
        ...prev,
        id: `e${empData.length + 1}`,
      }));
    };
    loadEmployees();
  }, []);

  const departments = [...new Set(employeesList.map((e) => e.department))];

  const filtered = employeesList.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.address?.toLowerCase() || "").includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const totalSalary = employeesList.reduce((s, e) => s + e.salary, 0);
  const onLeaveCount = employeesList.filter((e) => e.status === "leave").length;
  const suspendedCount = employeesList.filter((e) => e.status === "suspended").length;

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.id || !form.email || !form.phone || !form.role) return;

    const newEmp: Employee = {
      id: form.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      department: form.department,
      salary: Number(form.salary) || 35000,
      joinedAt: new Date().toISOString().split("T")[0],
      status: form.status,
      address: form.address || "Kalamassery, Kerala",
      assignedProjects: [],
    };

    await dbService.add("employees", newEmp);
    const updated = [...employeesList, newEmp];
    setEmployeesList(updated);

    setForm({
      id: `e${updated.length + 1}`,
      name: "",
      email: "",
      phone: "+91 ",
      role: "",
      department: "Development",
      salary: "",
      address: "",
      status: "active",
    });
    setIsModalOpen(false);
  };

  const handleUpdateEmployee = async (empId: string, updates: Partial<Employee>) => {
    await dbService.update("employees", empId, updates);
    setEmployeesList((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, ...updates } : emp))
    );
    if (selectedEmployee && selectedEmployee.id === empId) {
      setSelectedEmployee((prev) => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleRemoveEmployee = async (empId: string) => {
    await dbService.delete("employees", empId);
    setEmployeesList((prev) => prev.filter((e) => e.id !== empId));
    setSelectedEmployee(null);
  };

  return (
    <>
      <Topbar
        title="Employees"
        subtitle={`${employeesList.length} team members`}
        onMobileMenu={() => {}}
        action={{ label: "Add Employee", onClick: () => setIsModalOpen(true) }}
      />
      <PageWrapper>
        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          {[
            { label: "Total Employees", value: employeesList.length, color: "#6366f1" },
            { label: "Active Members", value: employeesList.filter((e) => e.status === "active").length, color: "#10b981" },
            { label: "Monthly Payroll", value: formatCurrency(totalSalary), color: "#f59e0b" },
            { label: "Leave & Suspended", value: `${onLeaveCount} / ${suspendedCount}`, color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>{label}</p>
              <p className="text-xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees by name, role, ID or address..."
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => setDeptFilter("all")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
              style={{
                background: deptFilter === "all" ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                color: deptFilter === "all" ? "#a5b4fc" : "#475569",
                border: deptFilter === "all" ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              All
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
                style={{
                  background: deptFilter === dept ? `${DEPT_COLORS[dept] || "#6366f1"}20` : "rgba(255,255,255,0.04)",
                  color: deptFilter === dept ? DEPT_COLORS[dept] || "#6366f1" : "#475569",
                  border: deptFilter === dept ? `1px solid ${DEPT_COLORS[dept] || "#6366f1"}40` : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {dept}
              </button>
            ))}

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

        {/* Employee rendering */}
        {view === "card" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((emp, i) => {
              const deptColor = DEPT_COLORS[emp.department] || "#6366f1";
              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="card p-6 cursor-pointer glass-hover animate-fade-in relative flex flex-col justify-between"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 pr-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${deptColor}, ${deptColor}88)`, fontSize: "0.85rem" }}
                        >
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm truncate max-w-[130px]">{emp.name}</h3>
                          <p className="text-[10px] mt-0.5 font-medium" style={{ color: deptColor }}>{emp.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Info details */}
                    <div className="space-y-1.5 mb-4 border-b border-white/[0.04] pb-3">
                      <div className="flex items-center gap-2">
                        <Hash size={11} color="#475569" className="flex-shrink-0" />
                        <span className="text-[11px] font-semibold" style={{ color: "#a5b4fc" }}>ID: {emp.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={11} color="#475569" className="flex-shrink-0" />
                        <span className="text-[11px] truncate" style={{ color: "#64748b" }}>{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={11} color="#475569" className="flex-shrink-0" />
                        <span className="text-[11px]" style={{ color: "#64748b" }}>{emp.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={11} color="#475569" className="flex-shrink-0" />
                        <span className="text-[11px]" style={{ color: "#64748b" }}>{emp.department}</span>
                      </div>
                      {emp.address && (
                        <div className="flex items-start gap-2">
                          <MapPin size={11} color="#475569" className="flex-shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-snug" style={{ color: "#64748b" }}>{emp.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer metrics */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="font-semibold text-white">{formatCurrency(emp.salary)}</span>
                      <span style={{ color: "#475569" }}>/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize" style={{
                        background: `${STATUS_COLORS[emp.status] || "#6366f1"}20`,
                        color: STATUS_COLORS[emp.status] || "#6366f1",
                        border: `1px solid ${STATUS_COLORS[emp.status] || "#6366f1"}30`
                      }}>
                        {emp.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full card p-12 text-center">
                <Hash size={32} color="#334155" className="mx-auto mb-3" />
                <p className="text-sm font-medium text-white mb-1">No employees found</p>
                <p className="text-xs" style={{ color: "#475569" }}>Try refining your search or department filter</p>
              </div>
            )}
          </div>
        ) : (
          /* Table View Rendering */
          <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0d0d1a]/80 backdrop-blur-xl animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.01)" }}>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Employee Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">ID</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Role</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Department</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Compensation</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Status</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((emp) => {
                  const deptColor = DEPT_COLORS[emp.department] || "#6366f1";
                  return (
                    <tr 
                      key={emp.id} 
                      onClick={() => setSelectedEmployee(emp)}
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors duration-200"
                    >
                      <td className="p-4 text-sm font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${deptColor}, ${deptColor}88)`, fontSize: "0.7rem" }}
                          >
                            {getInitials(emp.name)}
                          </div>
                          <span>{emp.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-400">{emp.id}</td>
                      <td className="p-4 text-xs text-indigo-300">{emp.role}</td>
                      <td className="p-4 text-xs text-slate-300">{emp.department}</td>
                      <td className="p-4 text-xs text-slate-400">{emp.phone}</td>
                      <td className="p-4 text-sm font-semibold text-white text-right">
                        {formatCurrency(emp.salary)}
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize" style={{
                          background: `${STATUS_COLORS[emp.status] || "#6366f1"}20`,
                          color: STATUS_COLORS[emp.status] || "#6366f1",
                          border: `1px solid ${STATUS_COLORS[emp.status] || "#6366f1"}30`
                        }}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedEmployee(emp)}
                            className="p-1 rounded text-indigo-400 hover:text-white hover:bg-indigo-500/10 transition-all cursor-pointer"
                            title="View Employee Profile"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveEmployee(emp.id)}
                            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/[0.04] transition-all cursor-pointer"
                            title="Remove Employee"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </PageWrapper>

      {/* Add Employee Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-md overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d1a] p-6 shadow-2xl relative animate-scale-in"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer hover:bg-white/[0.04] transition-all"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Add New Team Member</h3>
            <p className="text-xs text-slate-400 mb-6">Input basic details and operational status to list a new employee.</p>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sandra Suresh"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Employee ID</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. e6"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Role</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Lead Designer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
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
                    placeholder="sandra@agencyos.in"
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
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Monthly Salary (₹)</label>
                  <input
                    required
                    type="number"
                    placeholder="45000"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Home Address</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Kalamassery, Kerala"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Operational Activity</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["active", "leave", "suspended", "deactivated"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setForm({ ...form, status: st })}
                      className="py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider border transition-all cursor-pointer text-center"
                      style={{
                        background: form.status === st ? `${STATUS_COLORS[st]}20` : "rgba(255,255,255,0.02)",
                        color: form.status === st ? STATUS_COLORS[st] : "#475569",
                        borderColor: form.status === st ? STATUS_COLORS[st] : "rgba(255,255,255,0.06)",
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
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
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Employee Detail Drawer */}
      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdateEmployee={handleUpdateEmployee}
          onRemoveEmployee={handleRemoveEmployee}
          projects={projectsList}
        />
      )}
    </>
  );
}
