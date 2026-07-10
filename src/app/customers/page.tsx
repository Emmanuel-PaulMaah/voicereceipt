"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DebtDashboard } from "@/components/DebtDashboard";
import { Receipt } from "@/lib/receipt";
import {
  buildCustomerDebts,
  CustomerPayment,
  getStoredPayments,
  getStoredReceipts,
} from "@/lib/storage";

export default function CustomersPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);

  function refreshData() {
    setReceipts(getStoredReceipts());
    setPayments(getStoredPayments());
  }

  useEffect(() => {
    refreshData();
  }, []);

  const debts = useMemo(() => {
    return buildCustomerDebts(receipts, payments);
  }, [receipts, payments]);

  return (
    <AppShell>
      <DebtDashboard debts={debts} onPaymentSaved={refreshData} />
    </AppShell>
  );
}
