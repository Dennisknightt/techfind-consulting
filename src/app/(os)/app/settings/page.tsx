import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { can } from "@/server/auth/roles";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/os/ui/Tabs";
import { ExperienceSettings } from "@/components/os/settings/ExperienceSettings";
import { TaxSettings } from "@/components/os/settings/TaxSettings";
import { PageHeader } from "@/components/os/common/PageHeader";
import { ComingSoon } from "@/components/os/common/ComingSoon";
import { getTaxConfigAction } from "@/server/actions/settings";

export const metadata: Metadata = { title: "Settings — Techfind" };

export default async function SettingsPage() {
  const user = await requireUser();
  const canManageSettings = can(user.role, "settings.write");
  const canEditTax = can(user.role, "tax.write");
  const taxConfig = await getTaxConfigAction();

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <PageHeader title="Settings" subtitle="Your profile, team, catalogue and how Techfind behaves" />

      <Tabs defaultValue="experience" className="mt-6">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="payments">Payment Provider</TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="mt-5">
          <ExperienceSettings initialEnabled={user.welcomeSoundEnabled} initialVolume={user.welcomeSoundVolume} />
        </TabsContent>

        <TabsContent value="profile" className="mt-5">
          <ComingSoon title="Profile settings" note="Name, phone, avatar colour and password changes." />
        </TabsContent>

        <TabsContent value="team" className="mt-5">
          <ComingSoon title="Team management" note="Invite teammates and assign roles (Sales, Finance, Management)." />
        </TabsContent>

        <TabsContent value="catalogue" className="mt-5">
          <ComingSoon
            title="Product catalogue"
            note={canManageSettings ? "Configure quick prices, quick items and packages — arrives with the Proforma Generator." : "Only Super Admins and Management can configure the catalogue."}
          />
        </TabsContent>

        <TabsContent value="tax" className="mt-5">
          <TaxSettings initial={taxConfig} canEdit={canEditTax} />
        </TabsContent>

        <TabsContent value="payments" className="mt-5">
          <ComingSoon title="Payment provider" note="Connect M-Pesa, card and bank rails — arrives with Payments." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
