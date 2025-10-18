import { Home, CreditCard, Plus, Settings, TrendingUp } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Langganan", url: "/subscriptions", icon: CreditCard },
  { title: "Tambah", url: "/add", icon: Plus, isCenterButton: true },
  { title: "Analisis", url: "/analytics", icon: TrendingUp },
  { title: "Pengaturan", url: "/settings", icon: Settings },
];

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === path;
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="neumo-card border-t border-border bg-card/95 backdrop-blur-lg rounded-t-3xl">
        <div className="flex items-end justify-around px-2 py-3 pb-safe relative">
          {navItems.map((item) => {
            const active = isActive(item.url);
            const isCenterButton = item.isCenterButton;
            
            if (isCenterButton) {
              return (
                <div key={item.title} className="flex flex-col items-center">
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className="relative -mt-8"
                  >
                    <div className={`
                      flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200 shadow-neumo-lg border-2
                      ${active 
                        ? "bg-primary text-primary-foreground scale-110 border-primary" 
                        : "bg-card border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-110"
                      }
                    `}>
                      <item.icon className="h-6 w-6 stroke-[2.5]" />
                    </div>
                  </NavLink>
                  <span className="text-xs font-medium text-foreground mt-1">
                    {item.title}
                  </span>
                </div>
              );
            }
            
            return (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === "/"}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[60px]
                  ${active 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className={`text-xs font-medium ${active ? "font-semibold" : ""}`}>
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
