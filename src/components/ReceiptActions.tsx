"use client";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Download, FileImage } from "lucide-react";

type ReceiptActionsProps = {
  elementId?: string;
  filePrefix?: string;
};

function getElement(elementId: string) {
  const element = document.getElementById(elementId);

  if (!element) {
    alert("Export target not found.");
    return null;
  }

  return element;
}

async function generateImage(
  elementId: string
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  const element = getElement(elementId);

  if (!element) return null;

  try {
    const rect = element.getBoundingClientRect();

    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    return {
      dataUrl,
      width: rect.width * 2,
      height: rect.height * 2,
    };
  } catch (error) {
    console.error(error);
    alert("Could not export. Try again.");
    return null;
  }
}

export function ReceiptActions({
  elementId = "receipt-preview",
  filePrefix = "receipt",
}: ReceiptActionsProps) {
  async function downloadImage() {
    const result = await generateImage(elementId);

    if (!result) return;

    const link = document.createElement("a");
    link.download = `${filePrefix}-${Date.now()}.png`;
    link.href = result.dataUrl;
    link.click();
  }

  async function downloadPDF() {
    const result = await generateImage(elementId);

    if (!result) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [result.width, result.height],
    });

    pdf.addImage(result.dataUrl, "PNG", 0, 0, result.width, result.height);
    pdf.save(`${filePrefix}-${Date.now()}.pdf`);
  }

  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-3">
      <button
        onClick={downloadImage}
        className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold text-zinc-900 hover:bg-zinc-50"
      >
        <FileImage size={18} />
        Image
      </button>

      <button
        onClick={downloadPDF}
        className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800"
      >
        <Download size={18} />
        PDF
      </button>
    </div>
  );
}
