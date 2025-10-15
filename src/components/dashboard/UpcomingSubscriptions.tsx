import { Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockSubscriptions = [
  {
    id: "1",
    name: "Netflix",
    package: "Premium",
    amount: "Rp 65.000",
    dueDate: "25 Okt",
    category: "Entertainment",
    logo: "🎬"
  },
  {
    id: "2",
    name: "Spotify",
    package: "Family",
    amount: "Rp 85.000",
    dueDate: "27 Okt",
    category: "Music",
    logo: "🎵"
  },
  {
    id: "3",
    name: "Hosting",
    package: "Pro",
    amount: "Rp 180.000",
    dueDate: "28 Okt",
    category: "Development",
    logo: "🌐"
  }
];

export const UpcomingSubscriptions = () => {
  return (
    <div className="neumo-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Jatuh Tempo Minggu Ini</h2>
        <Calendar className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-4">
        {mockSubscriptions.map((sub) => (
          <div 
            key={sub.id}
            className="neumo-card neumo-card-hover p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="neumo-card p-3 rounded-xl text-2xl bg-background-elevated flex-shrink-0">
                {sub.logo}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{sub.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-foreground-muted">{sub.package}</span>
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    {sub.category}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-bold text-foreground mb-1">{sub.amount}</p>
              <p className="text-sm text-foreground-muted">{sub.dueDate}</p>
            </div>

            <Button
              size="icon"
              className="neumo-card neumo-card-hover rounded-xl bg-success/10 text-success hover:bg-success hover:text-success-foreground flex-shrink-0"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
