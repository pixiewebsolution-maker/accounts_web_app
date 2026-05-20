"use client";

import Topbar from "@/components/layout/Topbar";
import { PageWrapper } from "@/components/ui";

export default function TodosPage() {
  return (
    <>
      <Topbar
        title="Supabase Todo Monitor"
        subtitle="Static Hostinger Build Mode"
        onMobileMenu={() => {}}
      />
      <PageWrapper>
        <div className="card p-6 max-w-2xl mx-auto space-y-6">
          <p className="text-sm text-slate-300">
            This page has been converted to static mode for Hostinger compatibility. Server-Side Rendering (SSR) is disabled in static exports.
          </p>
        </div>
      </PageWrapper>
    </>
  );
}
