import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ServiceSuggestion {
  name: string;
  logo: string;
  category: string;
  color: string;
}

const popularServices: ServiceSuggestion[] = [
  { name: "Netflix", logo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop", category: "streaming", color: "#E50914" },
  { name: "Spotify", logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&h=100&fit=crop", category: "musik", color: "#1DB954" },
  { name: "Disney+", logo: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=100&h=100&fit=crop", category: "streaming", color: "#113CCF" },
  { name: "YouTube Premium", logo: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=100&h=100&fit=crop", category: "streaming", color: "#FF0000" },
  { name: "Adobe Creative Cloud", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop", category: "software", color: "#FF0000" },
  { name: "Microsoft 365", logo: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100&h=100&fit=crop", category: "software", color: "#D83B01" },
  { name: "Canva Pro", logo: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=100&h=100&fit=crop", category: "software", color: "#00C4CC" },
  { name: "Notion", logo: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=100&h=100&fit=crop", category: "produktivitas", color: "#000000" },
];

interface ServiceSuggestionsProps {
  onSelect: (service: ServiceSuggestion) => void;
}

export function ServiceSuggestions({ onSelect }: ServiceSuggestionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Layanan Populer</h3>
        <Badge variant="secondary" className="text-xs">Pilih Cepat</Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {popularServices.map((service) => (
          <Card
            key={service.name}
            className="cursor-pointer border-border hover:border-primary transition-all group overflow-hidden"
            onClick={() => onSelect(service)}
          >
            <div className="p-3 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <img 
                  src={service.logo} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-medium text-center text-foreground group-hover:text-primary transition-colors">
                {service.name}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
