import { Receipt } from "@/lib/receipt";
import {
  BusinessExpense,
  CustomerDebt,
  CustomerPayment,
  ProductItem,
} from "@/lib/storage";

function escapeCsvValue(value: unknown): string {
  const stringValue = String(value ?? "");
  const escaped = stringValue.replace(/"/g, '""');

  return `"${escaped}"`;
}

function downloadCsv(filename: string, rows: unknown[][]) {
  const csv = rows
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function exportReceiptsCsv(receipts: Receipt[]) {
  downloadCsv("voicereceipt-receipts.csv", [
    [
      "Receipt No",
      "Date",
      "Business",
      "Customer",
      "Customer Phone",
      "Items",
      "Total",
      "Paid",
      "Balance",
      "Status",
    ],
    ...receipts.map((receipt) => [
      receipt.receiptNumber,
      receipt.issuedAt,
      receipt.businessName,
      receipt.customerName,
      receipt.customerPhone || "",
      receipt.items.map((item) => item.description).join("; "),
      receipt.totalAmount,
      receipt.amountPaid,
      receipt.balance,
      receipt.paymentStatus,
    ]),
  ]);
}

export function exportCustomersCsv(customers: CustomerDebt[]) {
  downloadCsv("voicereceipt-customers.csv", [
    [
      "Customer",
      "Phone",
      "Total Spent",
      "Paid On Receipts",
      "Extra Payments",
      "Outstanding Balance",
      "Receipt Count",
      "Payment Count",
    ],
    ...customers.map((customer) => [
      customer.customerName,
      customer.customerPhone || "",
      customer.totalSpent,
      customer.totalPaid,
      customer.extraPayments,
      customer.outstandingBalance,
      customer.receiptCount,
      customer.paymentCount,
    ]),
  ]);
}

export function exportPaymentsCsv(payments: CustomerPayment[]) {
  downloadCsv("voicereceipt-payments.csv", [
    [
      "Payment No",
      "Date",
      "Customer",
      "Phone",
      "Amount",
      "Previous Balance",
      "Outstanding Balance",
      "Note",
    ],
    ...payments.map((payment) => [
      payment.paymentNumber,
      payment.paidAt,
      payment.customerName,
      payment.customerPhone || "",
      payment.amount,
      payment.previousBalance,
      payment.outstandingBalance,
      payment.note || "",
    ]),
  ]);
}

export function exportExpensesCsv(expenses: BusinessExpense[]) {
  downloadCsv("voicereceipt-expenses.csv", [
    ["Date", "Title", "Amount", "Category", "Note"],
    ...expenses.map((expense) => [
      expense.spentAt,
      expense.title,
      expense.amount,
      expense.category,
      expense.note || "",
    ]),
  ]);
}

export function exportProductsCsv(products: ProductItem[]) {
  downloadCsv("voicereceipt-products.csv", [
    ["Product", "Times Used", "Created At", "Last Used At"],
    ...products.map((product) => [
      product.name,
      product.timesUsed,
      product.createdAt,
      product.lastUsedAt,
    ]),
  ]);
}
