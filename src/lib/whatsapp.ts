import { PaymentReceipt, Receipt, formatNaira } from "@/lib/receipt";
import { CustomerDebt } from "@/lib/storage";

function normalizePhoneForWhatsApp(phone?: string): string {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;

  return digits;
}

export function buildReceiptWhatsAppMessage(receipt: Receipt): string {
  const itemText = receipt.items.map((item) => item.description).join(", ");

  if (receipt.balance > 0) {
    return `Hi ${receipt.customerName}, thanks for your payment of ${formatNaira(
      receipt.amountPaid
    )}.

Your remaining balance is ${formatNaira(receipt.balance)} for:
${itemText}

Receipt No: ${receipt.receiptNumber}

Thank you.
- ${receipt.businessName}`;
  }

  return `Hi ${receipt.customerName}, thanks for your payment of ${formatNaira(
    receipt.amountPaid
  )}.

Your receipt for ${itemText} has been created.

Total: ${formatNaira(receipt.totalAmount)}
Receipt No: ${receipt.receiptNumber}

Thank you.
- ${receipt.businessName}`;
}

export function buildDebtReminderMessage(customer: CustomerDebt): string {
  return `Hi ${customer.customerName}, this is a reminder that you have an outstanding balance of ${formatNaira(
    customer.outstandingBalance
  )}.

Kindly make payment when convenient.

Thank you.`;
}

export function buildPaymentReceiptWhatsAppMessage(
  receipt: PaymentReceipt
): string {
  return `Hi ${receipt.customerName}, your part payment of ${formatNaira(
    receipt.amountPaid
  )} has been received.

Previous balance: ${formatNaira(receipt.previousBalance)}
Outstanding balance: ${formatNaira(receipt.outstandingBalance)}

Payment Receipt No: ${receipt.paymentNumber}

Thank you.
- ${receipt.businessName}`;
}

export function openWhatsAppWithMessage(message: string, phone?: string) {
  const encodedMessage = encodeURIComponent(message);
  const normalizedPhone = normalizePhoneForWhatsApp(phone);

  const url = normalizedPhone
    ? `https://wa.me/${normalizedPhone}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  window.open(url, "_blank");
}
