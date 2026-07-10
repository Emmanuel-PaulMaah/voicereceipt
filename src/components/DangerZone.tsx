"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import {
  clearAllLocalData,
  clearBusinessProfile,
  clearCustomerContacts,
  clearExpenses,
  clearPayments,
  clearProducts,
  clearReceipts,
} from "@/lib/storage";

type DangerAction = {
  label: string;
  description: string;
  confirmText: string;
  action: () => void;
};

const actions: DangerAction[] = [
  {
    label: "Clear business profile",
    description: "Removes saved business name, phone, and address.",
    confirmText: "Clear saved business profile?",
    action: clearBusinessProfile,
  },
  {
    label: "Clear receipts",
    description: "Deletes all saved sales receipts.",
    confirmText: "Clear all receipts?",
    action: clearReceipts,
  },
  {
    label: "Clear customer payments",
    description: "Deletes all recorded part-payment records.",
    confirmText: "Clear all customer payments?",
    action: clearPayments,
  },
  {
    label: "Clear expenses",
    description: "Deletes all expense records.",
    confirmText: "Clear all expenses?",
    action: clearExpenses,
  },
  {
    label: "Clear products",
    description: "Deletes all remembered product types.",
    confirmText: "Clear all products?",
    action: clearProducts,
  },
  {
    label: "Clear customer contacts",
    description: "Deletes saved customer WhatsApp numbers.",
    confirmText: "Clear all customer contacts?",
    action: clearCustomerContacts,
  },
];

export function DangerZone() {
  function runAction(item: DangerAction) {
    const confirmed = window.confirm(item.confirmText);

    if (!confirmed) return;

    item.action();
    alert(`${item.label} completed.`);
    window.location.reload();
  }

  function clearEverything() {
    const confirmed = window.confirm(
      "This will delete EVERYTHING saved locally: business profile, receipts, payments, expenses, products, and customer contacts. Continue?"
    );

    if (!confirmed) return;

    clearAllLocalData();
    alert("All local data cleared.");
    window.location.href = "/";
  }

  return (
    <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-red-100 p-3 text-red-700">
          <AlertTriangle size={22} />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-red-700">
            Danger Zone
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-red-950">
            Destructive actions
          </h2>
          <p className="mt-2 text-sm leading-6 text-red-800">
            These actions delete local data from this browser. They cannot be
            undone.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {actions.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-black text-zinc-950">{item.label}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
            </div>

            <button
              onClick={() => runAction(item)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100"
            >
              <Trash2 size={16} />
              Clear
            </button>
          </div>
        ))}

        <button
          onClick={clearEverything}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-700 px-5 py-4 text-sm font-black text-white hover:bg-red-600"
        >
          <Trash2 size={18} />
          Clear everything
        </button>
      </div>
    </div>
  );
}
