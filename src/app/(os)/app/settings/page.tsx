import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { can } from "@/server/auth/roles";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/os/ui/Tabs";
import { ExperienceSettings } from "@/components/os/settings/ExperienceSettings";
import { TaxSettings } from "@/components/os/settings/TaxSettings";
import { PaymentProviderSettings } from "@/components/os/settings/PaymentProviderSettings";
import { TeamSettings } from "@/components/os/settings/TeamSettings";
import { CatalogueSettings } from "@/components/os/settings/CatalogueSettings";
import { PageHeader } from "@/components/os/common/PageHeader";
import { ComingSoon } from "@/components/os/common/ComingSoon";
import { getTaxConfigAction } from "@/server/actions/settings";
import { getActiveProvider, listProviderNames } from "@/server/payments/registry";
import { listTeamAction } from "@/server/actions/team";
import { listCatalogueAction } from "@/server/actions/catalogue";

export const metadata: Metadata = { title: "Settings — Techfind" };

export default async function SettingsPage() {
  const user = await requireUser();
  const canManageSettings = can(user.role, "settings.write");
  const canManageTeam = can(user.role, "users.write");
  const canEditTax = can(user.role, "tax.write");
  const taxConfig = await getTaxConfigAction();
  const { configuredName, devSafetyOverride } = await getActiveProvider();
  const team = await listTeamAction();
  const catalogue = await listCatalogueAction();

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
          <TeamSettings initialMembers={team} canEdit={canManageTeam} currentUserId={user.id} />
        </TabsContent>

        <TabsContent value="catalogue" className="mt-5">
          <CatalogueSettings initial={catalogue} canEdit={canManageSettings} />
        </TabsContent>

        <TabsContent value="tax" className="mt-5">
          <TaxSettings initial={taxConfig} canEdit={canEditTax} />
        </TabsContent>

        <TabsContent value="payments" className="mt-5">
          <PaymentProviderSettings
            configuredName={configuredName}
            devSafetyOverride={devSafetyOverride}
            canEdit={canEditTax}
            providers={listProviderNames()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
