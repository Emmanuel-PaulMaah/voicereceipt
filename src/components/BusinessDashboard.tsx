"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  FileText,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { formatNaira, Receipt } from "@/lib/receipt";
import {
  buildBusinessSummary,
  buildCustomerDebts,
  BusinessExpense,
  CustomerPayment,
  getStoredExpenses,
  getStoredPayments,
  getStoredReceipts,
  getTodaysExpenses,
  getTodaysPayments,
  getTodaysReceipts,
} from "@/lib/storage";

export function BusinessDashboard() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [expenses, setExpenses] = useState<BusinessExpense[]>([]);

  useEffect(() => {
    setReceipts(getStoredReceipts());
    setPayments(getStoredPayments());
    setExpenses(getStoredExpenses());
  }, []);

  const todayReceipts = useMemo(() => {
    return getTodaysReceipts(receipts);
  }, [receipts]);

  const todayPayments = useMemo(() => {
    return getTodaysPayments(payments);
  }, [payments]);

  const todayExpenses = useMemo(() => {
    return getTodaysExpenses(expenses);
  }, [expenses]);

  const todaySummary = useMemo(() => {
    return buildBusinessSummary(todayReceipts, todayPayments, todayExpenses);
  }, [todayReceipts, todayPayments, todayExpenses]);

  const allTimeSummary = useMemo(() => {
    return buildBusinessSummary(receipts, payments, expenses);
  }, [receipts, payments, expenses]);

  const debts = useMemo(() => {
    return buildCustomerDebts(receipts, payments);
  }, [receipts, payments]);

  const todayCustomersOwing = useMemo(() => {
    return buildCustomerDebts(todayReceipts, todayPayments).filter(
      (customer) => customer.outstandingBalance > 0
    ).length;
  }, [todayReceipts, todayPayments]);

  const customersOwing = debts.filter(
    (customer) => customer.outstandingBalance > 0
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
          Business Dashboard
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
          Sales and cash position.
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          A cleaner view of today’s performance and all-time business records.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <SummaryCard
          title="Today"
          subtitle={new Date().toLocaleDateString("en-NG")}
          sales={todaySummary.totalSales}
          collected={todaySummary.totalCollected}
          expenses={todaySummary.totalExpenses}
          netCash={todaySummary.netCash}
          outstanding={todaySummary.totalOutstanding}
          receipts={todaySummary.receiptCount}
          customersOwing={todayCustomersOwing}
        />

        <SummaryCard
          title="All-time"
          subtitle="Since you started using VoiceReceipt"
          sales={allTimeSummary.totalSales}
          collected={allTimeSummary.totalCollected}
          expenses={allTimeSummary.totalExpenses}
          netCash={allTimeSummary.netCash}
          outstanding={allTimeSummary.totalOutstanding}
          receipts={allTimeSummary.receiptCount}
          customersOwing={customersOwing.length}
        />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Payment Status
          </p>

          <div className="mt-5 grid gap-3">
            <StatusRow
              label="Paid receipts"
              value={allTimeSummary.paidReceiptCount}
            />
            <StatusRow
              label="Part-paid receipts"
              value={allTimeSummary.partPaidReceiptCount}
            />
            <StatusRow
              label="Unpaid receipts"
              value={allTimeSummary.unpaidReceiptCount}
            />
            <StatusRow label="Extra payments" value={payments.length} />
            <StatusRow label="Expenses" value={expenses.length} />
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Top Customer
          </p>

          {allTimeSummary.topCustomerName ? (
            <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
              <p className="text-xl font-black text-zinc-950">
                {allTimeSummary.topCustomerName}
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-500">
                Total sales: {formatNaira(allTimeSummary.topCustomerAmount)}
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 p-5 text-center">
              <p className="text-sm font-bold text-zinc-500">
                No customer data yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  subtitle,
  sales,
  collected,
  expenses,
  netCash,
  outstanding,
  receipts,
  customersOwing,
}: {
  title: string;
  subtitle: string;
  sales: number;
  collected: number;
  expenses: number;
  netCash: number;
  outstanding: number;
  receipts: number;
  customersOwing: number;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
          {title}
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
          {formatNaira(netCash)} net cash
        </h2>
        <p className="mt-1 text-sm font-semibold text-zinc-500">{subtitle}</p>
      </div>

      <div className="mt-6 grid gap-3">
        <SummaryRow
          icon={<TrendingUp size={18} />}
          label="Sales"
          value={formatNaira(sales)}
        />

        <SummaryRow
          icon={<Banknote size={18} />}
          label="Cash collected"
          value={formatNaira(collected)}
        />

        <SummaryRow
          icon={<WalletCards size={18} />}
          label="Expenses"
          value={formatNaira(expenses)}
        />

        <SummaryRow
          icon={<Banknote size={18} />}
          label="Net cash"
          value={formatNaira(netCash)}
        />

        <SummaryRow
          icon={<WalletCards size={18} />}
          label="Outstanding"
          value={formatNaira(outstanding)}
        />

        <SummaryRow
          icon={<FileText size={18} />}
          label="Receipts"
          value={String(receipts)}
        />

        <SummaryRow
          icon={<Users size={18} />}
          label="Customers owing"
          value={String(customersOwing)}
        />
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white p-2 text-zinc-700">{icon}</div>
        <p className="text-sm font-bold text-zinc-600">{label}</p>
      </div>

      <p className="text-sm font-black text-zinc-950">{value}</p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
      <span className="text-sm font-bold text-zinc-600">{label}</span>
      <span className="text-sm font-black text-zinc-950">{value}</span>
    </div>
  );
}
