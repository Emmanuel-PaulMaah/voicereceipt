"use client";

import { useState } from "react";
import { Banknote, X } from "lucide-react";
import { formatNaira, parseMoney } from "@/lib/receipt";
import {
  CustomerDebt,
  CustomerPayment,
  saveCustomerPayment,
} from "@/lib/storage";

type RecordPaymentFormProps = {
  customer: CustomerDebt;
  onPaymentSaved: (payment?: CustomerPayment) => void;
};

export function RecordPaymentForm({
  customer,
  onPaymentSaved,
}: RecordPaymentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amountRaw, setAmountRaw] = useState("");
  const [note, setNote] = useState("");

  const amount = parseMoney(amountRaw);
  const newBalance = Math.max(customer.outstandingBalance - amount, 0);

  function handleSave() {
    if (amount <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    const payment = saveCustomerPayment({
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      amount,
      previousBalance: customer.outstandingBalance,
      outstandingBalance: newBalance,
      note,
    });

    setAmountRaw("");
    setNote("");
    setIsOpen(false);
    onPaymentSaved(payment);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-black text-white hover:bg-zinc-800"
      >
        <Banknote size={18} />
        Record payment
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Payment received
          </p>
          <p className="mt-1 font-black text-zinc-950">
            {customer.customerName}
          </p>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="rounded-xl border border-zinc-300 bg-white p-2 text-zinc-700 hover:bg-zinc-50"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-sm font-bold text-zinc-700">
            Amount received
          </label>
          <input
            value={amountRaw}
            onChange={(event) => setAmountRaw(event.target.value)}
            placeholder="e.g. 3k, 3000, three thousand"
            className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-base font-semibold outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-zinc-700">
            Note optional
          </label>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. bank transfer, cash, POS"
            className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-base font-semibold outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-white p-3">
            <p className="text-zinc-500">Current balance</p>
            <p className="font-black text-zinc-950">
              {formatNaira(customer.outstandingBalance)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-3">
            <p className="text-zinc-500">New balance</p>
            <p className="font-black text-zinc-950">
              {formatNaira(newBalance)}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white hover:bg-green-500"
        >
          Save payment & create receipt
        </button>
      </div>
    </div>
  );
}
