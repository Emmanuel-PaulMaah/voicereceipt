export type PaymentStatus = "paid" | "part-paid" | "unpaid";

export type ReceiptItem = {
  description: string;
  quantity?: number;
  unitPrice?: number;
  total?: number;
};

export type Receipt = {
  businessName: string;
  businessPhone?: string;
  receiptNumber: string;
  customerName: string;
  items: ReceiptItem[];
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentStatus: PaymentStatus;
  issuedAt: string;
};

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateReceiptNumber(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VR-${Date.now().toString().slice(-6)}-${random}`;
}

export function getPaymentStatus(
  totalAmount: number,
  amountPaid: number
): PaymentStatus {
  const balance = totalAmount - amountPaid;

  if (balance <= 0) return "paid";
  if (amountPaid <= 0) return "unpaid";
  return "part-paid";
}

export function buildReceipt(input: {
  businessName: string;
  customerName: string;
  itemDescription: string;
  totalAmount: number;
  amountPaid: number;
}): Receipt {
  const balance = Math.max(input.totalAmount - input.amountPaid, 0);

  return {
    businessName: input.businessName || "My Business",
    receiptNumber: generateReceiptNumber(),
    customerName: input.customerName,
    items: [
      {
        description: input.itemDescription,
      },
    ],
    totalAmount: input.totalAmount,
    amountPaid: input.amountPaid,
    balance,
    paymentStatus: getPaymentStatus(input.totalAmount, input.amountPaid),
    issuedAt: new Date().toISOString(),
  };
}

export function parseMoney(input: string): number {
  const cleaned = input
    .toLowerCase()
    .replace(/₦|ngn|naira|,/g, "")
    .trim();

  const kMatch = cleaned.match(/(\d+)\s*k/);
  if (kMatch) return Number(kMatch[1]) * 1000;

  const thousandDigitMatch = cleaned.match(/(\d+)\s*thousand/);
  if (thousandDigitMatch) return Number(thousandDigitMatch[1]) * 1000;

  const numberMatch = cleaned.match(/\d+/);
  if (numberMatch) return Number(numberMatch[0]);

  const words: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
  };

  for (const [word, value] of Object.entries(words)) {
    if (cleaned.includes(`${word} thousand`)) {
      return value * 1000;
    }
  }

  return 0;
}
