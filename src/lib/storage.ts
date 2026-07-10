import {
  generatePaymentNumber,
  PaymentReceipt,
  Receipt,
} from "@/lib/receipt";

const RECEIPTS_KEY = "voicereceipt.receipts";
const BUSINESS_PROFILE_KEY = "voicereceipt.businessProfile";
const PAYMENTS_KEY = "voicereceipt.payments";
const CUSTOMER_CONTACTS_KEY = "voicereceipt.customerContacts";
const EXPENSES_KEY = "voicereceipt.expenses";
const PRODUCTS_KEY = "voicereceipt.products";

function safeNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export type BusinessProfile = {
  businessName: string;
  businessPhone?: string;
  businessAddress?: string;
};

export type CustomerContact = {
  customerName: string;
  customerPhone?: string;
  updatedAt: string;
};

export type CustomerPayment = {
  id: string;
  paymentNumber: string;
  customerName: string;
  customerPhone?: string;
  amount: number;
  previousBalance: number;
  outstandingBalance: number;
  note?: string;
  paidAt: string;
};

export type BusinessExpense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  note?: string;
  spentAt: string;
};

export type ProductItem = {
  id: string;
  name: string;
  timesUsed: number;
  createdAt: string;
  lastUsedAt: string;
};

export type CustomerDebt = {
  customerName: string;
  customerPhone?: string;
  totalSpent: number;
  totalPaid: number;
  extraPayments: number;
  outstandingBalance: number;
  receiptCount: number;
  paymentCount: number;
  lastReceiptAt: string;
  lastPaymentAt?: string;
};

export type BusinessSummary = {
  totalSales: number;
  totalCollected: number;
  totalExpenses: number;
  netCash: number;
  totalOutstanding: number;
  receiptCount: number;
  expenseCount: number;
  paidReceiptCount: number;
  partPaidReceiptCount: number;
  unpaidReceiptCount: number;
  topCustomerName: string | null;
  topCustomerAmount: number;
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

  if (receipt.customerName || receipt.customerPhone) {
    upsertCustomerContact({
      customerName: receipt.customerName,
      customerPhone: receipt.customerPhone,
    });
  }

  for (const item of receipt.items) {
    autoAddProductsFromDescription(item.description);
  }

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

export function getBusinessProfile(): BusinessProfile | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(BUSINESS_PROFILE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as BusinessProfile;
  } catch {
    return null;
  }
}

export function saveBusinessProfile(profile: BusinessProfile) {
  window.localStorage.setItem(BUSINESS_PROFILE_KEY, JSON.stringify(profile));
}

export function clearBusinessProfile() {
  window.localStorage.removeItem(BUSINESS_PROFILE_KEY);
}

export function getCustomerContacts(): CustomerContact[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(CUSTOMER_CONTACTS_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as CustomerContact[];
  } catch {
    return [];
  }
}

export function getCustomerContact(customerName: string): CustomerContact | null {
  const key = customerName.trim().toLowerCase();

  return (
    getCustomerContacts().find(
      (contact) => contact.customerName.trim().toLowerCase() === key
    ) || null
  );
}

export function upsertCustomerContact(input: {
  customerName: string;
  customerPhone?: string;
}): CustomerContact[] {
  const customerName = input.customerName.trim();

  if (!customerName) return getCustomerContacts();

  const contacts = getCustomerContacts();
  const key = customerName.toLowerCase();

  const existingIndex = contacts.findIndex(
    (contact) => contact.customerName.trim().toLowerCase() === key
  );

  const existing = existingIndex >= 0 ? contacts[existingIndex] : null;

  const nextContact: CustomerContact = {
    customerName,
    customerPhone: input.customerPhone?.trim() || existing?.customerPhone || "",
    updatedAt: new Date().toISOString(),
  };

  const nextContacts =
    existingIndex >= 0
      ? contacts.map((contact, index) =>
          index === existingIndex ? nextContact : contact
        )
      : [nextContact, ...contacts];

  window.localStorage.setItem(
    CUSTOMER_CONTACTS_KEY,
    JSON.stringify(nextContacts)
  );

  return nextContacts;
}

export function getStoredPayments(): CustomerPayment[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(PAYMENTS_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as CustomerPayment[];
  } catch {
    return [];
  }
}

