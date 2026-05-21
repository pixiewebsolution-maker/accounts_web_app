-- ============================================================
-- AgencyOS — Supabase SQL Migration
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- EMPLOYEES
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  salary NUMERIC DEFAULT 0,
  joined_at DATE,
  status TEXT DEFAULT 'active',
  address TEXT,
  avatar TEXT,
  assigned_projects JSONB DEFAULT '[]',
  performance NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  website TEXT,
  social JSONB DEFAULT '{}',
  notes TEXT,
  onboarded_at DATE,
  status TEXT DEFAULT 'active',
  services JSONB DEFAULT '[]',
  assigned_employees JSONB DEFAULT '[]',
  avatar TEXT,
  requirements JSONB DEFAULT '{}',
  business_type TEXT,
  follow_up TEXT,
  latest_update TEXT,
  project_cost NUMERIC DEFAULT 0,
  payment_received NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client_id TEXT,
  client_name TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  progress NUMERIC DEFAULT 0,
  start_date DATE,
  due_date DATE,
  completed_at DATE,
  budget NUMERIC DEFAULT 0,
  spent NUMERIC DEFAULT 0,
  assigned_employees JSONB DEFAULT '[]',
  tasks JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  type TEXT DEFAULT 'final',
  client_id TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_address TEXT,
  project_id TEXT,
  items JSONB DEFAULT '[]',
  subtotal NUMERIC DEFAULT 0,
  gst_rate NUMERIC DEFAULT 0,
  gst_amount NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft',
  issue_date DATE,
  due_date DATE,
  paid_amount NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  invoice_id TEXT,
  invoice_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  method TEXT DEFAULT 'upi',
  date DATE,
  status TEXT DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXPENSES
-- ============================================================
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  date DATE,
  client_id TEXT,
  client_name TEXT,
  project_id TEXT,
  receipt TEXT,
  type TEXT DEFAULT 'operational',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) — Enable and add policies
-- ============================================================

-- For a private admin SaaS, you can restrict to authenticated users only.
-- Enable RLS on all tables:
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (adjust as needed):
CREATE POLICY "Allow authenticated full access" ON employees FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);
