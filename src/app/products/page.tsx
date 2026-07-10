"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProductForm } from "@/components/ProductForm";
import { ProductsList } from "@/components/ProductsList";
import { getStoredProducts, ProductItem } from "@/lib/storage";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
        <ProductForm onProductsChanged={setProducts} />
        <ProductsList products={products} onProductsChanged={setProducts} />
      </div>
    </AppShell>
  );
}
