"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/layout/Topbar";
import { PageWrapper } from "@/components/ui";
import { dbService } from "@/lib/db";
import type { Invoice } from "@/lib/data";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuotations = async () => {
      try {
        const invoicesData = await dbService.getAll("invoices");
        const quots = invoicesData.filter((i) => i.type === "quotation" || i.type === "proforma");
        setQuotations(quots);
      } catch (err) {
        console.error("Failed to load quotations:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuotations();
  }, []);

  return (
    <>
      <Topbar
        title="Quotations"
        subtitle={`${quotations.length} quotations`}
        onMobileMenu={() => {}}
        action={{ label: "New Quotation", onClick: () => {} }}
      />
      <PageWrapper>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
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
                    {q.type === "proforma" ? "Proforma" : "Quotation"}
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
            {quotations.length === 0 && (
              <div className="col-span-full card p-12 text-center text-slate-500">
                No quotations found in directory.
              </div>
            )}
          </div>
        )}
      </PageWrapper>
    </>
  );
}
