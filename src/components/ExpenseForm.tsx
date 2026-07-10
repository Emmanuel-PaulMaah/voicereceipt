"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { parseMoney } from "@/lib/receipt";
import { BusinessExpense, saveExpense } from "@/lib/storage";

type ExpenseFormProps = {
  onExpenseSaved: (expense: BusinessExpense) => void;
};

const categories = [
  "Stock",
  "Transport",
  "Rent",
  "Utilities",
  "Packaging",
  "Staff",
  "Food",
  "Repairs",
  "Marketing",
  "General",
];

export function ExpenseForm({ onExpenseSaved }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amountRaw, setAmountRaw] = useState("");
  const [category, setCategory] = useState("General");
  const [note, setNote] = useState("");

  function handleSave() {
    const amount = parseMoney(amountRaw);

    if (!title.trim()) {
      alert("Expense title is required.");
      return;
    }

    if (amount <= 0) {
      alert("Enter a valid expense amount.");
      return;
    }

    const expense = saveExpense({
      title,
      amount,
      category,
      note,
    });

    setTitle("");
    setAmountRaw("");
    setCategory("General");
    setNote("");

    onExpenseSaved(expense);
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
          Add Expense
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
          Record money spent.
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Track stock purchases, transport, rent, packaging, repairs, and other
          business costs.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <div>
          <label className="text-sm font-bold text-zinc-700">Expense</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Bought nylon bags"
            className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-4 text-base font-semibold outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-zinc-700">Amount</label>
            <input
              value={amountRaw}
              onChange={(event) => setAmountRaw(event.target.value)}
              placeholder="e.g. 5k, 5000"
              className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-4 text-base font-semibold outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-zinc-700">Category</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-4 text-base font-semibold outline-none ring-zinc-950 focus:ring-2"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-zinc-700">
            Note optional
          </label>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. paid cash, transfer, POS"
            className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-4 text-base font-semibold outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
          />
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-4 text-sm font-black text-white hover:bg-zinc-800"
        >
          <Plus size={18} />
          Save expense
        </button>
      </div>
    </div>
  );
}
