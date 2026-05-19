// ========================
// TYPES
// ========================

export type UserRole = "admin" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinedAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  social?: { instagram?: string; facebook?: string; linkedin?: string; twitter?: string };
  notes?: string;
  onboardedAt: string;
  status: "active" | "completed" | "on hold" | "pending" | "suspended";
  services: string[];
  assignedEmployees: string[];
  avatar?: string;
  requirements: Record<string, boolean>;
  // Ledger fields from the user image:
  businessType?: string;
  followUp?: string;
  latestUpdate?: string;
  projectCost?: number;
  paymentReceived?: number;
  paymentStatus?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  description: string;
  status: "active" | "completed" | "pending" | "on hold" | "in progress" | "hold" | "demo";
  progress: number;
  startDate: string;
  dueDate: string;
  completedAt?: string;
  budget: number;
  spent: number;
  assignedEmployees: string[];
  tasks: Task[];
  services: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "pending" | "in progress" | "completed";
  assignedTo: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  salary: number;
  joinedAt: string;
  status: "active" | "leave" | "suspended" | "deactivated" | "inactive";
  address?: string;
  avatar?: string;
  assignedProjects: string[];
  performance?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: "quotation" | "proforma" | "advance" | "final" | "maintenance";
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  projectId?: string;
  items: InvoiceItem[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  status: "draft" | "sent" | "paid" | "partially paid" | "overdue";
  issueDate: string;
  dueDate: string;
  paidAmount: number;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  method: "bank transfer" | "cash" | "upi" | "cheque" | "card";
  date: string;
  status: "completed" | "pending" | "failed";
  notes?: string;
}

export interface Expense {
  id: string;
  category: "hosting" | "domain" | "software" | "salary" | "marketing" | "office" | "ads" | "other";
  description: string;
  amount: number;
  date: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  receipt?: string;
  type: "client-specific" | "operational";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}

// ========================
// MOCK DATA
// ========================

export const currentUser: User = {
  id: "u1",
  name: "Syed Farhan PN",
  email: "syedfarhanpn@gmail.com",
  role: "admin",
  department: "Management",
  joinedAt: "2026-01-01",
};

export const employees: Employee[] = [
  {
    id: "e1",
    name: "Aryan Sharma",
    email: "aryan@agencyos.in",
    phone: "+91 98765 43210",
    role: "Frontend Developer",
    department: "Development",
    salary: 55000,
    joinedAt: "2026-02-15",
    status: "active",
    assignedProjects: ["p1", "p4", "p6"],
    performance: 92,
  },
  {
    id: "e2",
    name: "Priya Mehta",
    email: "priya@agencyos.in",
    phone: "+91 87654 32109",
    role: "UI/UX Designer",
    department: "Design",
    salary: 48000,
    joinedAt: "2026-03-01",
    status: "active",
    assignedProjects: ["p2", "p3", "p5"],
    performance: 88,
  },
  {
    id: "e3",
    name: "Rahul Verma",
    email: "rahul@agencyos.in",
    phone: "+91 76543 21098",
    role: "Digital Marketer",
    department: "Marketing",
    salary: 42000,
    joinedAt: "2026-04-10",
    status: "active",
    assignedProjects: ["p2", "p6", "p7"],
    performance: 79,
  },
  {
    id: "e4",
    name: "Sneha Kapoor",
    email: "sneha@agencyos.in",
    phone: "+91 65432 10987",
    role: "SEO Specialist",
    department: "Marketing",
    salary: 38000,
    joinedAt: "2026-05-20",
    status: "active",
    assignedProjects: ["p4", "p7"],
    performance: 85,
  },
  {
    id: "e5",
    name: "Karan Patel",
    email: "karan@agencyos.in",
    phone: "+91 54321 09876",
    role: "Backend Developer",
    department: "Development",
    salary: 60000,
    joinedAt: "2026-01-20",
    status: "active",
    assignedProjects: ["p1", "p5"],
    performance: 94,
  },
];

