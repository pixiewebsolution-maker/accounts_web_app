"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Calendar,
  Users,
  Target,
  ChevronRight,
  LayoutGrid,
  Table,
  X,
  Edit2,
  CheckCircle,
  Clock,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import { StatusBadge, PageWrapper, ProgressBar, AvatarGroup } from "@/components/ui";
import { projects as initialProjects, employees, clients } from "@/lib/data";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import type { Project, Task } from "@/lib/data";

const STATUS_FILTERS = ["all", "in progress", "hold", "completed", "demo", "active", "pending"];

const REQUIREMENTS = [
  { key: "domain", label: "Domain Setup" },
  { key: "hosting", label: "Hosting Config" },
  { key: "ssl", label: "SSL Certificate" },
  { key: "businessEmail", label: "Business Email" },
  { key: "paymentGateway", label: "Payment Gateway" },
  { key: "whatsappIntegration", label: "WhatsApp Integration" },
  { key: "seo", label: "SEO Pack" },
  { key: "logoDesign", label: "Logo Branding" },
  { key: "uiuxDesign", label: "UI/UX Design" },
  { key: "contentWriting", label: "Content Writing" },
  { key: "socialMediaSetup", label: "Social Media Setup" },
  { key: "metaPixelSetup", label: "Meta Pixel Integration" },
  { key: "googleAnalytics", label: "Google Analytics" },
  { key: "maintenancePackage", label: "Maintenance Support" },
];

const SERVICES_LIST = [
  "Website Development", "E-commerce Development", "Social Media Management",
  "Meta Ads Management", "SEO", "Branding", "Graphic Design",
  "App Development", "Maintenance", "Hosting", "Custom Services",
];

const STATUS_COLORS: Record<string, string> = {
  "in progress": "#3b82f6",
  hold: "#f59e0b",
  completed: "#10b981",
  demo: "#a855f7",
  active: "#10b981",
  pending: "#64748b",
  "on hold": "#f59e0b"
};

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const emp = employees.find((e) => e.id === task.assignedTo);
  const priorityColor: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981",
  };

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl transition-all"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-pointer transition-all hover:scale-105"
        style={{
          background: task.status === "completed" ? "#10b981" : "rgba(255,255,255,0.06)",
          border: task.status === "completed" ? "none" : "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {task.status === "completed" && <span className="text-white text-xs">✓</span>}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", task.status === "completed" && "line-through")} style={{ color: task.status === "completed" ? "#475569" : "#f1f5f9" }}>
          {task.title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Due {formatDate(task.dueDate)}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: priorityColor[task.priority] }}
          title={`${task.priority} priority`}
        />
        {emp && (
          <div className="avatar" style={{ width: 22, height: 22, fontSize: "0.5rem" }} title={emp.name}>
            {emp.name.split(" ").map((n) => n[0]).join("")}
          </div>
        )}
        <StatusBadge status={task.status} size="sm" />
        
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/[0.04]"
          >
            <Edit2 size={11} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/[0.04]"
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onRemove: (projectId: string) => void;
  onUpdate: (projectId: string, updates: Partial<Project>) => void;
  onClick: () => void;
}

