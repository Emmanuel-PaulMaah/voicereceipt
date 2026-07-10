"use client";

import { MessageCircle } from "lucide-react";
import {
  buildDebtReminderMessage,
  buildPaymentReceiptWhatsAppMessage,
  buildReceiptWhatsAppMessage,
  openWhatsAppWithMessage,
} from "@/lib/whatsapp";
import { PaymentReceipt, Receipt } from "@/lib/receipt";
import { CustomerDebt } from "@/lib/storage";

type WhatsAppButtonProps =
  | {
      type: "receipt";
      receipt: Receipt;
      customer?: never;
      paymentReceipt?: never;
    }
  | {
      type: "debt";
      customer: CustomerDebt;
      receipt?: never;
      paymentReceipt?: never;
    }
  | {
      type: "payment";
      paymentReceipt: PaymentReceipt;
      receipt?: never;
      customer?: never;
    };

export function WhatsAppButton(props: WhatsAppButtonProps) {
  function handleClick() {
    if (props.type === "receipt") {
      openWhatsAppWithMessage(
        buildReceiptWhatsAppMessage(props.receipt),
        props.receipt.customerPhone
      );
      return;
    }

    if (props.type === "debt") {
      openWhatsAppWithMessage(
        buildDebtReminderMessage(props.customer),
        props.customer.customerPhone
      );
      return;
    }

    openWhatsAppWithMessage(
      buildPaymentReceiptWhatsAppMessage(props.paymentReceipt),
      props.paymentReceipt.customerPhone
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white hover:bg-green-500"
    >
      <MessageCircle size={18} />
      WhatsApp
    </button>
  );
}
