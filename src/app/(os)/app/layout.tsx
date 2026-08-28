import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { AppShell } from "@/components/os/shell/AppShell";
import { WelcomeExperience } from "@/components/os/shell/WelcomeExperience";
import { InstallBanner } from "@/components/os/shell/InstallBanner";
import { ServiceWorkerRegister } from "@/components/os/shell/ServiceWorkerRegister";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unreadCount = await db.notification.count({ where: { userId: user.id, read: false } });

  return (
    <>
      <ServiceWorkerRegister />
      <WelcomeExperience
        firstName={user.name.split(" ")[0]}
        soundEnabled={user.welcomeSoundEnabled}
        volume={user.welcomeSoundVolume}
      />
      <AppShell user={user} unreadCount={unreadCount}>
        {children}
      </AppShell>
      <InstallBanner />
    </>
  );
}