function ProjectCard({ project, onRemove, onUpdate, onClick }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const empNames = employees.filter((e) => project.assignedEmployees.includes(e.id)).map((e) => e.name);
  const completedTasks = project.tasks ? project.tasks.filter((t) => t.status === "completed").length : 0;
  const totalTasks = project.tasks ? project.tasks.length : 0;
  const budgetUsed = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;

  const handleToggleTask = (taskId: string) => {
    const updatedTasks: Task[] = project.tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, status: (t.status === "completed" ? "in progress" : "completed") as Task["status"] };
      }
      return t;
    });
    const completed = updatedTasks.filter((t) => t.status === "completed").length;
    const progress = updatedTasks.length > 0 ? Math.round((completed / updatedTasks.length) * 100) : 0;
    onUpdate(project.id, { tasks: updatedTasks, progress });
  };

  return (
    <div
      onClick={onClick}
      className="card animate-fade-in relative group flex flex-col justify-between cursor-pointer glass-hover"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4 pr-6">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{project.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: "#6366f1" }}>{project.clientName}</p>
            <p className="text-xs mt-1.5 text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
          </div>
          <StatusBadge status={project.status} size="sm" />
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500 font-medium">Overall Progress</span>
            <span className="text-xs font-bold text-white">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>

        {/* Budget */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500 font-medium">Budget Spent</span>
            <span className="text-xs text-slate-400">
              {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
            </span>
          </div>
          <ProgressBar value={budgetUsed} color={budgetUsed > 90 ? "#ef4444" : budgetUsed > 70 ? "#f59e0b" : "#10b981"} />
        </div>

        {/* Meta / Requirements tags list if any */}
        {project.services && project.services.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.services.map((srv) => (
              <span 
                key={srv} 
                className="text-[9px] px-2 py-0.5 rounded-full border border-white/[0.04] text-slate-400 bg-white/[0.02]"
              >
                {srv}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.03]">
          <div className="flex items-center gap-3">
            {project.status === "completed" && project.completedAt ? (
              <div className="flex items-center gap-1" style={{ color: "#10b981" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Completed {formatDate(project.completedAt)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar size={12} className="text-slate-500" />
                <span>Due {formatDate(project.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-slate-400">
              <Target size={12} className="text-slate-500" />
              <span>{completedTasks}/{totalTasks} tasks</span>
            </div>
          </div>
          <AvatarGroup names={empNames} max={3} />
        </div>
      </div>

      {/* Tasks Expand */}
      {project.tasks && project.tasks.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="w-full flex items-center justify-between px-6 py-3.5 text-xs font-medium cursor-pointer transition-colors hover:bg-white/[0.01]"
            style={{ color: "#475569", background: "transparent" }}
          >
            <span>View Tasks ({project.tasks.length})</span>
            <ChevronRight
              size={14}
              style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            />
          </button>
          {expanded && (
            <div className="px-6 pb-5 space-y-2">
              {project.tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ProjectDrawerProps {
  project: Project;
  onClose: () => void;
  onUpdate: (projectId: string, updates: Partial<Project>) => void;
  onRemove: (projectId: string) => void;
}

function ProjectDrawer({ project, onClose, onUpdate, onRemove }: ProjectDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "requirements">("overview");
  const [editingInfo, setEditingInfo] = useState(false);

  // Edit details form state
  const [form, setForm] = useState({
    name: project.name,
    clientId: project.clientId,
    description: project.description,
    status: project.status,
    progress: String(project.progress),
    budget: String(project.budget),
    spent: String(project.spent),
    startDate: project.startDate,
    dueDate: project.dueDate,
    services: project.services || [],
    assignedEmployees: project.assignedEmployees || [],
  });

  // Task adding state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium" as Task["priority"],
    assignedTo: employees[0]?.id || "e1",
  });

  // Task editing state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskForm, setEditTaskForm] = useState({
    title: "",
    dueDate: "",
    priority: "medium" as Task["priority"],
    assignedTo: "",
  });

  const handleSaveInfo = () => {
    const matchedClient = clients.find((c) => c.id === form.clientId);
    const clientName = matchedClient ? matchedClient.company : project.clientName;

    onUpdate(project.id, {
      name: form.name,
      clientId: form.clientId,
      clientName: clientName,
      description: form.description,
      status: form.status,
      progress: Number(form.progress) || 0,
      budget: Number(form.budget) || 0,
      spent: Number(form.spent) || 0,
      startDate: form.startDate,
      dueDate: form.dueDate,
      services: form.services,
      assignedEmployees: form.assignedEmployees,
    });
    setEditingInfo(false);
  };

  // Toggle tasks check state
  const handleToggleTask = (taskId: string) => {
    const updatedTasks: Task[] = project.tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, status: (t.status === "completed" ? "in progress" : "completed") as Task["status"] };
      }
      return t;
    });
    const completed = updatedTasks.filter((t) => t.status === "completed").length;
    const progress = updatedTasks.length > 0 ? Math.round((completed / updatedTasks.length) * 100) : 0;
    onUpdate(project.id, { tasks: updatedTasks, progress });
    setForm(prev => ({ ...prev, progress: String(progress) }));
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to remove this task?")) {
      const updatedTasks = project.tasks.filter((t) => t.id !== taskId);
      const completed = updatedTasks.filter((t) => t.status === "completed").length;
      const progress = updatedTasks.length > 0 ? Math.round((completed / updatedTasks.length) * 100) : 0;
      onUpdate(project.id, { tasks: updatedTasks, progress });
      setForm(prev => ({ ...prev, progress: String(progress) }));
    }
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) return;

    const newTask: Task = {
      id: `t_${project.id}_${Date.now()}`,
      projectId: project.id,
      title: taskForm.title,
      status: "in progress",
      assignedTo: taskForm.assignedTo,
      dueDate: taskForm.dueDate,
      priority: taskForm.priority,
    };

    const updatedTasks = [...(project.tasks || []), newTask];
    const completed = updatedTasks.filter((t) => t.status === "completed").length;
    const progress = Math.round((completed / updatedTasks.length) * 100);

    onUpdate(project.id, { tasks: updatedTasks, progress });
    setForm(prev => ({ ...prev, progress: String(progress) }));
    setTaskForm({
      title: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      assignedTo: employees[0]?.id || "e1",
    });
    setIsAddingTask(false);
  };

  // Start editing task
  const handleStartEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskForm({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedTo: task.assignedTo,
    });
  };

  // Save edited task
  const handleSaveEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTaskForm.title) return;

    const updatedTasks = project.tasks.map((t) => {
      if (t.id === editingTaskId) {
        return {
          ...t,
          title: editTaskForm.title,
          dueDate: editTaskForm.dueDate,
          priority: editTaskForm.priority,
          assignedTo: editTaskForm.assignedTo,
        };
      }
      return t;
    });

    onUpdate(project.id, { tasks: updatedTasks });
    setEditingTaskId(null);
  };

  const handleToggleService = (srv: string) => {
    const current = form.services.includes(srv)
      ? form.services.filter((s) => s !== srv)
      : [...form.services, srv];
    setForm({ ...form, services: current });
  };

  const handleToggleEmployee = (empId: string) => {
    const current = form.assignedEmployees.includes(empId)
      ? form.assignedEmployees.filter((id) => id !== empId)
      : [...form.assignedEmployees, empId];
    setForm({ ...form, assignedEmployees: current });
  };

  const matchedClient = clients.find((c) => c.id === project.clientId);

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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              {project.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white leading-tight">
                  {editingInfo ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-white/[0.04] border border-white/[0.1] text-sm text-white rounded px-2 py-0.5 focus:outline-none focus:border-[#6366f1] max-w-[160px]"
                    />
                  ) : (
                    project.name
                  )}
                </h2>
                <button
                  onClick={() => {
                    if (editingInfo) {
                      handleSaveInfo();
                    } else {
                      setEditingInfo(true);
                    }
                  }}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
                >
                  {editingInfo ? "Save Details" : "Edit Details"}
                </button>
              </div>
              <p className="text-xs mt-0.5 text-slate-400">{project.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to remove this project?")) {
                  onRemove(project.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-lg cursor-pointer text-slate-500 hover:text-red-400 hover:bg-white/[0.04] transition-all"
              title="Remove Project"
            >
              <Trash2 size={16} />
            </button>
            <StatusBadge status={editingInfo ? form.status : project.status} />
            <button onClick={onClose} className="p-1.5 rounded-lg cursor-pointer" style={{ color: "#475569", background: "rgba(255,255,255,0.04)" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-1 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {(["overview", "tasks", "requirements"] as const).map((tab) => (
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
              {tab === "requirements" ? "Checklist" : tab}
            </button>
          ))}
        </div>

        {/* Drawer Scroll Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {activeTab === "overview" && (
            <>
              {editingInfo ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="card p-4 space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Edit Project Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Associated Client</label>
                        <select
                          value={form.clientId}
                          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                          className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        >
                          {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.company}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Activity Status</label>
                        <select
                          value={form.status}
                          onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
                          className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        >
                          <option value="in progress">In Progress</option>
                          <option value="hold">On Hold</option>
                          <option value="completed">Completed</option>
                          <option value="demo">Demo / Handover</option>
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Start Date</label>
                        <input
                          type="date"
                          value={form.startDate}
                          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Due Date</label>
                        <input
                          type="date"
                          value={form.dueDate}
                          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Budget (₹)</label>
                        <input
                          type="number"
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Spent (₹)</label>
                        <input
                          type="number"
                          value={form.spent}
                          onChange={(e) => setForm({ ...form, spent: e.target.value })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Progress (%)</label>
                        <input
                          type="number"
                          value={form.progress}
                          onChange={(e) => setForm({ ...form, progress: e.target.value })}
                          className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Project Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none min-h-[60px]"
                      />
                    </div>
                  </div>

                  <div className="card p-4 space-y-3">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Assign Team Members</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto">
                      {employees.map((emp) => {
                        const checked = form.assignedEmployees.includes(emp.id);
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
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Services / Tagged Categories</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto">
                      {SERVICES_LIST.map((srv) => {
                        const checked = form.services.includes(srv);
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
                <>
                  {/* Static Details */}
                  <div className="card p-4 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Briefcase size={12} /> Project Information
                    </h3>
                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex justify-between border-b border-white/[0.03] pb-2">
                        <span className="text-slate-500">Project Name</span>
                        <span className="font-semibold text-white">{project.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/[0.03] pb-2">
                        <span className="text-slate-500">Client / Company</span>
                        <span className="font-semibold text-[#6366f1]">{project.clientName}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/[0.03] pb-2">
                        <span className="text-slate-500">Schedule</span>
                        <span className="text-white">
                          {formatDate(project.startDate)} — {formatDate(project.dueDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Description</span>
                        <span className="text-right text-slate-400 max-w-[280px] leading-relaxed">{project.description}</span>
                      </div>
                    </div>
                  </div>

                  {/* Finances */}
                  <div className="card p-4 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Budget & Allocation</h3>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500 uppercase font-semibold text-[10px]">Total Budget</p>
                        <p className="font-bold text-white text-sm mt-0.5">{formatCurrency(project.budget)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase font-semibold text-[10px]">Amount Spent</p>
                        <p className="font-bold text-white text-sm mt-0.5">{formatCurrency(project.spent)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase font-semibold text-[10px]">Overall Progress</p>
                        <p className="font-bold text-sm mt-0.5 text-emerald-400">{project.progress}%</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <ProgressBar value={project.progress} />
                    </div>
                  </div>

                  {/* Assigned Team */}
                  <div className="card p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Assigned Employees</h3>
                    <div className="space-y-2">
                      {employees.filter(e => project.assignedEmployees.includes(e.id)).length > 0 ? (
                        employees.filter(e => project.assignedEmployees.includes(e.id)).map((emp) => (
                          <div key={emp.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="avatar" style={{ width: 26, height: 26, fontSize: "0.6rem" }}>
                                {emp.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="text-xs text-white font-medium">{emp.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-semibold">{emp.role}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">No team assigned.</span>
                      )}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="card p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Scope of Services</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {project.services && project.services.length > 0 ? (
                        project.services.map((s) => (
                          <span key={s} className="text-xs px-2.5 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">No services spec list.</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-4 animate-fade-in">
              {/* Header inside task tab */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target size={13} /> Project Tasks ({project.tasks ? project.tasks.length : 0})
                </h3>
                <button
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="text-xs font-semibold flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                >
                  {isAddingTask ? <X size={11} /> : <Plus size={11} />}
                  <span>{isAddingTask ? "Cancel" : "Add Task"}</span>
                </button>
              </div>

              {/* Inline task editing overlay block if selected */}
              {editingTaskId && (
                <form onSubmit={handleSaveEditTask} className="card p-4 space-y-3 border border-indigo-500/30 bg-indigo-500/[0.01]">
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Edit Task Item</h4>
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-1 uppercase font-semibold">Task Title</label>
                    <input
                      required
                      type="text"
                      value={editTaskForm.title}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                      className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.1] rounded px-2.5 py-1.5 focus:border-[#6366f1] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1 uppercase font-semibold">Due Date</label>
                      <input
                        type="date"
                        value={editTaskForm.dueDate}
                        onChange={(e) => setEditTaskForm({ ...editTaskForm, dueDate: e.target.value })}
                        className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.1] rounded px-2.5 py-1.5 focus:border-[#6366f1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1 uppercase font-semibold">Priority</label>
                      <select
                        value={editTaskForm.priority}
                        onChange={(e) => setEditTaskForm({ ...editTaskForm, priority: e.target.value as Task["priority"] })}
                        className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.1] rounded px-2.5 py-1.5 focus:border-[#6366f1] focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1 uppercase font-semibold">Assignee</label>
                      <select
                        value={editTaskForm.assignedTo}
                        onChange={(e) => setEditTaskForm({ ...editTaskForm, assignedTo: e.target.value })}
                        className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.1] rounded px-2.5 py-1.5 focus:border-[#6366f1] focus:outline-none"
                      >
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name.split(" ")[0]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingTaskId(null)}
                      className="px-3 py-1 rounded text-[10px] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded text-[10px] bg-[#6366f1] text-white hover:bg-[#5356e1]"
                    >
                      Save Task
                    </button>
                  </div>
                </form>
              )}

              {/* Inline task adding block */}
              {isAddingTask && (
                <form onSubmit={handleAddTask} className="card p-4 space-y-3 border border-indigo-500/20 bg-[#0d0d1a]/50">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">New Task Deliverable</h4>
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-1 uppercase font-semibold">Task Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Design homepage mockup"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className="w-full text-xs text-white bg-[#0a0a14] border border-white/[0.06] rounded px-2.5 py-1.5 focus:border-[#6366f1] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1 uppercase font-semibold">Due Date</label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                        className="w-full text-xs text-white bg-[#0a0a14] border border-white/[0.06] rounded px-2.5 py-1.5 focus:border-[#6366f1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1 uppercase font-semibold">Priority</label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Task["priority"] })}
                        className="w-full text-xs text-white bg-[#0a0a14] border border-white/[0.06] rounded px-2.5 py-1.5 focus:border-[#6366f1] focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1 uppercase font-semibold">Assignee</label>
                      <select
                        value={taskForm.assignedTo}
                        onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                        className="w-full text-xs text-white bg-[#0a0a14] border border-white/[0.06] rounded px-2.5 py-1.5 focus:border-[#6366f1] focus:outline-none"
                      >
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1.5">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="px-3 py-1 rounded text-[10px] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded text-[10px] bg-[#6366f1] text-white hover:bg-[#5356e1]"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              )}

              {/* Tasks List */}
              <div className="space-y-2">
                {project.tasks && project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={handleStartEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <div className="card p-6 text-center text-slate-500">
                    <AlertCircle size={20} className="mx-auto mb-2" />
                    <p className="text-xs">No tasks mapped to this project yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "requirements" && (
            <div className="card p-4 animate-fade-in space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Client Requirement Checklist</h3>
              {matchedClient ? (
                <div className="grid grid-cols-2 gap-2">
                  {REQUIREMENTS.map(({ key, label }) => {
                    const checked = matchedClient.requirements ? !!matchedClient.requirements[key] : false;
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          const updatedReqs = {
                            ...(matchedClient.requirements || {}),
                            [key]: !checked,
                          };
                          matchedClient.requirements = updatedReqs;
                          // Force a structural react update by mutating project slightly or triggering update callbacks
                          onUpdate(project.id, { progress: project.progress });
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white/[0.04] transition-all"
                        style={{ background: checked ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)" }}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0"
                          style={{
                            background: checked ? "#10b981" : "rgba(255,255,255,0.06)",
                            border: checked ? "none" : "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          {checked && <span className="text-white text-[10px]">✓</span>}
                        </div>
                        <span className="text-xs" style={{ color: checked ? "#f1f5f9" : "#475569" }}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No client requirements checklist found for direct projects.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form State for Adding Projects
  const [form, setForm] = useState({
    id: `p${projectsList.length + 1}`,
    name: "",
    clientId: clients[0]?.id || "",
    description: "",
    status: "in progress" as Project["status"],
    progress: "0",
    budget: "",
    spent: "0",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    services: [] as string[],
    assignedEmployees: [] as string[],
    requirements: {} as Record<string, boolean>,
  });

  const handleToggleFormService = (srv: string) => {
    const current = form.services.includes(srv)
      ? form.services.filter((s) => s !== srv)
      : [...form.services, srv];
    setForm({ ...form, services: current });
  };

  const handleToggleFormEmployee = (empId: string) => {
    const current = form.assignedEmployees.includes(empId)
      ? form.assignedEmployees.filter((id) => id !== empId)
      : [...form.assignedEmployees, empId];
    setForm({ ...form, assignedEmployees: current });
  };

  const handleToggleFormRequirement = (reqKey: string) => {
    const current = { ...form.requirements };
    current[reqKey] = !current[reqKey];
    setForm({ ...form, requirements: current });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.id || !form.clientId) return;

    const matchedClient = clients.find((c) => c.id === form.clientId);
    const clientName = matchedClient ? matchedClient.company : "Direct Client";

    if (matchedClient && Object.keys(form.requirements).length > 0) {
      matchedClient.requirements = {
        ...(matchedClient.requirements || {}),
        ...form.requirements,
      };
    }

    const newProject: Project = {
      id: form.id,
      name: form.name,
      clientId: form.clientId,
      clientName: clientName,
      description: form.description || "Project created under supervision.",
      status: form.status,
      progress: Number(form.progress) || 0,
      startDate: form.startDate,
      dueDate: form.dueDate,
      completedAt: form.status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
      budget: Number(form.budget) || 10000,
      spent: Number(form.spent) || 0,
      assignedEmployees: form.assignedEmployees,
      services: form.services.length > 0 ? form.services : ["Website Development"],
      tasks: [
        {
          id: `t_${form.id}_1`,
          projectId: form.id,
          title: "Initial specification check & kickoff",
          status: form.status === "completed" ? "completed" : "in progress",
          assignedTo: form.assignedEmployees[0] || "e1",
          dueDate: form.dueDate,
          priority: "medium",
        }
      ],
    };

    const updatedList = [...projectsList, newProject];
    setProjectsList(updatedList);
    initialProjects.push(newProject);

    setForm({
      id: `p${updatedList.length + 1}`,
      name: "",
      clientId: clients[0]?.id || "",
      description: "",
      status: "in progress",
      progress: "0",
      budget: "",
      spent: "0",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      services: [],
      assignedEmployees: [],
      requirements: {},
    });
    setIsModalOpen(false);
  };

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    setProjectsList(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));

    const idx = initialProjects.findIndex((p) => p.id === projectId);
    if (idx !== -1) {
      Object.assign(initialProjects[idx], updates);
    }
  };

  const handleRemoveProject = (projectId: string) => {
    if (confirm("Are you sure you want to remove this project? This will erase all project specs from AgencyOS.")) {
      setProjectsList((prev) => prev.filter((p) => p.id !== projectId));
      
      const idx = initialProjects.findIndex((p) => p.id === projectId);
      if (idx !== -1) {
        initialProjects.splice(idx, 1);
      }
      setSelectedProject(null);
    }
  };

  const filtered = projectsList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase());
    
    const matchStatus = 
      statusFilter === "all" || 
      p.status === statusFilter || 
      (statusFilter === "hold" && p.status === "on hold") ||
      (statusFilter === "in progress" && p.status === "active");

    return matchSearch && matchStatus;
  });

  const totalBudget = projectsList.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projectsList.reduce((s, p) => s + p.spent, 0);

  return (
    <>
      <Topbar
        title="Projects"
        subtitle={`${projectsList.length} total projects`}
        onMobileMenu={() => {}}
        action={{ label: "New Project", onClick: () => setIsModalOpen(true) }}
      />
      <PageWrapper>
        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          {[
            { label: "Total Projects", value: projectsList.length, color: "#6366f1" },
            { label: "In Progress / Active", value: projectsList.filter((p) => p.status === "in progress" || p.status === "active").length, color: "#3b82f6" },
            { label: "Total Budget", value: formatCurrency(totalBudget), color: "#f59e0b" },
            { label: "Spent Ledger", value: formatCurrency(totalSpent), color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#475569" }}>{label}</p>
              <p className="text-xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects or associated clients..."
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

            {/* View Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-lg border border-white/[0.06] ml-2 h-[30px]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <button
                onClick={() => setView("grid")}
                className={cn("p-1.5 rounded-md cursor-pointer transition-all flex items-center justify-center", view === "grid" ? "bg-[#6366f1] text-white" : "text-[#475569] hover:text-white")}
                title="Grid View"
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

        {/* View Conditional Render */}
        {view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onRemove={handleRemoveProject}
                onUpdate={handleUpdateProject}
                onClick={() => setSelectedProject(project)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full card p-12 text-center">
                <Target size={32} color="#334155" className="mx-auto mb-3" />
                <p className="text-sm font-medium text-white mb-1">No projects found</p>
                <p className="text-xs" style={{ color: "#475569" }}>Try refining your search queries or filter choices</p>
              </div>
            )}
          </div>
        ) : (
          /* Table View rendering with Actions and Budget progress bars */
          <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0d0d1a]/80 backdrop-blur-xl animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.01)" }}>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Project Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Client Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Overall Progress</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Budget Usage</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Due / Completion Date</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Tasks</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Assigned Team</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Status</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((project) => {
                  const empNames = employees.filter((e) => project.assignedEmployees.includes(e.id)).map((e) => e.name);
                  const completedTasks = project.tasks ? project.tasks.filter((t) => t.status === "completed").length : 0;
                  const totalTasks = project.tasks ? project.tasks.length : 0;
                  const budgetUsed = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
                  return (
                    <tr 
                      key={project.id} 
                      onClick={() => setSelectedProject(project)}
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors duration-200"
                    >
                      <td className="p-4 text-sm font-semibold text-white">{project.name}</td>
                      <td className="p-4 text-xs" style={{ color: "#6366f1" }}>{project.clientName}</td>
                      <td className="p-4 text-xs min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{project.progress}%</span>
                          <div className="flex-1">
                            <ProgressBar value={project.progress} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[10px]">
                            {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                          </span>
                          <div className="flex-1">
                            <ProgressBar value={budgetUsed} color={budgetUsed > 90 ? "#ef4444" : budgetUsed > 70 ? "#f59e0b" : "#10b981"} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs">
                        {project.status === "completed" && project.completedAt ? (
                          <span className="text-emerald-400 font-medium">Completed {formatDate(project.completedAt)}</span>
                        ) : (
                          <span className="text-slate-400">Due {formatDate(project.dueDate)}</span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-center text-slate-300">
                        {completedTasks} / {totalTasks}
                      </td>
                      <td className="p-4 text-xs">
                        <AvatarGroup names={empNames} max={3} />
                      </td>
                      <td className="p-4 text-center">
                        <StatusBadge status={project.status} size="sm" />
                      </td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleRemoveProject(project.id)}
                          className="p-1 rounded text-[#475569] hover:text-red-400 hover:bg-white/[0.04] transition-all cursor-pointer"
                          title="Remove Project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-500">
                      <Target size={32} className="mx-auto mb-3" />
                      <p className="text-sm font-medium text-white mb-1">No projects found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </PageWrapper>

      {/* Add Project Modal */}
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

            <h3 className="text-base font-bold text-white mb-1">Create New Project</h3>
            <p className="text-xs text-slate-400 mb-6">Create a dynamic project spec, configure required checklists, select service models and set project financials.</p>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Project Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rogue Ninja App"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Project ID</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. p8"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Associated Client</label>
                  <select
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.name === "—" ? "Direct" : c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Activity Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
                    className="w-full text-xs text-white bg-[#0d0d1a] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  >
                    <option value="in progress">In Progress</option>
                    <option value="hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="demo">Demo / Handover</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Start Date</label>
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Overall Progress (%)</label>
                  <input
                    type="number"
                    placeholder="25"
                    min="0"
                    max="100"
                    value={form.progress}
                    onChange={(e) => setForm({ ...form, progress: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Budget Ledger (₹)</label>
                  <input
                    required
                    type="number"
                    placeholder="15000"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Amount Spent (₹)</label>
                  <input
                    type="number"
                    placeholder="2500"
                    value={form.spent}
                    onChange={(e) => setForm({ ...form, spent: e.target.value })}
                    className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Brief Project Description</label>
                <textarea
                  placeholder="Describe the application features, scopes and terms..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 focus:border-[#6366f1] focus:outline-none min-h-[50px]"
                />
              </div>

              {/* Requirements Multi-Select Checklist */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">Project Checklist & Requirements</label>
                <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto p-2 rounded-lg border border-white/[0.06] bg-white/[0.01]">
                  {REQUIREMENTS.map((req) => {
                    const checked = !!form.requirements[req.key];
                    return (
                      <div
                        key={req.key}
                        onClick={() => handleToggleFormRequirement(req.key)}
                        className="flex items-center gap-2 p-1.5 rounded-md cursor-pointer hover:bg-white/[0.04] transition-all"
                        style={{ background: checked ? "rgba(16,185,129,0.08)" : "transparent" }}
                      >
                        <div className="w-3.5 h-3.5 rounded border border-white/[0.1] flex items-center justify-center text-[10px] text-white flex-shrink-0" style={{ background: checked ? "#10b981" : "transparent" }}>
                          {checked && "✓"}
                        </div>
                        <span className="text-xs text-slate-300 truncate">{req.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Project Services / Type Select list */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">Project Services / Type of Project</label>
                <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto p-2 rounded-lg border border-white/[0.06] bg-white/[0.01]">
                  {SERVICES_LIST.map((srv) => {
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

              {/* Assigned Team Members list */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">Assign Team Members</label>
                <div className="grid grid-cols-2 gap-2 max-h-[110px] overflow-y-auto p-2 rounded-lg border border-white/[0.06] bg-white/[0.01]">
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <ProjectDrawer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={(projectId, updates) => {
            handleUpdateProject(projectId, updates);
            setSelectedProject(prev => prev ? { ...prev, ...updates } : null);
          }}
          onRemove={handleRemoveProject}
        />
      )}
    </>
  );
}
