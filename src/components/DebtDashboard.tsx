import { AlertCircle, CheckCircle2, Users } from "lucide-react";
import { CustomerDebt } from "@/lib/storage";
import { formatNaira } from "@/lib/receipt";

type DebtDashboardProps = {
  debts: CustomerDebt[];
};

export function DebtDashboard({ debts }: DebtDashboardProps) {
  const totalOutstanding = debts.reduce(
    (sum, customer) => sum + customer.outstandingBalance,
    0
  );

  const customersOwing = debts.filter(
    (customer) => customer.outstandingBalance > 0
  );

  return (
    <div className="w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            Customer Debt
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
            Who owes you?
          </h2>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-3 text-white">
          <Users size={22} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">Outstanding</p>
          <p className="mt-1 text-2xl font-black text-red-900">
            {formatNaira(totalOutstanding)}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-50 p-4">
          <p className="text-sm font-bold text-zinc-500">Customers owing</p>
          <p className="mt-1 text-2xl font-black text-zinc-950">
            {customersOwing.length}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {debts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-5 text-center">
            <p className="text-sm font-bold text-zinc-500">
              No saved receipts yet.
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Generate and save a receipt to start tracking customer balances.
            </p>
          </div>
        ) : (
          debts.map((customer) => {
            const isOwing = customer.outstandingBalance > 0;

            return (
              <div
                key={customer.customerName}
                className="rounded-2xl border border-zinc-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {isOwing ? (
                        <AlertCircle size={18} className="text-red-600" />
                      ) : (
                        <CheckCircle2 size={18} className="text-green-600" />
                      )}

                      <p className="font-black text-zinc-950">
                        {customer.customerName}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-zinc-500">
                      {customer.receiptCount} receipt
                      {customer.receiptCount === 1 ? "" : "s"} • Last:{" "}
                      {new Date(customer.lastReceiptAt).toLocaleDateString(
                        "en-NG"
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        isOwing ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {isOwing ? "Owing" : "Settled"}
                    </p>
                    <p className="mt-1 font-black text-zinc-950">
                      {formatNaira(customer.outstandingBalance)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-zinc-50 p-3">
                    <p className="text-zinc-500">Spent</p>
                    <p className="font-bold text-zinc-950">
                      {formatNaira(customer.totalSpent)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-3">
                    <p className="text-zinc-500">Paid</p>
                    <p className="font-bold text-zinc-950">
                      {formatNaira(customer.totalPaid)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
