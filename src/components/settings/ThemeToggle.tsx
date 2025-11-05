import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserPreferences, useUpdateUserPreferences } from "@/hooks/useUserPreferences";
import { useEffect } from "react";

export function ThemeToggle() {
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();

  const theme = preferences?.theme || 'dark';

  useEffect(() => {
    // Apply theme to document element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage for immediate effect before API response
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme !== theme) {
      updatePreferences.mutate({ theme: savedTheme });
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    // Immediate visual feedback
    localStorage.setItem('theme', newTheme);
    updatePreferences.mutate({ theme: newTheme });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative min-w-[44px] min-h-[44px]"
    >
      <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
