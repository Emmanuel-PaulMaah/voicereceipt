"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpensesList } from "@/components/ExpensesList";
import { BusinessExpense, getStoredExpenses } from "@/lib/storage";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<BusinessExpense[]>([]);

  useEffect(() => {
    setExpenses(getStoredExpenses());
  }, []);

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
        <ExpenseForm
          onExpenseSaved={(expense) => {
            setExpenses((current) => [expense, ...current]);
          }}
        />

        <ExpensesList
          expenses={expenses}
          onExpensesChanged={setExpenses}
        />
      </div>
    </AppShell>
  );
}
