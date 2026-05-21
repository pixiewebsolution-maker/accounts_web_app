/**
 * Supabase Seed Script
 * Run once to populate all tables with the initial agency data.
 *
 * Usage:
 *   node seed-supabase.js
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * set in .env.local (or pass them as environment variables).
 */

require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================
// SEED DATA
// ============================================================

const employees = [
  { id: "e1", name: "Aryan Sharma", email: "aryan@agencyos.in", phone: "+91 98765 43210", role: "Frontend Developer", department: "Development", salary: 55000, joined_at: "2026-02-15", status: "active", assigned_projects: ["p1","p4","p6"], performance: 92 },
  { id: "e2", name: "Priya Mehta", email: "priya@agencyos.in", phone: "+91 87654 32109", role: "UI/UX Designer", department: "Design", salary: 48000, joined_at: "2026-03-01", status: "active", assigned_projects: ["p2","p3","p5"], performance: 88 },
  { id: "e3", name: "Rahul Verma", email: "rahul@agencyos.in", phone: "+91 76543 21098", role: "Digital Marketer", department: "Marketing", salary: 42000, joined_at: "2026-04-10", status: "active", assigned_projects: ["p2","p6","p7"], performance: 79 },
  { id: "e4", name: "Sneha Kapoor", email: "sneha@agencyos.in", phone: "+91 65432 10987", role: "SEO Specialist", department: "Marketing", salary: 38000, joined_at: "2026-05-20", status: "active", assigned_projects: ["p4","p7"], performance: 85 },
  { id: "e5", name: "Karan Patel", email: "karan@agencyos.in", phone: "+91 54321 09876", role: "Backend Developer", department: "Development", salary: 60000, joined_at: "2026-01-20", status: "active", assigned_projects: ["p1","p5"], performance: 94 },
];

const clients = [
  { id: "c1", name: "Abijith Krishna", company: "ROGUE NINJA", email: "abijith@rogueninja.in", phone: "90485 84432", address: "Thiruvananthapuram", onboarded_at: "2026-04-15", status: "completed", services: ["Website Development"], assigned_employees: ["e1","e5"], requirements: {domain:true,hosting:true,ssl:true,businessEmail:true,paymentGateway:false,whatsappIntegration:true,logoDesign:true,uiuxDesign:true,contentWriting:true,socialMediaSetup:false,metaPixelSetup:true,googleAnalytics:true,maintenancePackage:true}, notes: "Site pushed to hosting and linked with domain. Site has been given.", business_type: "Travel", follow_up: "Site pushed to hosting and linked with domain", latest_update: "site has been given", project_cost: 4000, payment_received: 4000, payment_status: "Completed" },
  { id: "c2", name: "Prem", company: "TRISHIKA SALON", email: "prem@trishikasalon.in", phone: "77368 94303", address: "Kochi", onboarded_at: "2026-04-15", status: "completed", services: ["Website Development"], assigned_employees: ["e2","e3"], requirements: {domain:true,hosting:true,ssl:true,businessEmail:true,paymentGateway:true,whatsappIntegration:false,logoDesign:true,uiuxDesign:true,contentWriting:true,socialMediaSetup:true,metaPixelSetup:true,googleAnalytics:true,maintenancePackage:false}, notes: "Vercel Demo done. Contractor Payout to Sandra made on 10/05/26.", business_type: "Salon", follow_up: "Vercel Demo done", latest_update: "Working", project_cost: 4500, payment_received: 4500, payment_status: "Completed" },
  { id: "c3", name: "Ajmal Ali", company: "KERALA MIST", email: "ajmal@keralamist.in", phone: "95620 06212", address: "Thodupuzha", onboarded_at: "2026-04-30", status: "completed", services: ["Website Development"], assigned_employees: ["e1","e2"], requirements: {domain:true,hosting:true,ssl:true,businessEmail:true,paymentGateway:false,whatsappIntegration:false,logoDesign:false,uiuxDesign:true,contentWriting:true,socialMediaSetup:false,metaPixelSetup:false,googleAnalytics:false,maintenancePackage:true}, notes: "Vercel Demo done. Buy Domain and connect hosting.", business_type: "Travel", follow_up: "Vercel Demo done", latest_update: "Buy Domain And connect hosting", project_cost: 4500, payment_received: 4500, payment_status: "Completed" },
  { id: "c4", name: "Aneesh Mangalath", company: "ONDEZYN", email: "aneesh@ondezyn.in", phone: "94954 68045", address: "Trivandram", onboarded_at: "2026-05-09", status: "completed", services: ["Website Development"], assigned_employees: ["e1","e3"], requirements: {domain:true,hosting:true,ssl:true,businessEmail:true,paymentGateway:true,whatsappIntegration:true,logoDesign:true,uiuxDesign:true,contentWriting:true,socialMediaSetup:true,metaPixelSetup:true,googleAnalytics:true,maintenancePackage:true}, notes: "Advance done, Work start. All done.", business_type: "Boutique", follow_up: "Advance done, Work start", latest_update: "All done", project_cost: 4500, payment_received: 4500, payment_status: "Completed" },
  { id: "c5", name: "Sajad", company: "Sezo Cabs", email: "sajad@sezocabs.in", phone: "90748 30913", address: "Kochi", onboarded_at: "2026-05-08", status: "active", services: ["Website Development"], assigned_employees: ["e2","e5"], requirements: {domain:true,hosting:true,ssl:true,businessEmail:true,paymentGateway:true,whatsappIntegration:true,logoDesign:true,uiuxDesign:true,contentWriting:true,socialMediaSetup:true,metaPixelSetup:true,googleAnalytics:true,maintenancePackage:true}, notes: "Vercel Demo done. Demo delivered, Requirements Pending // will call mid of may", business_type: "Travel", follow_up: "Vercel Demo done", latest_update: "Demo delivered, Requirements Pending // will call mid of may", project_cost: 8000, payment_received: 3000, payment_status: "Advance" },
  { id: "c6", name: "—", company: "Sri sai construction company", email: "contact@srisai.in", phone: "—", address: "Kochi", onboarded_at: "2026-05-13", status: "active", services: ["Website Development"], assigned_employees: ["e3","e4"], requirements: {domain:true,hosting:true,ssl:true,businessEmail:true,paymentGateway:false,whatsappIntegration:false,logoDesign:false,uiuxDesign:false,contentWriting:true,socialMediaSetup:false,metaPixelSetup:false,googleAnalytics:false,maintenancePackage:false}, notes: "Work ongoing.", business_type: "Construction", follow_up: "—", latest_update: "Work ongoing", project_cost: 17500, payment_received: 4000, payment_status: "Advance" },
];

