"use client";

import { useEffect, useState } from "react";
import { ReceiptPreview } from "@/components/ReceiptPreview";
import { ReceiptActions } from "@/components/ReceiptActions";
import { Receipt, formatNaira } from "@/lib/receipt";
import { clearReceipts, getStoredReceipts } from "@/lib/storage";

export function ReceiptsList() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const stored = getStoredReceipts();
    setReceipts(stored);
    setSelectedReceipt(stored[0] || null);
  }, []);

  function handleClearReceipts() {
    const confirmed = window.confirm("Clear all saved receipts?");

    if (!confirmed) return;

    clearReceipts();
    setReceipts([]);
    setSelectedReceipt(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px] xl:items-start">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
              Saved Receipts
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
              Receipt history
            </h1>
          </div>

          {receipts.length > 0 && (
            <button
              onClick={handleClearReceipts}
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mt-5 space-y-3">
          {receipts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center">
              <p className="font-bold text-zinc-600">No receipts saved yet.</p>
              <p className="mt-1 text-sm text-zinc-400">
                Generate a receipt from the Create page.
              </p>
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
                        {receipt.customerName}
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
      </section>

      <section className="flex flex-col items-center gap-4 xl:sticky xl:top-6">
        {selectedReceipt ? (
          <>
            <ReceiptPreview receipt={selectedReceipt} />
            <ReceiptActions />
          </>
        ) : (
          <div className="flex min-h-[520px] w-full max-w-md items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
                Receipt Viewer
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-zinc-950">
                Select a receipt.
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Saved receipts can be exported again as image or PDF.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
