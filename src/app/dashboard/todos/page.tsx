import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Topbar from "@/components/layout/Topbar";
import { PageWrapper } from "@/components/ui";

export default async function TodosPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch todos dynamically on the server side
  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <>
      <Topbar
        title="Supabase Todo Monitor"
        subtitle="Server-side rendered (SSR) testing portal"
        onMobileMenu={() => {}}
      />
      <PageWrapper>
        <div className="card p-6 max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Server-Side Connection Verified!</h3>
            <p className="text-xs text-slate-400">This list is fetched directly from your Postgres database on the server using Supabase SSR.</p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              Error fetching: {error.message}
            </div>
          )}

          <ul className="divide-y divide-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01]">
            {todos && todos.length > 0 ? (
              todos.map((todo) => (
                <li key={todo.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-white">{todo.name || todo.title}</span>
                  </div>
                  <span className="text-[10px] text-indigo-300 font-mono">ID: {todo.id}</span>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-xs text-slate-500">
                No items found in your 'todos' table yet. Add some rows in your Supabase editor to see them pop up here in real time!
              </li>
            )}
          </ul>
        </div>
      </PageWrapper>
    </>
  );
}
