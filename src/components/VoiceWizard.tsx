"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Mic, MicOff, RotateCcw } from "lucide-react";
import { buildReceipt, parseMoney, Receipt } from "@/lib/receipt";
import { BusinessProfile } from "@/lib/storage";

type Draft = {
  customerName: string;
  customerPhone: string;
  itemDescription: string;
  totalAmountRaw: string;
  amountPaidRaw: string;
};

type StepKey =
  | "customerName"
  | "customerPhone"
  | "itemDescription"
  | "totalAmountRaw"
  | "amountPaidRaw";

const steps: Array<{
  key: StepKey;
  label: string;
  question: string;
  voicePrompt: string;
  placeholder: string;
  helper?: string;
}> = [
  {
    key: "customerName",
    label: "Customer",
    question: "Who bought something?",
    voicePrompt: "Say the customer's name.",
    placeholder: "e.g. Ada",
  },
  {
    key: "customerPhone",
    label: "Phone",
    question: "What is the customer’s WhatsApp number?",
    voicePrompt: "Say or type the customer's WhatsApp number.",
    placeholder: "e.g. 08012345678",
    helper: "This lets reminders go directly to the customer on WhatsApp.",
  },
  {
    key: "itemDescription",
    label: "Items",
    question: "What did they buy?",
    voicePrompt: "Say what the customer bought.",
    placeholder: "e.g. Two shirts and one cap",
  },
  {
    key: "totalAmountRaw",
    label: "Total",
    question: "How much was the total?",
    voicePrompt: "Say the total amount.",
    placeholder: "e.g. 18k, 18000, eighteen thousand",
    helper: "You can type or say 18k, ₦18,000, or eighteen thousand.",
  },
  {
    key: "amountPaidRaw",
    label: "Paid",
    question: "How much did they pay?",
    voicePrompt: "Say how much the customer paid.",
    placeholder: "e.g. 10k, 10000, ten thousand",
    helper: "Balance will be calculated automatically.",
  },
];

type VoiceWizardProps = {
  businessProfile: BusinessProfile;
  onDraftChange: (receipt: Receipt | null) => void;
  onReceiptGenerated: (receipt: Receipt) => void;
};

const initialDraft: Draft = {
  customerName: "",
  customerPhone: "",
  itemDescription: "",
  totalAmountRaw: "",
  amountPaidRaw: "",
};

