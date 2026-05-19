import { supabase, isSupabaseConfigured } from "./supabase";
import { 
  clients as initialClients, 
  projects as initialProjects, 
  invoices as initialInvoices, 
  payments as initialPayments, 
  expenses as initialExpenses, 
  employees as initialEmployees 
} from "./data";

// Helper for localStorage fallback
const getLocal = (key: string, fallback: any) => {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(`pixiewebs_${key}`);
  if (!stored) {
    localStorage.setItem(`pixiewebs_${key}`, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return fallback;
  }
};

const setLocal = (key: string, data: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`pixiewebs_${key}`, JSON.stringify(data));
};

export const dbService = {
  // Generic Fetch All
  async getAll(type: "clients" | "projects" | "invoices" | "payments" | "expenses" | "employees"): Promise<any[]> {
    const fallbackMap = {
      clients: initialClients,
      projects: initialProjects,
      invoices: initialInvoices,
      payments: initialPayments,
      expenses: initialExpenses,
      employees: initialEmployees
    };
    const fallback = fallbackMap[type];

    // 1. Prioritize Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from(type).select("*");
        if (error) throw error;
        
        if (!data || data.length === 0) {
          // Auto-seed Supabase database table with initial mock data
          const { error: seedError } = await supabase.from(type).insert(fallback);
          if (seedError) console.warn(`Supabase seeding failed for ${type}:`, seedError);
          return fallback;
        }
        return data;
      } catch (err) {
        console.warn(`Supabase getAll failed for ${type}, checking fallbacks:`, err);
      }
    }

    // 2. Ultimate Fallback to localStorage
    return getLocal(type, fallback);
  },

  // Add Item
  async add(type: "clients" | "projects" | "invoices" | "payments" | "expenses" | "employees", item: any): Promise<any> {
    // 1. Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from(type).insert([item]);
        if (!error) return item;
        console.warn("Supabase add failed:", error);
      } catch (err) {
        console.warn("Supabase add error:", err);
      }
    }
    
    // 2. LocalStorage
    const current = getLocal(type, []);
    const updated = [item, ...current];
    setLocal(type, updated);
    return item;
  },

  // Update Item
  async update(type: "clients" | "projects" | "invoices" | "payments" | "expenses" | "employees", id: string, updates: any): Promise<any> {
    // 1. Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from(type).update(updates).eq("id", id);
        if (!error) return { id, ...updates };
        console.warn("Supabase update failed:", error);
      } catch (err) {
        console.warn("Supabase update error:", err);
      }
    }

    // 2. LocalStorage
    const current = getLocal(type, []);
    const updated = current.map((item: any) => item.id === id ? { ...item, ...updates } : item);
    setLocal(type, updated);
    return { id, ...updates };
  },

  // Delete Item
  async delete(type: "clients" | "projects" | "invoices" | "payments" | "expenses" | "employees", id: string): Promise<void> {
    // 1. Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from(type).delete().eq("id", id);
        if (!error) return;
        console.warn("Supabase delete failed:", error);
      } catch (err) {
        console.warn("Supabase delete error:", err);
      }
    }

    // 2. LocalStorage
    const current = getLocal(type, []);
    const updated = current.filter((item: any) => item.id !== id);
    setLocal(type, updated);
  }
};
