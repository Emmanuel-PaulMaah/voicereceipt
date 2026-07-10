"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, ReceiptText, WalletCards } from "lucide-react";
import { ReceiptPreview } from "@/components/ReceiptPreview";
import { ReceiptActions } from "@/components/ReceiptActions";
import { RecordPaymentForm } from "@/components/RecordPaymentForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { formatNaira, Receipt } from "@/lib/receipt";
import {
  buildCustomerDebts,
  CustomerDebt,
  CustomerPayment,
  getPaymentsForCustomer,
  getReceiptsForCustomer,
  getStoredPayments,
} from "@/lib/storage";

type CustomerLedgerProps = {
  customerName: string;
};

export function CustomerLedger({ customerName }: CustomerLedgerProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  function refreshData() {
    const nextReceipts = getReceiptsForCustomer(customerName);
    const nextPayments = getPaymentsForCustomer(customerName);

    setReceipts(nextReceipts);
    setPayments(nextPayments);
    setSelectedReceipt((current) => current || nextReceipts[0] || null);
  }

  useEffect(() => {
    refreshData();
  }, [customerName]);

  const customerDebt: CustomerDebt | null = useMemo(() => {
    const allPayments = getStoredPayments();
    const debts = buildCustomerDebts(receipts, allPayments);

    return (
      debts.find(
        (customer) =>
          customer.customerName.trim().toLowerCase() ===
          customerName.trim().toLowerCase()
      ) || null
    );
  }, [receipts, payments, customerName]);

  if (!customerDebt) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
          Customer not found
        </p>
        <h1 className="mt-2 text-2xl font-black text-zinc-950">
          No records for {customerName}
        </h1>
        <Link
          href="/customers"
          className="mt-5 inline-flex rounded-2xl bg-zinc-950 px-5 py-4 text-sm font-black text-white"
        >
          Back to customers
        </Link>
      </div>
    );
  }

  const isOwing = customerDebt.outstandingBalance > 0;

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold text-zinc-800 hover:bg-zinc-50"
      >
        <ArrowLeft size={17} />
        Back to customers
      </Link>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
              Customer Ledger
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
              {customerDebt.customerName}
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Full customer history: receipts, repayments, and current balance.
            </p>
          </div>

          <div
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              isOwing
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {isOwing
              ? `Owes ${formatNaira(customerDebt.outstandingBalance)}`
              : "Settled"}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total bought"
            value={formatNaira(customerDebt.totalSpent)}
            icon={<ReceiptText size={22} />}
          />

          <MetricCard
            title="Paid on receipts"
            value={formatNaira(customerDebt.totalPaid)}
            icon={<WalletCards size={22} />}
          />

          <MetricCard
            title="Extra payments"
            value={formatNaira(customerDebt.extraPayments)}
            icon={<WalletCards size={22} />}
          />

          <MetricCard
            title="Current balance"
            value={formatNaira(customerDebt.outstandingBalance)}
            icon={<FileText size={22} />}
          />
        </div>

        {isOwing && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <RecordPaymentForm
              customer={customerDebt}
              onPaymentSaved={refreshData}
            />
            <WhatsAppButton type="debt" customer={customerDebt} />
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px] xl:items-start">
        <section className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
              Receipts
            </p>
            <h2 className="mt-1 text-2xl font-black text-zinc-950">
              Purchase history
            </h2>

            <div className="mt-5 space-y-3">
              {receipts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-5 text-center text-sm font-bold text-zinc-500">
                  No receipts for this customer.
                </div>
              ) : (
                receipts.map((receipt) => {
                  const isSelected =
                    selectedReceipt?.receiptNumber === receipt.receiptNumber;

                  return (
                    <button
                      key={receipt.receiptNumber}
                      onClick={() => setSelectedReceipt(receipt)}
                      className={`w-full rounded-2xl border p-4 text-left ${
                        isSelected
                          ? "border-zinc-950 bg-zinc-50"
                          : "border-zinc-200 bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-zinc-950">
                            {receipt.items[0]?.description || "Items purchased"}
                          </p>
                          <p className="mt-1 text-sm text-zinc-500">
                            {receipt.receiptNumber} •{" "}
                            {new Date(receipt.issuedAt).toLocaleDateString(
                              "en-NG"
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-zinc-950">
                            {formatNaira(receipt.totalAmount)}
                          </p>
                          <p className="mt-1 text-xs font-bold uppercase text-zinc-400">
                            {receipt.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
              Payments
            </p>
            <h2 className="mt-1 text-2xl font-black text-zinc-950">
              Repayment history
            </h2>

            <div className="mt-5 space-y-3">
              {payments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-5 text-center text-sm font-bold text-zinc-500">
                  No extra payments recorded.
                </div>
              ) : (
                payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-2xl border border-zinc-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-zinc-950">
                          {formatNaira(payment.amount)}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {new Date(payment.paidAt).toLocaleDateString("en-NG")}
                        </p>
                      </div>

                      <p className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase text-green-700">
                        Received
                      </p>
                    </div>

                    {payment.note && (
                      <p className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm font-medium text-zinc-600">
                        {payment.note}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-4 xl:sticky xl:top-6">
          {selectedReceipt ? (
            <>
              <ReceiptPreview receipt={selectedReceipt} />
              <WhatsAppButton type="receipt" receipt={selectedReceipt} />
              <ReceiptActions />
            </>
          ) : (
            <div className="flex min-h-[520px] w-full max-w-md items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
                  Receipt Preview
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-zinc-950">
                  Select a receipt.
                </h2>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-zinc-500">{title}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-zinc-950">
            {value}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-3 text-white">{icon}</div>
      </div>
    </div>
  );
}
