import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    return savedTheme || 'dark';
  });

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    
    // Save to localStorage for immediate effect
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Save to localStorage immediately for persistence
    localStorage.setItem('theme', newTheme);
    
    // TODO: Update user preferences in database when user is authenticated
    // This can be done later if needed for cloud sync
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative min-w-[44px] min-h-[44px]"
    >
      <Sun className={`h-[18px] w-[18px] transition-all duration-300 ${
        theme === 'light' 
          ? 'rotate-0 scale-100' 
          : 'rotate-90 scale-0'
      }`} />
      <Moon className={`absolute h-[18px] w-[18px] transition-all duration-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
        theme === 'dark' 
          ? 'rotate-0 scale-100' 
          : '-rotate-90 scale-0'
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
