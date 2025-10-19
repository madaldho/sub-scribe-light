import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { BottomNav } from "./BottomNav";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { OnboardingTutorial } from "@/components/onboarding/OnboardingTutorial";
import { KeyboardShortcuts } from "@/components/shortcuts/KeyboardShortcuts";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <div className="min-h-screen w-full bg-background pb-20">
          <main className="flex-1">
            {children}
          </main>
          <BottomNav />
        </div>
        <OnboardingTutorial />
        <KeyboardShortcuts />
      </>
    );
  }

  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          
          <SidebarInset className="flex-1">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 shadow-neumo-sm">
              <SidebarTrigger className="text-foreground hover:bg-accent hover:text-primary transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </SidebarTrigger>
              
              <div className="flex-1" />
              
              <div className="flex items-center gap-2">
                <NotificationBell />
                <ThemeToggle />
              </div>
            </header>

            <main className="flex-1">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <OnboardingTutorial />
      <KeyboardShortcuts />
    </>
  );
}
