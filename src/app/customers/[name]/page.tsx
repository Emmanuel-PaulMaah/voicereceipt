import { AppShell } from "@/components/AppShell";
import { CustomerLedger } from "@/components/CustomerLedger";

type CustomerPageProps = {
  params: Promise<{
    name: string;
  }>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { name } = await params;
  const customerName = decodeURIComponent(name);

  return (
    <AppShell>
      <CustomerLedger customerName={customerName} />
    </AppShell>
  );
}