export const clients: Client[] = [
  {
    id: "c1",
    name: "Abijith Krishna",
    company: "ROGUE NINJA",
    email: "abijith@rogueninja.in",
    phone: "90485 84432",
    address: "Thiruvananthapuram",
    onboardedAt: "2026-04-15",
    status: "completed",
    services: ["Website Development"],
    assignedEmployees: ["e1", "e5"],
    requirements: {
      domain: true, hosting: true, ssl: true, businessEmail: true,
      paymentGateway: false, whatsappIntegration: true, logoDesign: true,
      uiuxDesign: true, contentWriting: true, socialMediaSetup: false,
      metaPixelSetup: true, googleAnalytics: true, maintenancePackage: true,
    },
    notes: "Site pushed to hosting and linked with domain. Site has been given.",
    businessType: "Travel",
    followUp: "Site pushed to hosting and linked with domain",
    latestUpdate: "site has been given",
    projectCost: 4000,
    paymentReceived: 4000,
    paymentStatus: "Completed",
  },
  {
    id: "c2",
    name: "Prem",
    company: "TRISHIKA SALON",
    email: "prem@trishikasalon.in",
    phone: "77368 94303",
    address: "Kochi",
    onboardedAt: "2026-04-15",
    status: "completed",
    services: ["Website Development"],
    assignedEmployees: ["e2", "e3"],
    requirements: {
      domain: true, hosting: true, ssl: true, businessEmail: true,
      paymentGateway: true, whatsappIntegration: false, logoDesign: true,
      uiuxDesign: true, contentWriting: true, socialMediaSetup: true,
      metaPixelSetup: true, googleAnalytics: true, maintenancePackage: false,
    },
    notes: "Vercel Demo done. Contractor Payout to Sandra made on 10/05/26.",
    businessType: "Salon",
    followUp: "Vercel Demo done",
    latestUpdate: "Working",
    projectCost: 4500,
    paymentReceived: 4500,
    paymentStatus: "Completed",
  },
  {
    id: "c3",
    name: "Ajmal Ali",
    company: "KERALA MIST",
    email: "ajmal@keralamist.in",
    phone: "95620 06212",
    address: "Thodupuzha",
    onboardedAt: "2026-04-30",
    status: "completed",
    services: ["Website Development"],
    assignedEmployees: ["e1", "e2"],
    requirements: {
      domain: true, hosting: true, ssl: true, businessEmail: true,
      paymentGateway: false, whatsappIntegration: false, logoDesign: false,
      uiuxDesign: true, contentWriting: true, socialMediaSetup: false,
      metaPixelSetup: false, googleAnalytics: false, maintenancePackage: true,
    },
    notes: "Vercel Demo done. Buy Domain and connect hosting.",
    businessType: "Travel",
    followUp: "Vercel Demo done",
    latestUpdate: "Buy Domain And connect hosting",
    projectCost: 4500,
    paymentReceived: 4500,
    paymentStatus: "Completed",
  },
  {
    id: "c4",
    name: "Aneesh Mangalath",
    company: "ONDEZYN",
    email: "aneesh@ondezyn.in",
    phone: "94954 68045",
    address: "Trivandram",
    onboardedAt: "2026-05-09",
    status: "completed",
    services: ["Website Development"],
    assignedEmployees: ["e1", "e3"],
    requirements: {
      domain: true, hosting: true, ssl: true, businessEmail: true,
      paymentGateway: true, whatsappIntegration: true, logoDesign: true,
      uiuxDesign: true, contentWriting: true, socialMediaSetup: true,
      metaPixelSetup: true, googleAnalytics: true, maintenancePackage: true,
    },
    notes: "Advance done, Work start. All done.",
    businessType: "Boutique",
    followUp: "Advance done, Work start",
    latestUpdate: "All done",
    projectCost: 4500,
    paymentReceived: 4500,
    paymentStatus: "Completed",
  },
  {
    id: "c5",
    name: "Sajad",
    company: "Sezo Cabs",
    email: "sajad@sezocabs.in",
    phone: "90748 30913",
    address: "Kochi",
    onboardedAt: "2026-05-08",
    status: "active",
    services: ["Website Development"],
    assignedEmployees: ["e2", "e5"],
    requirements: {
      domain: true, hosting: true, ssl: true, businessEmail: true,
      paymentGateway: true, whatsappIntegration: true, logoDesign: true,
      uiuxDesign: true, contentWriting: true, socialMediaSetup: true,
      metaPixelSetup: true, googleAnalytics: true, maintenancePackage: true,
    },
    notes: "Vercel Demo done. Demo delivered, Requirements Pending // will call mid of may",
    businessType: "Travel",
    followUp: "Vercel Demo done",
    latestUpdate: "Demo delivered, Requirements Pending // will call mid of may",
    projectCost: 8000,
    paymentReceived: 3000,
    paymentStatus: "Advance",
  },
  {
    id: "c6",
    name: "—",
    company: "Sri sai construction company",
    email: "contact@srisai.in",
    phone: "—",
    address: "Kochi",
    onboardedAt: "2026-05-13",
    status: "active",
    services: ["Website Development"],
    assignedEmployees: ["e3", "e4"],
    requirements: {
      domain: true, hosting: true, ssl: true, businessEmail: true,
      paymentGateway: false, whatsappIntegration: false, logoDesign: false,
      uiuxDesign: false, contentWriting: true, socialMediaSetup: false,
      metaPixelSetup: false, googleAnalytics: false, maintenancePackage: false,
    },
    notes: "Work ongoing.",
    businessType: "Construction",
    followUp: "—",
    latestUpdate: "Work ongoing",
    projectCost: 17500,
    paymentReceived: 4000,
    paymentStatus: "Advance",
  }
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "Rogue Ninja Website",
    clientId: "c1",
    clientName: "Rogue Ninja",
    description: "Immersive travel and gaming portal for Rogue Ninja.",
    status: "completed",
    progress: 100,
    startDate: "2026-04-15",
    dueDate: "2026-05-15",
    completedAt: "2026-05-15",
    budget: 4000,
    spent: 116,
    assignedEmployees: ["e1", "e5"],
    services: ["Website Development"],
    tasks: [
      { id: "t1", projectId: "p1", title: "Site pushed to hosting & linked domain", status: "completed", assignedTo: "e1", dueDate: "2026-05-01", priority: "high" },
      { id: "t2", projectId: "p1", title: "Handover and demo completed", status: "completed", assignedTo: "e5", dueDate: "2026-05-15", priority: "high" },
    ],
  },
  {
    id: "p2",
    name: "Trishika E-commerce Platform",
    clientId: "c2",
    clientName: "Trishika Salon",
    description: "Web development for Trishika Salon.",
    status: "completed",
    progress: 100,
    startDate: "2026-04-15",
    dueDate: "2026-05-10",
    completedAt: "2026-05-10",
    budget: 4500,
    spent: 524,
    assignedEmployees: ["e2", "e3"],
    services: ["Website Development"],
    tasks: [
      { id: "t3", projectId: "p2", title: "Vercel Demo and Setup", status: "completed", assignedTo: "e3", dueDate: "2026-05-05", priority: "medium" },
      { id: "t4", projectId: "p2", title: "Contractor Payout Sandra", status: "completed", assignedTo: "e2", dueDate: "2026-05-10", priority: "high" },
    ],
  },
  {
    id: "p3",
    name: "KERALA MIST Corporate Web",
    clientId: "c3",
    clientName: "KERALA MIST",
    description: "Stunning travel & resort website for Kerala Mist.",
    status: "completed",
    progress: 100,
    startDate: "2026-04-30",
    dueDate: "2026-05-05",
    completedAt: "2026-05-05",
    budget: 4500,
    spent: 0,
    assignedEmployees: ["e1", "e2"],
    services: ["Website Development"],
    tasks: [
      { id: "t5", projectId: "p3", title: "Design & Launch", status: "completed", assignedTo: "e1", dueDate: "2026-05-05", priority: "high" },
    ],
  },
  {
    id: "p4",
    name: "Ondezyn Studios Portfolio",
    clientId: "c4",
    clientName: "Ondezyn",
    description: "Creative design studio boutique portfolio website.",
    status: "completed",
    progress: 100,
    startDate: "2026-05-09",
    dueDate: "2026-05-25",
    completedAt: "2026-05-25",
    budget: 4500,
    spent: 0,
    assignedEmployees: ["e1", "e3"],
    services: ["Website Development"],
    tasks: [
      { id: "t8", projectId: "p4", title: "All done and deployed", status: "completed", assignedTo: "e1", dueDate: "2026-05-25", priority: "high" },
    ],
  },
  {
    id: "p5",
    name: "Sezo Cabs Interface",
    clientId: "c5",
    clientName: "Sezo Cabs",
    description: "Web landing page for booking premium cab services in Kochi.",
    status: "active",
    progress: 60,
    startDate: "2026-05-08",
    dueDate: "2026-06-15",
    budget: 8000,
    spent: 0,
    assignedEmployees: ["e2", "e5"],
    services: ["Website Development"],
    tasks: [
      { id: "t7", projectId: "p5", title: "UI Mockups & Vercel Demo", status: "completed", assignedTo: "e2", dueDate: "2026-05-15", priority: "medium" },
      { id: "t9", projectId: "p5", title: "Final Deliverable Adjustments", status: "in progress", assignedTo: "e5", dueDate: "2026-06-10", priority: "high" },
    ],
  },
  {
    id: "p6",
    name: "Sri Sai Web Portal",
    clientId: "c6",
    clientName: "Sri sai construction company",
    description: "Modern construction company web catalog and profile.",
    status: "active",
    progress: 40,
    startDate: "2026-05-13",
    dueDate: "2026-07-10",
    budget: 17500,
    spent: 0,
    assignedEmployees: ["e3", "e4"],
    services: ["Website Development"],
    tasks: [
      { id: "t10", projectId: "p6", title: "Catalogue Integration", status: "in progress", assignedTo: "e3", dueDate: "2026-06-15", priority: "medium" },
    ],
  }
];

