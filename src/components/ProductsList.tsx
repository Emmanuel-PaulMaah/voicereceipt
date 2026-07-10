"use client";

import { Trash2 } from "lucide-react";
import { ProductItem } from "@/lib/storage";

type ProductsListProps = {
  products: ProductItem[];
  onProductsChanged: (products: ProductItem[]) => void;
};

export function ProductsList({
  products,
  onProductsChanged,
}: ProductsListProps) {

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Products
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
            {products.length} product type{products.length === 1 ? "" : "s"}
          </h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">
            Auto-added from receipts and manually added items.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center md:col-span-2">
            <p className="font-bold text-zinc-600">No products yet.</p>
            <p className="mt-1 text-sm text-zinc-400">
              Products will appear here when you create receipts.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-zinc-200 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black text-zinc-950">{product.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Used {product.timesUsed} time
                    {product.timesUsed === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
