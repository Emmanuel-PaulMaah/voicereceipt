"use client";

import { Trash2 } from "lucide-react";
import { formatNaira } from "@/lib/receipt";
import { BusinessExpense } from "@/lib/storage";

type ExpensesListProps = {
  expenses: BusinessExpense[];
  onExpensesChanged: (expenses: BusinessExpense[]) => void;
};

export function ExpensesList({
  expenses,
  onExpensesChanged,
}: ExpensesListProps) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Expense History
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
            {formatNaira(totalExpenses)}
          </h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">
            {expenses.length} expense{expenses.length === 1 ? "" : "s"} recorded
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {expenses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center">
            <p className="font-bold text-zinc-600">No expenses yet.</p>
            <p className="mt-1 text-sm text-zinc-400">
              Add your first expense to start tracking costs.
            </p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="rounded-2xl border border-zinc-200 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black text-zinc-950">{expense.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {expense.category} •{" "}
                    {new Date(expense.spentAt).toLocaleDateString("en-NG")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-black text-zinc-950">
                    {formatNaira(expense.amount)}
                  </p>
                </div>
              </div>

              {expense.note && (
                <p className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm font-medium text-zinc-600">
                  {expense.note}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
