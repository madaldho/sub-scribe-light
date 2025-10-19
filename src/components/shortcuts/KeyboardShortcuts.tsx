import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Command } from "lucide-react";

const shortcuts = [
  { key: "D", description: "Dashboard", path: "/dashboard" },
  { key: "S", description: "Langganan", path: "/subscriptions" },
  { key: "A", description: "Analitik", path: "/analytics" },
  { key: "P", description: "Pengaturan", path: "/settings" },
  { key: "N", description: "Tambah Langganan", path: "/add-subscription" },
  { key: "?", description: "Tampilkan Shortcuts", path: null },
];

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is pressed
      if (!e.ctrlKey && !e.metaKey) {
        if (e.key === '?' && e.shiftKey) {
          setShowHelp(true);
        }
        return;
      }

      // Prevent default browser shortcuts
      const key = e.key.toUpperCase();
      const shortcut = shortcuts.find(s => s.key === key);
      
      if (shortcut) {
        e.preventDefault();
        if (shortcut.path) {
          navigate(shortcut.path);
        } else if (key === '?') {
          setShowHelp(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Gunakan shortcuts untuk navigasi lebih cepat
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between p-2 rounded hover:bg-accent"
            >
              <span>{shortcut.description}</span>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs bg-muted rounded border">
                  {shortcut.key === '?' ? 'Shift' : 'Ctrl/Cmd'}
                </kbd>
                <span className="text-muted-foreground">+</span>
                <kbd className="px-2 py-1 text-xs bg-muted rounded border">
                  {shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