const projects = [
  { id: "p1", name: "Rogue Ninja Website", client_id: "c1", client_name: "Rogue Ninja", description: "Immersive travel and gaming portal.", status: "completed", progress: 100, start_date: "2026-04-15", due_date: "2026-05-15", completed_at: "2026-05-15", budget: 4000, spent: 116, assigned_employees: ["e1","e5"], services: ["Website Development"], tasks: [{id:"t1",projectId:"p1",title:"Site pushed to hosting & linked domain",status:"completed",assignedTo:"e1",dueDate:"2026-05-01",priority:"high"},{id:"t2",projectId:"p1",title:"Handover and demo completed",status:"completed",assignedTo:"e5",dueDate:"2026-05-15",priority:"high"}] },
  { id: "p2", name: "Trishika E-commerce Platform", client_id: "c2", client_name: "Trishika Salon", description: "Web development for Trishika Salon.", status: "completed", progress: 100, start_date: "2026-04-15", due_date: "2026-05-10", completed_at: "2026-05-10", budget: 4500, spent: 524, assigned_employees: ["e2","e3"], services: ["Website Development"], tasks: [{id:"t3",projectId:"p2",title:"Vercel Demo and Setup",status:"completed",assignedTo:"e3",dueDate:"2026-05-05",priority:"medium"},{id:"t4",projectId:"p2",title:"Contractor Payout Sandra",status:"completed",assignedTo:"e2",dueDate:"2026-05-10",priority:"high"}] },
  { id: "p3", name: "KERALA MIST Corporate Web", client_id: "c3", client_name: "KERALA MIST", description: "Travel & resort website.", status: "completed", progress: 100, start_date: "2026-04-30", due_date: "2026-05-05", completed_at: "2026-05-05", budget: 4500, spent: 0, assigned_employees: ["e1","e2"], services: ["Website Development"], tasks: [{id:"t5",projectId:"p3",title:"Design & Launch",status:"completed",assignedTo:"e1",dueDate:"2026-05-05",priority:"high"}] },
  { id: "p4", name: "Ondezyn Studios Portfolio", client_id: "c4", client_name: "Ondezyn", description: "Creative design studio boutique portfolio.", status: "completed", progress: 100, start_date: "2026-05-09", due_date: "2026-05-25", completed_at: "2026-05-25", budget: 4500, spent: 0, assigned_employees: ["e1","e3"], services: ["Website Development"], tasks: [{id:"t8",projectId:"p4",title:"All done and deployed",status:"completed",assignedTo:"e1",dueDate:"2026-05-25",priority:"high"}] },
  { id: "p5", name: "Sezo Cabs Interface", client_id: "c5", client_name: "Sezo Cabs", description: "Web landing page for booking premium cab services.", status: "active", progress: 60, start_date: "2026-05-08", due_date: "2026-06-15", budget: 8000, spent: 0, assigned_employees: ["e2","e5"], services: ["Website Development"], tasks: [{id:"t7",projectId:"p5",title:"UI Mockups & Vercel Demo",status:"completed",assignedTo:"e2",dueDate:"2026-05-15",priority:"medium"},{id:"t9",projectId:"p5",title:"Final Deliverable Adjustments",status:"in progress",assignedTo:"e5",dueDate:"2026-06-10",priority:"high"}] },
  { id: "p6", name: "Sri Sai Web Portal", client_id: "c6", client_name: "Sri sai construction company", description: "Modern construction company web catalog.", status: "active", progress: 40, start_date: "2026-05-13", due_date: "2026-07-10", budget: 17500, spent: 0, assigned_employees: ["e3","e4"], services: ["Website Development"], tasks: [{id:"t10",projectId:"p6",title:"Catalogue Integration",status:"in progress",assignedTo:"e3",dueDate:"2026-06-15",priority:"medium"}] },
];