export const invoices: Invoice[] = [
  {
    id: "inv1",
    invoiceNumber: "INV-202604-001",
    type: "final",
    clientId: "c1",
    clientName: "Rogue Ninja",
    clientEmail: "abijith@rogueninja.in",
    clientAddress: "Thiruvananthapuram",
    projectId: "p1",
    items: [
      { description: "Travel Portal Development", quantity: 1, rate: 4000, amount: 4000 },
    ],
    subtotal: 4000,
    gstRate: 0,
    gstAmount: 0,
    total: 4000,
    status: "paid",
    issueDate: "2026-04-15",
    dueDate: "2026-04-30",
    paidAmount: 4000,
  },
  {
    id: "inv2",
    invoiceNumber: "INV-202604-002",
    type: "final",
    clientId: "c2",
    clientName: "Trishika Salon",
    clientEmail: "prem@trishikasalon.in",
    clientAddress: "Kochi",
    projectId: "p2",
    items: [
      { description: "Skincare E-commerce Web Setup", quantity: 1, rate: 4500, amount: 4500 },
    ],
    subtotal: 4500,
    gstRate: 0,
    gstAmount: 0,
    total: 4500,
    status: "paid",
    issueDate: "2026-04-15",
    dueDate: "2026-04-30",
    paidAmount: 4500,
  },
  {
    id: "inv3",
    invoiceNumber: "INV-202604-003",
    type: "final",
    clientId: "c3",
    clientName: "KERALA MIST",
    clientEmail: "ajmal@keralamist.in",
    clientAddress: "Thodupuzha",
    projectId: "p3",
    items: [
      { description: "Corporate Website Launch", quantity: 1, rate: 4500, amount: 4500 },
    ],
    subtotal: 4500,
    gstRate: 0,
    gstAmount: 0,
    total: 4500,
    status: "paid",
    issueDate: "2026-04-30",
    dueDate: "2026-04-30",
    paidAmount: 4500,
  },
  {
    id: "inv4",
    invoiceNumber: "INV-202605-001",
    type: "final",
    clientId: "c4",
    clientName: "Ondezyn",
    clientEmail: "aneesh@ondezyn.in",
    clientAddress: "Trivandram",
    projectId: "p4",
    items: [
      { description: "Boutique Studio Web Design", quantity: 1, rate: 4500, amount: 4500 },
    ],
    subtotal: 4500,
    gstRate: 0,
    gstAmount: 0,
    total: 4500,
    status: "paid",
    issueDate: "2026-05-09",
    dueDate: "2026-05-25",
    paidAmount: 4500,
  },
  {
    id: "inv5",
    invoiceNumber: "INV-202605-002",
    type: "advance",
    clientId: "c5",
    clientName: "Sezo Cabs",
    clientEmail: "sajad@sezocabs.in",
    clientAddress: "Kochi",
    projectId: "p5",
    items: [
      { description: "Cab Booking Web (Advance)", quantity: 1, rate: 3000, amount: 3000 },
    ],
    subtotal: 3000,
    gstRate: 0,
    gstAmount: 0,
    total: 3000,
    status: "paid",
    issueDate: "2026-05-08",
    dueDate: "2026-05-20",
    paidAmount: 3000,
  },
  {
    id: "inv6",
    invoiceNumber: "INV-202605-003",
    type: "final",
    clientId: "c5",
    clientName: "Sezo Cabs",
    clientEmail: "sajad@sezocabs.in",
    clientAddress: "Kochi",
    projectId: "p5",
    items: [
      { description: "Cab Booking Web (Balance)", quantity: 1, rate: 5000, amount: 5000 },
    ],
    subtotal: 5000,
    gstRate: 0,
    gstAmount: 0,
    total: 5000,
    status: "sent",
    issueDate: "2026-05-20",
    dueDate: "2026-06-15",
    paidAmount: 0,
  },
  {
    id: "inv7",
    invoiceNumber: "INV-202605-004",
    type: "advance",
    clientId: "c6",
    clientName: "Sri sai construction company",
    clientEmail: "contact@srisai.in",
    clientAddress: "Kochi",
    projectId: "p6",
    items: [
      { description: "Construction Portal (Advance)", quantity: 1, rate: 4000, amount: 4000 },
    ],
    subtotal: 4000,
    gstRate: 0,
    gstAmount: 0,
    total: 4000,
    status: "paid",
    issueDate: "2026-05-13",
    dueDate: "2026-05-30",
    paidAmount: 4000,
  },
  {
    id: "inv8",
    invoiceNumber: "INV-202605-005",
    type: "final",
    clientId: "c6",
    clientName: "Sri sai construction company",
    clientEmail: "contact@srisai.in",
    clientAddress: "Kochi",
    projectId: "p6",
    items: [
      { description: "Construction Portal (Balance)", quantity: 1, rate: 13500, amount: 13500 },
    ],
    subtotal: 13500,
    gstRate: 0,
    gstAmount: 0,
    total: 13500,
    status: "sent",
    issueDate: "2026-05-20",
    dueDate: "2026-06-30",
    paidAmount: 0,
  }
];

