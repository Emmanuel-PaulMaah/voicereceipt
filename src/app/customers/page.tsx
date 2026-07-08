"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DebtDashboard } from "@/components/DebtDashboard";
import { Receipt } from "@/lib/receipt";
import { buildCustomerDebts, getStoredReceipts } from "@/lib/storage";

export default function CustomersPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    setReceipts(getStoredReceipts());
  }, []);

  const debts = useMemo(() => {
    return buildCustomerDebts(receipts);
  }, [receipts]);

  return (
    <AppShell>
      <DebtDashboard debts={debts} />
    </AppShell>
  );
}