const invoices = [
  { id: "inv1", invoice_number: "INV-202604-001", type: "final", client_id: "c1", client_name: "Rogue Ninja", client_email: "abijith@rogueninja.in", client_address: "Thiruvananthapuram", project_id: "p1", items: [{description:"Travel Portal Development",quantity:1,rate:4000,amount:4000}], subtotal: 4000, gst_rate: 0, gst_amount: 0, total: 4000, status: "paid", issue_date: "2026-04-15", due_date: "2026-04-30", paid_amount: 4000 },
  { id: "inv2", invoice_number: "INV-202604-002", type: "final", client_id: "c2", client_name: "Trishika Salon", client_email: "prem@trishikasalon.in", client_address: "Kochi", project_id: "p2", items: [{description:"Skincare E-commerce Web Setup",quantity:1,rate:4500,amount:4500}], subtotal: 4500, gst_rate: 0, gst_amount: 0, total: 4500, status: "paid", issue_date: "2026-04-15", due_date: "2026-04-30", paid_amount: 4500 },
  { id: "inv3", invoice_number: "INV-202604-003", type: "final", client_id: "c3", client_name: "KERALA MIST", client_email: "ajmal@keralamist.in", client_address: "Thodupuzha", project_id: "p3", items: [{description:"Corporate Website Launch",quantity:1,rate:4500,amount:4500}], subtotal: 4500, gst_rate: 0, gst_amount: 0, total: 4500, status: "paid", issue_date: "2026-04-30", due_date: "2026-04-30", paid_amount: 4500 },
  { id: "inv4", invoice_number: "INV-202605-001", type: "final", client_id: "c4", client_name: "Ondezyn", client_email: "aneesh@ondezyn.in", client_address: "Trivandram", project_id: "p4", items: [{description:"Boutique Studio Web Design",quantity:1,rate:4500,amount:4500}], subtotal: 4500, gst_rate: 0, gst_amount: 0, total: 4500, status: "paid", issue_date: "2026-05-09", due_date: "2026-05-25", paid_amount: 4500 },
  { id: "inv5", invoice_number: "INV-202605-002", type: "advance", client_id: "c5", client_name: "Sezo Cabs", client_email: "sajad@sezocabs.in", client_address: "Kochi", project_id: "p5", items: [{description:"Cab Booking Web (Advance)",quantity:1,rate:3000,amount:3000}], subtotal: 3000, gst_rate: 0, gst_amount: 0, total: 3000, status: "paid", issue_date: "2026-05-08", due_date: "2026-05-20", paid_amount: 3000 },
  { id: "inv6", invoice_number: "INV-202605-003", type: "final", client_id: "c5", client_name: "Sezo Cabs", client_email: "sajad@sezocabs.in", client_address: "Kochi", project_id: "p5", items: [{description:"Cab Booking Web (Balance)",quantity:1,rate:5000,amount:5000}], subtotal: 5000, gst_rate: 0, gst_amount: 0, total: 5000, status: "sent", issue_date: "2026-05-20", due_date: "2026-06-15", paid_amount: 0 },
  { id: "inv7", invoice_number: "INV-202605-004", type: "advance", client_id: "c6", client_name: "Sri sai construction company", client_email: "contact@srisai.in", client_address: "Kochi", project_id: "p6", items: [{description:"Construction Portal (Advance)",quantity:1,rate:4000,amount:4000}], subtotal: 4000, gst_rate: 0, gst_amount: 0, total: 4000, status: "paid", issue_date: "2026-05-13", due_date: "2026-05-30", paid_amount: 4000 },
  { id: "inv8", invoice_number: "INV-202605-005", type: "final", client_id: "c6", client_name: "Sri sai construction company", client_email: "contact@srisai.in", client_address: "Kochi", project_id: "p6", items: [{description:"Construction Portal (Balance)",quantity:1,rate:13500,amount:13500}], subtotal: 13500, gst_rate: 0, gst_amount: 0, total: 13500, status: "sent", issue_date: "2026-05-20", due_date: "2026-06-30", paid_amount: 0 },
];