export function VoiceWizard({
  businessProfile,
  onDraftChange,
  onReceiptGenerated,
}: VoiceWizardProps) {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldKeepListeningRef = useRef(false);
  const baseTranscriptRef = useRef("");
  const latestValueRef = useRef("");
  const restartTimeoutRef = useRef<number | null>(null);

  const currentStep = steps[stepIndex];
  const currentValue = draft[currentStep.key];

  useEffect(() => {
    latestValueRef.current = currentValue;
  }, [currentValue]);

  const progress = useMemo(() => {
    return Math.round(((stepIndex + (isDone ? 1 : 0)) / steps.length) * 100);
  }, [stepIndex, isDone]);

  const draftReceipt = useMemo(() => {
    const hasAnyValue = Object.values(draft).some(
      (value) => value.trim().length > 0
    );

    if (!hasAnyValue) return null;

    return buildReceipt({
      businessName: businessProfile.businessName,
      businessPhone: businessProfile.businessPhone,
      businessAddress: businessProfile.businessAddress,
      customerName: draft.customerName || "Customer Name",
      customerPhone: draft.customerPhone,
      itemDescription: draft.itemDescription || "Items purchased",
      totalAmount: parseMoney(draft.totalAmountRaw),
      amountPaid: parseMoney(draft.amountPaidRaw),
      receiptNumber: "DRAFT",
      issuedAt: new Date().toISOString(),
    });
  }, [businessProfile, draft]);

  useEffect(() => {
    onDraftChange(draftReceipt);
  }, [draftReceipt, onDraftChange]);

  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;

      if (restartTimeoutRef.current) {
        window.clearTimeout(restartTimeoutRef.current);
      }

      recognitionRef.current?.stop();
    };
  }, []);

  function updateDraft(value: string) {
    setDraft((current) => ({
      ...current,
      [currentStep.key]: value,
    }));
  }

  function appendTranscript(base: string, transcript: string) {
    const cleanBase = base.trim();
    const cleanTranscript = transcript.trim();

    if (!cleanBase) return cleanTranscript;
    if (!cleanTranscript) return cleanBase;

    return `${cleanBase} ${cleanTranscript}`;
  }

  function canGenerateReceipt() {
    return (
      businessProfile.businessName.trim() &&
      draft.customerName.trim() &&
      draft.itemDescription.trim() &&
      parseMoney(draft.totalAmountRaw) > 0
    );
  }

  function makeFinalReceipt() {
    return buildReceipt({
      businessName: businessProfile.businessName,
      businessPhone: businessProfile.businessPhone,
      businessAddress: businessProfile.businessAddress,
      customerName: draft.customerName,
      customerPhone: draft.customerPhone,
      itemDescription: draft.itemDescription,
      totalAmount: parseMoney(draft.totalAmountRaw),
      amountPaid: parseMoney(draft.amountPaidRaw),
    });
  }

  function goNext() {
    if (!currentValue.trim()) return;

    stopListening();

    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
      setSpeechError(null);
      return;
    }

    if (!canGenerateReceipt()) return;

    const finalReceipt = makeFinalReceipt();

    setIsDone(true);
    setSpeechError(null);
    onReceiptGenerated(finalReceipt);
  }

  function reset() {
    stopListening();
    setDraft(initialDraft);
    setStepIndex(0);
    setIsDone(false);
    setSpeechError(null);
    onDraftChange(null);
  }

  function editStep(index: number) {
    stopListening();
    setStepIndex(index);
    setIsDone(false);
    setSpeechError(null);
  }

  function startListening() {
    setSpeechError(null);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechError(
        "Speech recognition is not supported in this browser. Use Chrome or Edge, or type the answer."
      );
      return;
    }

    if (restartTimeoutRef.current) {
      window.clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    recognitionRef.current?.stop();

    shouldKeepListeningRef.current = true;
    baseTranscriptRef.current = latestValueRef.current;

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.lang = "en-NG";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        return;
      }

      setSpeechError(`Mic error: ${event.error}. You can type instead.`);
    };

    recognition.onend = () => {
      if (!shouldKeepListeningRef.current) {
        setIsListening(false);
        return;
      }

      restartTimeoutRef.current = window.setTimeout(() => {
        if (!shouldKeepListeningRef.current) return;

        try {
          baseTranscriptRef.current = latestValueRef.current;
          recognition.start();
        } catch {
          setIsListening(false);
        }
      }, 250);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let index = 0; index < event.results.length; index++) {
        transcript += event.results[index][0].transcript;
      }

      const nextValue = appendTranscript(baseTranscriptRef.current, transcript);

      updateDraft(nextValue);
    };

    try {
      recognition.start();
    } catch {
      setSpeechError("Mic could not start. Try again or type instead.");
      setIsListening(false);
    }
  }

  function stopListening() {
    shouldKeepListeningRef.current = false;

    if (restartTimeoutRef.current) {
      window.clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    recognitionRef.current?.stop();
    setIsListening(false);
  }

  return (
    <div className="w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Create Receipt
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
            Speak or type each answer.
          </h1>
          <p className="mt-2 text-sm font-semibold text-zinc-500">
            Business: {businessProfile.businessName}
          </p>
        </div>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-zinc-950 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {steps.map((step, index) => {
          const isActive = index === stepIndex && !isDone;
          const hasValue = draft[step.key].trim().length > 0;

          return (
            <button
              key={step.key}
              onClick={() => editStep(index)}
              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                isActive
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : hasValue
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-zinc-200 bg-zinc-50 text-zinc-400"
              }`}
            >
              {index + 1}. {step.label}
            </button>
          );
        })}
      </div>

      {!isDone ? (
        <div className="mt-8">
          <p className="text-sm font-bold text-zinc-400">
            Question {stepIndex + 1} of {steps.length}
          </p>

          <label className="mt-2 block text-3xl font-black tracking-tight text-zinc-950">
            {currentStep.question}
          </label>

          <p className="mt-3 text-sm font-semibold text-zinc-500">
            {currentStep.voicePrompt}
          </p>

          <div className="mt-6 flex gap-3">
            <input
              value={currentValue}
              onChange={(event) => updateDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") goNext();
              }}
              placeholder={currentStep.placeholder}
              autoFocus
              className="min-w-0 flex-1 rounded-2xl border border-zinc-300 bg-white px-4 py-4 text-lg font-semibold text-zinc-950 outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
            />

            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl font-bold ${
                isListening
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-zinc-950 text-white hover:bg-zinc-800"
              }`}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
          </div>

          {isListening && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              Listening… keep speaking. Tap the mic again when done.
            </div>
          )}

          {speechError && (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800">
              {speechError}
            </div>
          )}

          {currentStep.helper && (
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {currentStep.helper}
            </p>
          )}

          <button
            onClick={goNext}
            disabled={!currentValue.trim()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {stepIndex === steps.length - 1
              ? "Generate & save receipt"
              : "Next"}
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="mt-8 rounded-3xl bg-green-50 p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-green-700">
            Receipt generated and saved
          </p>
          <p className="mt-2 text-sm leading-6 text-green-800">
            This receipt has been saved automatically. You can view it again
            from the Receipts page.
          </p>
        </div>
      )}
    </div>
  );
}
