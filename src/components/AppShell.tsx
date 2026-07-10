"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Download,
  FileText,
  Gauge,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  WalletCards,
} from "lucide-react";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Gauge,
  },
  {
    href: "/create",
    label: "Create",
    icon: ReceiptText,
  },
  {
    href: "/receipts",
    label: "Receipts",
    icon: FileText,
  },
  {
    href: "/customers",
    label: "Customers",
    icon: LayoutDashboard,
  },
  {
    href: "/expenses",
    label: "Expenses",
    icon: WalletCards,
  },
  {
    href: "/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/exports",
    label: "Exports",
    icon: Download,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-zinc-950 p-3 text-white">
              <ReceiptText size={22} />
            </div>

            <div>
              <p className="text-xl font-black tracking-tight">
                VoiceReceipt
              </p>
              <p className="text-sm font-medium text-zinc-500">
                Receipts, debts, and cash records
              </p>
            </div>
          </Link>

          <nav className="flex gap-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-zinc-950 text-white"
                      : "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </main>
  );
}
