import { AppShell } from "@/components/AppShell";
import { BusinessSettingsForm } from "@/components/BusinessSettingsForm";
import { DangerZone } from "@/components/DangerZone";

export default function SettingsPage() {
  return (
    <AppShell>
      <BusinessSettingsForm />
      <DangerZone />
    </AppShell>
  );
}