export function saveCustomerPayment(input: {
  customerName: string;
  customerPhone?: string;
  amount: number;
  previousBalance: number;
  outstandingBalance: number;
  note?: string;
}): CustomerPayment {
  const currentPayments = getStoredPayments();

  const payment: CustomerPayment = {
    id: `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    paymentNumber: generatePaymentNumber(),
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone?.trim(),
    amount: input.amount,
    previousBalance: input.previousBalance,
    outstandingBalance: input.outstandingBalance,
    note: input.note?.trim(),
    paidAt: new Date().toISOString(),
  };

  const nextPayments = [payment, ...currentPayments];

  window.localStorage.setItem(PAYMENTS_KEY, JSON.stringify(nextPayments));

  upsertCustomerContact({
    customerName: payment.customerName,
    customerPhone: payment.customerPhone,
  });

  return payment;
}

export function clearPayments() {
  window.localStorage.removeItem(PAYMENTS_KEY);
}

export function getPaymentsForCustomer(
  customerName: string
): CustomerPayment[] {
  const key = customerName.trim().toLowerCase();

  return getStoredPayments().filter(
    (payment) => payment.customerName.trim().toLowerCase() === key
  );
}

export function buildCustomerDebts(
  receipts: Receipt[],
  payments: CustomerPayment[] = getStoredPayments()
): CustomerDebt[] {
  const map = new Map<string, CustomerDebt>();

  for (const receipt of receipts) {
    const key = receipt.customerName.trim().toLowerCase();

    if (!key) continue;

    const existing = map.get(key);
    const savedContact = getCustomerContact(receipt.customerName);

    if (!existing) {
      map.set(key, {
        customerName: receipt.customerName,
        customerPhone: receipt.customerPhone || savedContact?.customerPhone,
        totalSpent: receipt.totalAmount,
        totalPaid: receipt.amountPaid,
        extraPayments: 0,
        outstandingBalance: receipt.balance,
        receiptCount: 1,
        paymentCount: 0,
        lastReceiptAt: receipt.issuedAt,
      });

      continue;
    }

    existing.customerPhone =
      existing.customerPhone || receipt.customerPhone || savedContact?.customerPhone;
    existing.totalSpent += receipt.totalAmount;
    existing.totalPaid += receipt.amountPaid;
    existing.outstandingBalance += receipt.balance;
    existing.receiptCount += 1;

    if (new Date(receipt.issuedAt) > new Date(existing.lastReceiptAt)) {
      existing.lastReceiptAt = receipt.issuedAt;
    }
  }

  for (const payment of payments) {
    const key = payment.customerName.trim().toLowerCase();

    if (!key) continue;

    const existing = map.get(key);
    const savedContact = getCustomerContact(payment.customerName);

    if (!existing) {
      map.set(key, {
        customerName: payment.customerName,
        customerPhone: payment.customerPhone || savedContact?.customerPhone,
        totalSpent: 0,
        totalPaid: 0,
        extraPayments: payment.amount,
        outstandingBalance: 0,
        receiptCount: 0,
        paymentCount: 1,
        lastReceiptAt: payment.paidAt,
        lastPaymentAt: payment.paidAt,
      });

      continue;
    }

    existing.customerPhone =
      existing.customerPhone || payment.customerPhone || savedContact?.customerPhone;
    existing.extraPayments += payment.amount;
    existing.paymentCount += 1;
    existing.outstandingBalance = Math.max(
      existing.outstandingBalance - payment.amount,
      0
    );

    if (
      !existing.lastPaymentAt ||
      new Date(payment.paidAt) > new Date(existing.lastPaymentAt)
    ) {
      existing.lastPaymentAt = payment.paidAt;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.outstandingBalance - a.outstandingBalance
  );
}

export function getStoredExpenses(): BusinessExpense[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(EXPENSES_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as BusinessExpense[];
  } catch {
    return [];
  }
}

export function saveExpense(input: {
  title: string;
  amount: number;
  category: string;
  note?: string;
}): BusinessExpense {
  const currentExpenses = getStoredExpenses();

  const expense: BusinessExpense = {
    id: `EXP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    title: input.title.trim(),
    amount: input.amount,
    category: input.category.trim() || "General",
    note: input.note?.trim(),
    spentAt: new Date().toISOString(),
  };

  const nextExpenses = [expense, ...currentExpenses];

  window.localStorage.setItem(EXPENSES_KEY, JSON.stringify(nextExpenses));

  return expense;
}

export function deleteExpense(expenseId: string): BusinessExpense[] {
  const nextExpenses = getStoredExpenses().filter(
    (expense) => expense.id !== expenseId
  );

  window.localStorage.setItem(EXPENSES_KEY, JSON.stringify(nextExpenses));

  return nextExpenses;
}

export function clearExpenses() {
  window.localStorage.removeItem(EXPENSES_KEY);
}

export function getTodaysExpenses(
  expenses: BusinessExpense[]
): BusinessExpense[] {
  const today = new Date().toDateString();

  return expenses.filter((expense) => {
    return new Date(expense.spentAt).toDateString() === today;
  });
}

export function getStoredProducts(): ProductItem[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(PRODUCTS_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as ProductItem[];
  } catch {
    return [];
  }
}