export const payments: Payment[] = [
  { id: "pay1", invoiceId: "inv1", invoiceNumber: "INV-202604-001", clientName: "Rogue Ninja", amount: 4000, method: "upi", date: "2026-04-15", status: "completed" },
  { id: "pay2", invoiceId: "inv2", invoiceNumber: "INV-202604-002", clientName: "Trishika Salon", amount: 4500, method: "upi", date: "2026-04-15", status: "completed" },
  { id: "pay3", invoiceId: "inv3", invoiceNumber: "INV-202604-003", clientName: "KERALA MIST", amount: 4500, method: "bank transfer", date: "2026-04-30", status: "completed" },
  { id: "pay4", invoiceId: "inv4", invoiceNumber: "INV-202605-001", clientName: "Ondezyn", amount: 4500, method: "bank transfer", date: "2026-05-09", status: "completed" },
  { id: "pay5", invoiceId: "inv5", invoiceNumber: "INV-202605-002", clientName: "Sezo Cabs", amount: 3000, method: "upi", date: "2026-05-08", status: "completed" },
  { id: "pay6", invoiceId: "inv7", invoiceNumber: "INV-202605-004", clientName: "Sri sai construction company", amount: 4000, method: "bank transfer", date: "2026-05-13", status: "completed" },
];

