import { Receipt } from "@/lib/receipt";

const RECEIPTS_KEY = "voicereceipt.receipts";

export type CustomerDebt = {
  customerName: string;
  totalSpent: number;
  totalPaid: number;
  outstandingBalance: number;
  receiptCount: number;
  lastReceiptAt: string;
};

export function getStoredReceipts(): Receipt[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(RECEIPTS_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as Receipt[];
  } catch {
    return [];
  }
}

export function saveReceipt(receipt: Receipt): Receipt[] {
  const currentReceipts = getStoredReceipts();

  const exists = currentReceipts.some(
    (item) => item.receiptNumber === receipt.receiptNumber
  );

  const nextReceipts = exists
    ? currentReceipts
    : [receipt, ...currentReceipts];

  window.localStorage.setItem(RECEIPTS_KEY, JSON.stringify(nextReceipts));

  return nextReceipts;
}

export function getReceiptByNumber(receiptNumber: string): Receipt | null {
  const receipts = getStoredReceipts();

  return (
    receipts.find((receipt) => receipt.receiptNumber === receiptNumber) || null
  );
}

export function clearReceipts() {
  window.localStorage.removeItem(RECEIPTS_KEY);
}

export function buildCustomerDebts(receipts: Receipt[]): CustomerDebt[] {
  const map = new Map<string, CustomerDebt>();

  for (const receipt of receipts) {
    const key = receipt.customerName.trim().toLowerCase();

    if (!key) continue;

    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        customerName: receipt.customerName,
        totalSpent: receipt.totalAmount,
        totalPaid: receipt.amountPaid,
        outstandingBalance: receipt.balance,
        receiptCount: 1,
        lastReceiptAt: receipt.issuedAt,
      });

      continue;
    }

    existing.totalSpent += receipt.totalAmount;
    existing.totalPaid += receipt.amountPaid;
    existing.outstandingBalance += receipt.balance;
    existing.receiptCount += 1;

    if (new Date(receipt.issuedAt) > new Date(existing.lastReceiptAt)) {
      existing.lastReceiptAt = receipt.issuedAt;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.outstandingBalance - a.outstandingBalance
  );
}
