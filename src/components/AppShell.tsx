import Link from "next/link";
import { ReactNode } from "react";
import { FileText, LayoutDashboard, ReceiptText } from "lucide-react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/create" className="flex items-center gap-3">
            <div className="rounded-2xl bg-zinc-950 p-3 text-white">
              <ReceiptText size={22} />
            </div>

            <div>
              <p className="text-xl font-black tracking-tight">
                VoiceReceipt
              </p>
              <p className="text-sm font-medium text-zinc-500">
                Receipts, debts, and cash records
              </p>
            </div>
          </Link>

          <nav className="flex gap-2 overflow-x-auto">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white"
            >
              <ReceiptText size={17} />
              Create
            </Link>

            <Link
              href="/receipts"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold text-zinc-800 hover:bg-zinc-50"
            >
              <FileText size={17} />
              Receipts
            </Link>

            <Link
              href="/customers"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold text-zinc-800 hover:bg-zinc-50"
            >
              <LayoutDashboard size={17} />
              Customers
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </main>
  );
}
