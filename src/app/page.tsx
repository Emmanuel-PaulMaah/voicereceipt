import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Download,
  FileText,
  MessageCircle,
  Mic,
  ReceiptText,
  Users,
  WalletCards,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-zinc-950 p-3 text-white">
              <ReceiptText size={22} />
            </div>

            <div>
              <p className="text-xl font-black tracking-tight">
                VoiceReceipt
              </p>
              <p className="hidden text-sm font-medium text-zinc-500 sm:block">
                Voice-first business records
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold text-zinc-800 hover:bg-zinc-50 sm:inline-flex"
            >
              Dashboard
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-black text-white hover:bg-zinc-800"
            >
              Create receipt
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_460px] lg:items-center lg:py-20">
        <div>
          <div className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700">
            Built for small businesses that sell online
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-zinc-950 sm:text-7xl">
            Turn voice into receipts, debts, and business records.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            VoiceReceipt helps small businesses create receipts, track customer
            debt, record part payments, send WhatsApp reminders, manage
            expenses, remember products, and export records.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-6 py-4 text-sm font-black text-white hover:bg-zinc-800"
            >
              Start creating receipts
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-6 py-4 text-sm font-bold text-zinc-800 hover:bg-zinc-50"
            >
              View dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="rounded-3xl bg-zinc-950 p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
              Today
            </p>

            <h2 className="mt-2 text-3xl font-black">₦42,000 collected</h2>

            <div className="mt-6 space-y-3">
              <DemoRow label="Sales" value="₦58,000" />
              <DemoRow label="Expenses" value="₦8,500" />
              <DemoRow label="Outstanding" value="₦16,000" />
              <DemoRow label="Receipts" value="7" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniCard icon={<Mic size={20} />} label="Voice receipts" />
            <MiniCard icon={<Users size={20} />} label="Customer debts" />
            <MiniCard icon={<MessageCircle size={20} />} label="WhatsApp reminders" />
            <MiniCard icon={<Download size={20} />} label="CSV exports" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Mic size={22} />}
            title="Voice receipts"
            description="Ask simple questions and generate clean receipts from spoken answers."
          />

          <FeatureCard
            icon={<Users size={22} />}
            title="Customer ledger"
            description="Track who bought, who paid, who still owes, and every part payment."
          />

          <FeatureCard
            icon={<WalletCards size={22} />}
            title="Expenses"
            description="Record stock purchases, transport, rent, packaging, and business costs."
          />

          <FeatureCard
            icon={<FileText size={22} />}
            title="Export records"
            description="Download receipts, customers, payments, products, and expenses as CSV."
          />
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black text-zinc-950">VoiceReceipt</p>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              A local-first business management tool for small sellers.
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-4 text-sm font-black text-white hover:bg-zinc-800"
          >
            Create receipt
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function DemoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
      <span className="text-sm font-bold text-zinc-300">{label}</span>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  );
}

function MiniCard({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="rounded-xl bg-white p-2 text-zinc-800">{icon}</div>
      <p className="mt-3 text-sm font-black text-zinc-950">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="inline-flex rounded-2xl bg-zinc-950 p-3 text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}
