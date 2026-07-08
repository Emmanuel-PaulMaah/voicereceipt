"use client";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Download, FileImage } from "lucide-react";

function getReceiptElement() {
  const receiptElement = document.getElementById("receipt-preview");

  if (!receiptElement) {
    alert("Receipt not found.");
    return null;
  }

  return receiptElement;
}

async function generateReceiptImage(): Promise<string | null> {
  const receiptElement = getReceiptElement();

  if (!receiptElement) return null;

  try {
    const dataUrl = await toPng(receiptElement, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    return dataUrl;
  } catch (error) {
    console.error(error);
    alert("Could not export receipt. Try again.");
    return null;
  }
}

export function ReceiptActions() {
  async function downloadImage() {
    const dataUrl = await generateReceiptImage();

    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = `receipt-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }

  async function downloadPDF() {
    const receiptElement = getReceiptElement();

    if (!receiptElement) return;

    const dataUrl = await generateReceiptImage();

    if (!dataUrl) return;

    const rect = receiptElement.getBoundingClientRect();

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [rect.width * 2, rect.height * 2],
    });

    pdf.addImage(dataUrl, "PNG", 0, 0, rect.width * 2, rect.height * 2);
    pdf.save(`receipt-${Date.now()}.pdf`);
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
