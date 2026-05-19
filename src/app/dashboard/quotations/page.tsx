"use client";

import Topbar from "@/components/layout/Topbar";
import { PageWrapper } from "@/components/ui";
import { invoices } from "@/lib/data";

export default function QuotationsPage() {
  const quotations = invoices.filter((i) => i.type === "quotation" || i.type === "proforma");

  return (
    <>
      <Topbar
        title="Quotations"
        subtitle={`${quotations.length} quotations`}
        onMobileMenu={() => {}}
        action={{ label: "New Quotation", onClick: () => {} }}
      />
      <PageWrapper>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotations.map((q) => (
            <div key={q.id} className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-semibold" style={{ color: "#6366f1" }}>{q.invoiceNumber}</span>
                <span
                  className="badge"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    color: "#8b5cf6",
                    borderColor: "rgba(139,92,246,0.2)",
                  }}
                >
                  Quotation
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">{q.clientName}</h3>
              <p className="text-xs mb-4" style={{ color: "#475569" }}>{q.clientEmail}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: "#475569" }}>Total Value</p>
                  <p className="text-lg font-bold text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(q.total)}</p>
                </div>
                <button className="btn btn-primary text-xs">Convert to Invoice</button>
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
