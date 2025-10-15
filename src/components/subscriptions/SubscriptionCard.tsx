import { useNavigate } from "react-router-dom";
import { Calendar, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Subscription {
  id: string;
  name: string;
  package: string;
  billing: string;
  amount: string;
  dueDate: string;
  category: string;
  status: "Aktif" | "Berhenti" | "Uji Coba";
  logo: string;
}

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const navigate = useNavigate();

  const statusColors = {
    "Aktif": "text-success bg-success/10 border-success/30",
    "Berhenti": "text-destructive bg-destructive/10 border-destructive/30",
    "Uji Coba": "text-warning bg-warning/10 border-warning/30"
  };

  return (
    <div 
      className="neumo-card neumo-card-hover p-6 cursor-pointer group"
      onClick={() => navigate(`/subscription/${subscription.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="neumo-card p-4 rounded-2xl text-3xl bg-background-elevated">
          {subscription.logo}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="neumo-card rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // Handle menu
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground mb-1">
          {subscription.name}
        </h3>
        <p className="text-sm text-foreground-muted">
          {subscription.package} • {subscription.billing}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge variant="outline" className="border-primary/30 text-primary">
          {subscription.category}
        </Badge>
        <Badge 
          variant="outline" 
          className={statusColors[subscription.status]}
        >
          {subscription.status}
        </Badge>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground-muted">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{subscription.dueDate}</span>
          </div>
          <span className="text-xl font-bold text-foreground">
            {subscription.amount}
          </span>
        </div>
      </div>
    </div>
  );
};
