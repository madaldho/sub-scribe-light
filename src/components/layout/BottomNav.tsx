import { Home, CreditCard, Plus, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Langganan", url: "/subscriptions", icon: CreditCard },
  { title: "Tambah", url: "/add", icon: Plus },
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
      <div className="neumo-card border-t border-border bg-card/95 backdrop-blur-lg rounded-t-3xl pb-safe">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const active = isActive(item.url);
            return (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === "/"}
                className={`
                  flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200
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
