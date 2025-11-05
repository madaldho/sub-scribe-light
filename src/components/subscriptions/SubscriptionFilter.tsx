import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { X } from "lucide-react";

export interface SubscriptionFilters {
  statuses: string[];
  categories: string[];
  billingCycles: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

interface SubscriptionFilterProps {
  filters: SubscriptionFilters;
  onFiltersChange: (filters: SubscriptionFilters) => void;
  onClearFilters: () => void;
}

export function SubscriptionFilter({ filters, onFiltersChange, onClearFilters }: SubscriptionFilterProps) {
  const { data: subscriptions } = useSubscriptions();
  const [open, setOpen] = useState(false);

  // Extract unique values from subscriptions for filter options
  const statusOptions = ["active", "inactive", "trial", "cancelled", "paused"];
  const categoryOptions = subscriptions 
    ? Array.from(new Set(subscriptions.map(s => s.category).filter(Boolean)))
    : [];
  const billingCycleOptions = ["daily", "weekly", "monthly", "yearly"];

  const statusLabels: Record<string, string> = {
    active: "Aktif",
    inactive: "Berhenti", 
    trial: "Uji Coba",
    cancelled: "Dibatalkan",
    paused: "Dijeda"
  };

  const categoryLabels: Record<string, string> = {
    entertainment: "Hiburan",
    productivity: "Produktivitas",
    education: "Pendidikan",
    gaming: "Gaming",
    social: "Sosial Media",
    music: "Musik",
    video: "Video Streaming",
    cloud: "Cloud Storage",
    other: "Lainnya"
  };

  const billingCycleLabels: Record<string, string> = {
    daily: "Harian",
    weekly: "Mingguan", 
    monthly: "Bulanan",
    yearly: "Tahunan"
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked 
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status);
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category] 
      : filters.categories.filter(c => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleBillingCycleChange = (cycle: string, checked: boolean) => {
    const newCycles = checked
      ? [...filters.billingCycles, cycle]
      : filters.billingCycles.filter(c => c !== cycle);
    onFiltersChange({ ...filters, billingCycles: newCycles });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: numValue
      }
    });
  };

  const hasActiveFilters = filters.statuses.length > 0 || 
    filters.categories.length > 0 || 
    filters.billingCycles.length > 0 ||
    filters.priceRange.min > 0 || 
    filters.priceRange.max > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="relative">
          <Filter className="h-5 w-5" />
          {hasActiveFilters && <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Filter Langganan</DialogTitle>
          <DialogDescription>
            Filter langganan berdasarkan status, kategori, dan lainnya
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Status Filter */}
          <div>
            <Label className="text-base font-medium text-foreground mb-3 block">Status</Label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                    {statusLabels[status] || status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Category Filter */}
          <div>
            <Label className="text-base font-medium text-foreground mb-3 block">Kategori</Label>
            <div className="space-y-2">
              {categoryOptions.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal capitalize">
                    {categoryLabels[category] || category}
                  </Label>
                </div>
              ))}
              {categoryOptions.length === 0 && (
                <p className="text-sm text-muted-foreground">Tidak ada kategori tersedia</p>
              )}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Billing Cycle Filter */}
          <div>
            <Label className="text-base font-medium text-foreground mb-3 block"> siklus Tagihan</Label>
            <div className="space-y-2">
              {billingCycleOptions.map((cycle) => (
                <div key={cycle} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cycle-${cycle}`}
                    checked={filters.billingCycles.includes(cycle)}
                    onCheckedChange={(checked) => handleBillingCycleChange(cycle, checked as boolean)}
                  />
                  <Label htmlFor={`cycle-${cycle}`} className="text-sm font-normal">
                    {billingCycleLabels[cycle] || cycle}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Price Range Filter */}
          <div>
            <Label className="text-base font-medium text-foreground mb-3 block">Rentang Harga</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="min-price" className="text-sm">Minimum (Rp)</Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  value={filters.priceRange.min || ""}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-price" className="text-sm">Maximum (Rp)</Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="∞"
                  value={filters.priceRange.max || ""}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="border-border"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <>
              <Separator className="bg-border" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-medium text-foreground">Filter Aktif</Label>
                  <Button variant="outline" size="sm" onClick={onClearFilters}>
                    <X className="h4 w-4 mr-1" />
                    Hapus Semua
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.statuses.map(status => (
                    <Badge key={status} variant="secondary" className="text-xs">
                      {statusLabels[status] || status}
                    </Badge>
                  ))}
                  {filters.categories.map(category => (
                    <Badge key={category} variant="secondary" className="text-xs capitalize">
                      {categoryLabels[category] || category}
                    </Badge>
                  ))}
                  {filters.billingCycles.map(cycle => (
                    <Badge key={cycle} variant="secondary" className="text-xs">
                      {billingCycleLabels[cycle] || cycle}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={() => setOpen(false)}>
            Terapkan Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
