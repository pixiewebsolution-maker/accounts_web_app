import { supabase, isSupabaseConfigured } from "./supabase";

type DbTable =
  | "clients"
  | "projects"
  | "invoices"
  | "payments"
  | "expenses"
  | "employees";

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
    );
  }
  return supabase;
}

export const dbService = {
  // Fetch all records from a table
  async getAll(type: DbTable): Promise<any[]> {
    const db = requireSupabase();
    const { data, error } = await db.from(type).select("*").order("id", { ascending: true });
    if (error) {
      console.error(`[dbService] getAll("${type}") failed:`, error.message);
      throw error;
    }
    return data ?? [];
  },

  // Fetch a single record by id
  async getById(type: DbTable, id: string): Promise<any | null> {
    const db = requireSupabase();
    const { data, error } = await db.from(type).select("*").eq("id", id).single();
    if (error) {
      console.error(`[dbService] getById("${type}", "${id}") failed:`, error.message);
      throw error;
    }
    return data;
  },

  // Insert a new record
  async add(type: DbTable, item: any): Promise<any> {
    const db = requireSupabase();
    const { data, error } = await db.from(type).insert([item]).select().single();
    if (error) {
      console.error(`[dbService] add("${type}") failed:`, error.message);
      throw error;
    }
    return data ?? item;
  },

  // Update an existing record by id
  async update(type: DbTable, id: string, updates: any): Promise<any> {
    const db = requireSupabase();
    const { data, error } = await db
      .from(type)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error(`[dbService] update("${type}", "${id}") failed:`, error.message);
      throw error;
    }
    return data ?? { id, ...updates };
  },

  // Delete a record by id
  async delete(type: DbTable, id: string): Promise<void> {
    const db = requireSupabase();
    const { error } = await db.from(type).delete().eq("id", id);
    if (error) {
      console.error(`[dbService] delete("${type}", "${id}") failed:`, error.message);
      throw error;
    }
  },

  // Upsert (insert or update) a record
  async upsert(type: DbTable, item: any): Promise<any> {
    const db = requireSupabase();
    const { data, error } = await db.from(type).upsert([item]).select().single();
    if (error) {
      console.error(`[dbService] upsert("${type}") failed:`, error.message);
      throw error;
    }
    return data ?? item;
  },
};