export const expenses: Expense[] = [
  { id: "exp1", category: "domain", description: "Domain Registration - Rogue Ninja", amount: 116, date: "2026-04-15", clientId: "c1", clientName: "Rogue Ninja", projectId: "p1", type: "client-specific" },
  { id: "exp2", category: "domain", description: "Domain Purchase - Trishika Salon", amount: 274, date: "2026-04-15", clientId: "c2", clientName: "Trishika Salon", projectId: "p2", type: "client-specific" },
  { id: "exp3", category: "salary", description: "Contractor Payout - Sandra (Trishika support)", amount: 250, date: "2026-05-10", clientId: "c2", clientName: "Trishika Salon", projectId: "p2", type: "client-specific" },
  { id: "exp4", category: "ads", description: "Facebook Ads wallet refill", amount: 4000, date: "2026-05-08", type: "operational" },
  { id: "exp5", category: "ads", description: "Facebook Ads manager account setup", amount: 3000, date: "2026-05-08", type: "operational" },
  { id: "exp6", category: "other", description: "Meta Ads course premium learning", amount: 899, date: "2026-05-15", type: "operational" },
];

export const notifications: Notification[] = [
  { id: "n1", title: "Rogue Ninja Fully Paid", message: "Received final payment of ₹4,000 from Rogue Ninja.", type: "success", read: false, createdAt: "2026-04-15T12:00:00Z" },
  { id: "n2", title: "Course Expense Logged", message: "Logged ₹899 expense for Meta Ads Course purchase.", type: "info", read: false, createdAt: "2026-05-15T15:30:00Z" },
  { id: "n3", title: "Contract Payout Completed", message: "Paid ₹250 to Sandra for Trishika Salon assistance.", type: "warning", read: true, createdAt: "2026-05-10T10:00:00Z" },
  { id: "n4", title: "New Advance Received", message: "Sri Sai Construction Company paid ₹4,000 advance.", type: "success", read: false, createdAt: "2026-05-13T09:00:00Z" }
];

