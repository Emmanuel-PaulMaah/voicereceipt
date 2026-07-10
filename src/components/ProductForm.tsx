"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ProductItem, upsertProduct } from "@/lib/storage";

type ProductFormProps = {
  onProductsChanged: (products: ProductItem[]) => void;
};

export function ProductForm({ onProductsChanged }: ProductFormProps) {
  const [name, setName] = useState("");

  function handleSave() {
    if (!name.trim()) {
      alert("Product name is required.");
      return;
    }

    const products = upsertProduct(name);
    setName("");
    onProductsChanged(products);
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
        Product Catalog
      </p>
      <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
        Add product types.
      </h1>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        This is not stock counting. It is a memory of what your business sells.
      </p>

      <div className="mt-6 flex gap-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSave();
          }}
          placeholder="e.g. Shirts, Chargers, Nylon bags"
          className="min-w-0 flex-1 rounded-2xl border border-zinc-300 px-4 py-4 text-base font-semibold outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
        />

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-4 text-sm font-black text-white hover:bg-zinc-800"
        >
          <Plus size={18} />
          Add
        </button>
      </div>
    </div>
  );
}
