"use client";

import { useState } from "react";
import { ReceiptActions } from "@/components/ReceiptActions";
import { ReceiptPreview } from "@/components/ReceiptPreview";
import { VoiceWizard } from "@/components/VoiceWizard";
import { Receipt } from "@/lib/receipt";

export default function Home() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-6 text-zinc-950">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <section>
          <VoiceWizard onReceiptChange={setReceipt} />
        </section>

        <section className="flex flex-col items-center gap-4 lg:sticky lg:top-6">
          {receipt ? (
            <>
              <ReceiptPreview receipt={receipt} />
              <ReceiptActions />
            </>
          ) : (
            <div className="flex min-h-[520px] w-full max-w-md items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
                  Receipt Preview
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-zinc-950">
                  Your receipt appears here.
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Complete the questions on the left to generate a clean receipt
                  with total, paid amount, balance, and payment status.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