// ========================
// ANALYTICS DATA
// ========================

export const monthlyRevenue = [
  { month: "Jan", revenue: 0, expenses: 0, profit: 0 },
  { month: "Feb", revenue: 0, expenses: 0, profit: 0 },
  { month: "Mar", revenue: 0, expenses: 0, profit: 0 },
  { month: "Apr", revenue: 13000, expenses: 390, profit: 12610 },
  { month: "May", revenue: 30000, expenses: 8149, profit: 21851 },
];

export const serviceRevenue = [
  { service: "Website Dev", revenue: 41000, color: "#6366f1" },
  { service: "Domain & Setup", revenue: 2000, color: "#8b5cf6" },
];

export const clientAcquisition = [
  { month: "Jan", clients: 0 },
  { month: "Feb", clients: 0 },
  { month: "Mar", clients: 0 },
  { month: "Apr", clients: 3 },
  { month: "May", clients: 3 },
];

// ========================
// SUMMARY STATS
// ========================

export const dashboardStats = {
  totalRevenue: 43000, // Total project values
  monthlyRevenue: 24500, // Total payments received (liquid cash)
  pendingPayments: 18500, // Outstanding balance
  advanceReceived: 7000, // Advance sums of Active projects (Sezo 3k + Sri Sai 4k)
  totalExpenses: 8539,
  profit: 34461, // Net contracted profit (total contract revenue - total expenses)
  activeProjects: 2,
  completedProjects: 4,
  totalClients: 6,
  newClientsThisMonth: 3,
};

