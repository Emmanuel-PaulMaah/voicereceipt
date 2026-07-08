"use client";

import { useCallback, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ReceiptActions } from "@/components/ReceiptActions";
import { ReceiptPreview } from "@/components/ReceiptPreview";
import { VoiceWizard } from "@/components/VoiceWizard";
import { Receipt } from "@/lib/receipt";
import { saveReceipt } from "@/lib/storage";

export default function CreateReceiptPage() {
  const [previewReceipt, setPreviewReceipt] = useState<Receipt | null>(null);
  const [finalReceipt, setFinalReceipt] = useState<Receipt | null>(null);

  const handleDraftChange = useCallback((receipt: Receipt | null) => {
    setPreviewReceipt(receipt);
  }, []);

  function handleReceiptGenerated(receipt: Receipt) {
    saveReceipt(receipt);
    setFinalReceipt(receipt);
    setPreviewReceipt(receipt);
  }

  const shownReceipt = finalReceipt || previewReceipt;

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px] xl:items-start">
        <section>
          <VoiceWizard
            onDraftChange={handleDraftChange}
            onReceiptGenerated={handleReceiptGenerated}
          />
        </section>

        <section className="flex flex-col items-center gap-4 xl:sticky xl:top-6">
          {shownReceipt ? (
            <>
              {shownReceipt.receiptNumber === "DRAFT" && (
                <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                  Draft preview — not saved yet.
                </div>
              )}

              {shownReceipt.receiptNumber !== "DRAFT" && (
                <div className="w-full max-w-md rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">
                  Saved automatically.
                </div>
              )}

              <ReceiptPreview receipt={shownReceipt} />

              {shownReceipt.receiptNumber !== "DRAFT" && <ReceiptActions />}
            </>
          ) : (
            <div className="flex min-h-[520px] w-full max-w-md items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
                  Live Receipt Preview
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-zinc-950">
                  Start answering questions.
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Your receipt preview will update before you generate the final
                  saved receipt.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