const payments = [
  { id: "pay1", invoice_id: "inv1", invoice_number: "INV-202604-001", client_name: "Rogue Ninja", amount: 4000, method: "upi", date: "2026-04-15", status: "completed" },
  { id: "pay2", invoice_id: "inv2", invoice_number: "INV-202604-002", client_name: "Trishika Salon", amount: 4500, method: "upi", date: "2026-04-15", status: "completed" },
  { id: "pay3", invoice_id: "inv3", invoice_number: "INV-202604-003", client_name: "KERALA MIST", amount: 4500, method: "bank transfer", date: "2026-04-30", status: "completed" },
  { id: "pay4", invoice_id: "inv4", invoice_number: "INV-202605-001", client_name: "Ondezyn", amount: 4500, method: "bank transfer", date: "2026-05-09", status: "completed" },
  { id: "pay5", invoice_id: "inv5", invoice_number: "INV-202605-002", client_name: "Sezo Cabs", amount: 3000, method: "upi", date: "2026-05-08", status: "completed" },
  { id: "pay6", invoice_id: "inv7", invoice_number: "INV-202605-004", client_name: "Sri sai construction company", amount: 4000, method: "bank transfer", date: "2026-05-13", status: "completed" },
];

const expenses = [
  { id: "exp1", category: "domain", description: "Domain Registration - Rogue Ninja", amount: 116, date: "2026-04-15", client_id: "c1", client_name: "Rogue Ninja", project_id: "p1", type: "client-specific" },
  { id: "exp2", category: "domain", description: "Domain Purchase - Trishika Salon", amount: 274, date: "2026-04-15", client_id: "c2", client_name: "Trishika Salon", project_id: "p2", type: "client-specific" },
  { id: "exp3", category: "salary", description: "Contractor Payout - Sandra (Trishika support)", amount: 250, date: "2026-05-10", client_id: "c2", client_name: "Trishika Salon", project_id: "p2", type: "client-specific" },
  { id: "exp4", category: "ads", description: "Facebook Ads wallet refill", amount: 4000, date: "2026-05-08", type: "operational" },
  { id: "exp5", category: "ads", description: "Facebook Ads manager account setup", amount: 3000, date: "2026-05-08", type: "operational" },
  { id: "exp6", category: "other", description: "Meta Ads course premium learning", amount: 899, date: "2026-05-15", type: "operational" },
];

// ============================================================
// SEED RUNNER
// ============================================================

async function seed(table, rows) {
  console.log(`\n📦  Seeding "${table}" (${rows.length} rows)...`);
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) {
    console.error(`  ❌  Failed to seed "${table}":`, error.message);
  } else {
    console.log(`  ✅  "${table}" seeded successfully.`);
  }
}

async function main() {
  console.log("🚀  AgencyOS — Supabase Seed Script");
  console.log("=====================================");
  console.log(`  URL: ${supabaseUrl}`);

  await seed("employees", employees);
  await seed("clients", clients);
  await seed("projects", projects);
  await seed("invoices", invoices);
  await seed("payments", payments);
  await seed("expenses", expenses);

  console.log("\n✅  All tables seeded. Your Supabase database is ready!");
  console.log("\n⚠️  NOTE: Make sure your Supabase tables match the column names used here.");
  console.log("    See README or the SQL migration in your Supabase dashboard.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
