const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envPath = path.join(__dirname, ".env.local");
let supabaseUrl = "";
let supabaseKey = "";

try {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
      supabaseUrl = line.split("=")[1].trim();
    }
    if (line.startsWith("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=")) {
      supabaseKey = line.split("=")[1].trim();
    }
  }
} catch (err) {
  console.error("❌ Failed to read .env.local:", err.message);
  process.exit(1);
}

console.log("🔍 Checking Supabase Config...");
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey ? `${supabaseKey.substring(0, 15)}...` : "Missing");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL or Publishable Key is missing in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("\n🛰️ Testing connection to Supabase...");
  
  // Test Auth API
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error("❌ Auth API Error:", authError.message);
    } else {
      console.log("✅ Auth API Connection: Success");
    }
  } catch (err) {
    console.error("❌ Auth API Exception:", err.message);
  }

  // Test Database Tables
  const tables = ["clients", "projects", "employees", "invoices", "payments", "expenses"];
  console.log("\n📊 Testing Database Tables:");
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select("*").limit(1);
      if (error) {
        if (error.code === "42P01") {
          console.error(`❌ Table "${table}": DOES NOT EXIST (Need to create it!)`);
        } else {
          console.error(`❌ Table "${table}": Error (Code ${error.code}) - ${error.message}`);
        }
      } else {
        console.log(`✅ Table "${table}": Connected successfully (${data.length} rows found)`);
      }
    } catch (err) {
      console.error(`❌ Table "${table}": Exception - ${err.message}`);
    }
  }
}

testConnection();
