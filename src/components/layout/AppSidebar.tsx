import { Home, CreditCard, Plus, Settings, LogOut, TrendingUp } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Langganan", url: "/subscriptions", icon: CreditCard },
  { title: "Tambah Baru", url: "/add", icon: Plus },
  { title: "Analisis", url: "/analytics", icon: TrendingUp },
  { title: "Pengaturan", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === path;
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6">
            {open ? (
              <div className="flex items-center gap-3">
                <img 
                  src={logoLight} 
                  alt="LanggananKu" 
                  className="h-10 w-10 object-contain dark:hidden"
                />
                <img 
                  src={logoDark} 
                  alt="LanggananKu" 
                  className="h-10 w-10 object-contain hidden dark:block"
                />
                <span className="text-primary font-bold text-lg">LanggananKu</span>
              </div>
            ) : (
              <>
                <img 
                  src={logoLight} 
                  alt="LanggananKu" 
                  className="h-8 w-8 object-contain dark:hidden mx-auto"
                />
                <img 
                  src={logoDark} 
                  alt="LanggananKu" 
                  className="h-8 w-8 object-contain hidden dark:block mx-auto"
                />
              </>
            )}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${
                      isActive(item.url)
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    } transition-all duration-200`}
                  >
                    <NavLink to={item.url} end={item.url === "/"}>
                      <item.icon className="h-5 w-5" />
                      {open && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-card border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              {open && <span className="font-medium">Keluar</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
