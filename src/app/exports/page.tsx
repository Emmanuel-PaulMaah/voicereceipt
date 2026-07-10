"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  exportCustomersCsv,
  exportExpensesCsv,
  exportPaymentsCsv,
  exportProductsCsv,
  exportReceiptsCsv,
} from "@/lib/export";
import { Receipt } from "@/lib/receipt";
import {
  buildCustomerDebts,
  BusinessExpense,
  CustomerPayment,
  getStoredExpenses,
  getStoredPayments,
  getStoredProducts,
  getStoredReceipts,
  ProductItem,
} from "@/lib/storage";

export default function ExportsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [expenses, setExpenses] = useState<BusinessExpense[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    setReceipts(getStoredReceipts());
    setPayments(getStoredPayments());
    setExpenses(getStoredExpenses());
    setProducts(getStoredProducts());
  }, []);

  const customers = useMemo(() => {
    return buildCustomerDebts(receipts, payments);
  }, [receipts, payments]);

  return (
    <AppShell>
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
          Export Records
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
          Download business data.
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Export CSV files for backup, accountant review, or business reporting.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <ExportButton
            title="Receipts"
            count={receipts.length}
            onClick={() => exportReceiptsCsv(receipts)}
          />

          <ExportButton
            title="Customers"
            count={customers.length}
            onClick={() => exportCustomersCsv(customers)}
          />

          <ExportButton
            title="Payments"
            count={payments.length}
            onClick={() => exportPaymentsCsv(payments)}
          />

          <ExportButton
            title="Expenses"
            count={expenses.length}
            onClick={() => exportExpensesCsv(expenses)}
          />

          <ExportButton
            title="Products"
            count={products.length}
            onClick={() => exportProductsCsv(products)}
          />
        </div>
      </div>
    </AppShell>
  );
}

function ExportButton({
  title,
  count,
  onClick,
}: {
  title: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left hover:bg-zinc-100"
    >
      <div>
        <p className="font-black text-zinc-950">{title}</p>
        <p className="mt-1 text-sm font-semibold text-zinc-500">
          {count} record{count === 1 ? "" : "s"}
        </p>
      </div>

      <div className="rounded-2xl bg-zinc-950 p-3 text-white">
        <Download size={18} />
      </div>
    </button>
  );
}