export function saveProducts(products: ProductItem[]) {
  window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function normalizeProductName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function upsertProduct(name: string): ProductItem[] {
  const cleanedName = normalizeProductName(name);

  if (!cleanedName) return getStoredProducts();

  const products = getStoredProducts();
  const key = cleanedName.toLowerCase();

  const existingIndex = products.findIndex(
    (product) => product.name.trim().toLowerCase() === key
  );

  const now = new Date().toISOString();

  const nextProducts =
    existingIndex >= 0
      ? products.map((product, index) =>
          index === existingIndex
            ? {
                ...product,
                timesUsed: safeNumber(product.timesUsed) + 1,
                lastUsedAt: now,
              }
            : product
        )
      : [
          {
            id: `PROD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
            name: cleanedName,
            timesUsed: 1,
            createdAt: now,
            lastUsedAt: now,
          },
          ...products,
        ];

  saveProducts(nextProducts);

  return nextProducts;
}

export function autoAddProductsFromDescription(description: string): ProductItem[] {
  const cleaned = description.trim();

  if (!cleaned) return getStoredProducts();

  const roughItems = cleaned
    .split(/\s+and\s+|,|\+/i)
    .map((item) =>
      item
        .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/gi, "")
        .replace(/\bat\b\s*\d+[kK]?/g, "")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);

  if (roughItems.length === 0) {
    return upsertProduct(cleaned);
  }

  let products = getStoredProducts();

  for (const item of roughItems) {
    products = upsertProduct(item);
  }

  return products;
}

export function deleteProduct(productId: string): ProductItem[] {
  const nextProducts = getStoredProducts().filter(
    (product) => product.id !== productId
  );

  saveProducts(nextProducts);

  return nextProducts;
}

export function clearProducts() {
  window.localStorage.removeItem(PRODUCTS_KEY);
}

export function clearCustomerContacts() {
  window.localStorage.removeItem(CUSTOMER_CONTACTS_KEY);
}

export function clearAllLocalData() {
  clearReceipts();
  clearPayments();
  clearExpenses();
  clearProducts();
  clearCustomerContacts();
  clearBusinessProfile();
}

export function buildBusinessSummary(
  receipts: Receipt[],
  payments: CustomerPayment[] = getStoredPayments(),
  expenses: BusinessExpense[] = getStoredExpenses()
): BusinessSummary {
  const customerTotals = new Map<string, number>();

  const extraPaymentsTotal = payments.reduce(
    (sum, payment) => sum + safeNumber(payment.amount),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + safeNumber(expense.amount),
    0
  );

  const summary: BusinessSummary = {
    totalSales: 0,
    totalCollected: extraPaymentsTotal,
    totalExpenses,
    netCash: 0,
    totalOutstanding: 0,
    receiptCount: receipts.length,
    expenseCount: expenses.length,
    paidReceiptCount: 0,
    partPaidReceiptCount: 0,
    unpaidReceiptCount: 0,
    topCustomerName: null,
    topCustomerAmount: 0,
  };

  for (const receipt of receipts) {
    summary.totalSales += safeNumber(receipt.totalAmount);
    summary.totalCollected += safeNumber(receipt.amountPaid);

    if (receipt.paymentStatus === "paid") summary.paidReceiptCount += 1;
    if (receipt.paymentStatus === "part-paid") summary.partPaidReceiptCount += 1;
    if (receipt.paymentStatus === "unpaid") summary.unpaidReceiptCount += 1;

    const customerKey = receipt.customerName.trim();

    if (customerKey) {
      const current = customerTotals.get(customerKey) || 0;
      customerTotals.set(customerKey, current + safeNumber(receipt.totalAmount));
    }
  }

  const debts = buildCustomerDebts(receipts, payments);

  summary.totalOutstanding = debts.reduce(
    (sum, customer) => sum + safeNumber(customer.outstandingBalance),
    0
  );

  summary.netCash = summary.totalCollected - summary.totalExpenses;

  for (const [customerName, amount] of customerTotals.entries()) {
    if (amount > summary.topCustomerAmount) {
      summary.topCustomerName = customerName;
      summary.topCustomerAmount = amount;
    }
  }

  return summary;
}

export function getTodaysReceipts(receipts: Receipt[]): Receipt[] {
  const today = new Date().toDateString();

  return receipts.filter((receipt) => {
    return new Date(receipt.issuedAt).toDateString() === today;
  });
}

export function getTodaysPayments(
  payments: CustomerPayment[]
): CustomerPayment[] {
  const today = new Date().toDateString();

  return payments.filter((payment) => {
    return new Date(payment.paidAt).toDateString() === today;
  });
}

export function getReceiptsForCustomer(customerName: string): Receipt[] {
  const key = customerName.trim().toLowerCase();

  return getStoredReceipts().filter(
    (receipt) => receipt.customerName.trim().toLowerCase() === key
  );
}

export function getCustomerDebtByName(customerName: string): CustomerDebt | null {
  const receipts = getStoredReceipts();
  const payments = getStoredPayments();

  const debts = buildCustomerDebts(receipts, payments);
  const key = customerName.trim().toLowerCase();

  return (
    debts.find(
      (customer) => customer.customerName.trim().toLowerCase() === key
    ) || null
  );
}

export function buildPaymentReceipt(input: {
  payment: CustomerPayment;
  businessProfile: BusinessProfile | null;
}): PaymentReceipt {
  return {
    businessName: input.businessProfile?.businessName || "My Business",
    businessPhone: input.businessProfile?.businessPhone,
    businessAddress: input.businessProfile?.businessAddress,
    paymentNumber: input.payment.paymentNumber,
    customerName: input.payment.customerName,
    customerPhone: input.payment.customerPhone,
    amountPaid: input.payment.amount,
    previousBalance: input.payment.previousBalance,
    outstandingBalance: input.payment.outstandingBalance,
    note: input.payment.note,
    paidAt: input.payment.paidAt,
  };
}
