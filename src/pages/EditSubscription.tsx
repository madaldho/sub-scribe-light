import { useState, useEffect, FormEvent, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSubscription, useUpdateSubscription } from "@/hooks/useSubscriptions";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { toast } from "sonner";
import { LogoUploader } from "@/components/subscriptions/LogoUploader";
import { calculateNextBillingDate, formatBillingCycle, type BillingCycle } from "@/lib/dateUtils";

const EditSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: subscription, isLoading } = useSubscription(id!);
  const updateSubscription = useUpdateSubscription();
  const { data: paymentMethods = [] } = usePaymentMethods();

  // Form states
  const [period, setPeriod] = useState<BillingCycle>("monthly");
  const [autoRenew, setAutoRenew] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "IDR",
    startDate: "",
    category: "",
    notes: "",
    paymentMethod: ""
  });

  // Initialize form data when subscription loads
  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        description: subscription.description || "",
        price: subscription.price.toString(),
        currency: subscription.currency,
        startDate: subscription.start_date,
        category: subscription.category,
        notes: subscription.notes || "",
        paymentMethod: subscription.payment_method || ""
      });
      setPeriod(subscription.billing_cycle);
      setAutoRenew(subscription.auto_renew || false);
      setLogoUrl(subscription.logo_url || "");
      setIsTrial(subscription.is_trial || false);
      setTrialEndDate(subscription.trial_end_date || "");
    }
  }, [subscription]);

  

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!subscription) return;

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Nama layanan harus diisi");
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Harga harus lebih dari 0");
      return;
    }
    
    if (!formData.startDate) {
      toast.error("Tanggal mulai harus diisi");
      return;
    }

    const { nextBillingDate } = calculateNextBillingDate(formData.startDate, period);

    const updateData = {
      id: subscription.id,
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      currency: formData.currency || "IDR",
      billing_cycle: period,
      start_date: formData.startDate,
      next_billing_date: nextBillingDate,
      category: formData.category || "lainnya",
      notes: formData.notes || null,
      logo_url: logoUrl || null,
      payment_method: formData.paymentMethod || null,
      auto_renew: autoRenew,
      is_trial: isTrial,
      trial_end_date: isTrial ? trialEndDate : null,
    };

    console.log("Form data for update:", { name: formData.name, period, startDate: formData.startDate });
    console.log("Updating subscription data:", updateData);

    updateSubscription.mutate(updateData, {
      onSuccess: () => {
        toast.success("Langganan berhasil diperbarui!");
        navigate(`/subscription/${subscription.id}`);
      },
      onError: (error: any) => {
        console.error("Failed to update subscription:", error);
        toast.error(error.message || "Gagal memperbarui langganan");
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Langganan tidak ditemukan</h1>
          <Button onClick={() => navigate("/subscriptions")}>Kembali</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/subscription/${subscription.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Edit Langganan
          </h1>
          <p className="text-muted-foreground">
            Perbarui detail langganan {subscription.name}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="neumo-card p-4 md:p-6 space-y-6">
            {/* Logo Upload */}
            <LogoUploader 
              onUploadComplete={setLogoUrl}
              currentLogo={logoUrl}
            />

            {/* Service Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nama Layanan
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="contoh: Netflix, Spotify"
                className="neumo-input h-12 border-0 focus-visible:ring-primary"
                required
              />
            </div>

            {/* Package */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Paket/Level
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="contoh: Premium, Pro, Basic"
                className="neumo-input h-12 border-0 focus-visible:ring-primary"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground">
                  Harga
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0"
                  className="neumo-input h-12 border-0 focus-visible:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-foreground">
                  Mata Uang
                </Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger className="neumo-input h-12 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="IDR">IDR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Billing Period */}
            <div className="space-y-3">
              <Label className="text-foreground">Periode Pembayaran</Label>
              <RadioGroup value={period} onValueChange={setPeriod}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "daily", label: "Harian" },
                    { value: "weekly", label: "Mingguan" },
                    { value: "monthly", label: "Bulanan" },
                    { value: "yearly", label: "Tahunan" }
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`neumo-card p-4 rounded-xl cursor-pointer transition-all ${
                        period === option.value
                          ? "border-2 border-primary shadow-[0_0_20px_rgba(142,192,165,0.3)]"
                          : "border-2 border-transparent"
                      }`}
                      onClick={() => {
                      console.log("Selected period (edit):", option.value);
                      setPeriod(option.value as BillingCycle);
                    }}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className="text-foreground cursor-pointer font-medium"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-foreground">
                Tanggal Mulai
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="neumo-input h-12 border-0 focus-visible:ring-primary"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">
                Kategori
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="contoh: Entertainment, Development"
                className="neumo-input h-12 border-0 focus-visible:ring-primary"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-foreground">
                Metode Pembayaran (Opsional)
              </Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                <SelectTrigger className="neumo-input h-12 border-0">
                  <SelectValue placeholder="Pilih metode pembayaran" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="">Tidak ada</SelectItem>
                  {paymentMethods.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Belum ada metode pembayaran
                    </div>
                  ) : (
                    paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.name}>
                        {method.name} ({method.provider})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Free Trial */}
            <div className="flex items-center justify-between p-4 neumo-card rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-foreground font-medium">Free Trial</Label>
                <p className="text-xs text-muted-foreground">
                  Tandai sebagai masa percobaan gratis
                </p>
              </div>
              <Switch
                checked={isTrial}
                onCheckedChange={setIsTrial}
              />
            </div>

            {isTrial && (
              <div className="space-y-2">
                <Label htmlFor="trialEndDate" className="text-foreground">
                  Tanggal Berakhir Trial
                </Label>
                <Input
                  id="trialEndDate"
                  type="date"
                  value={trialEndDate}
                  onChange={(e) => setTrialEndDate(e.target.value)}
                  className="neumo-input border-0 focus-visible:ring-primary"
                />
              </div>
            )}

            {/* Auto Renew */}
            <div className="flex items-center justify-between p-4 neumo-card rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-foreground font-medium">Auto Renewal</Label>
                <p className="text-xs text-muted-foreground">
                  Perpanjang otomatis setiap periode
                </p>
              </div>
              <Switch
                checked={autoRenew}
                onCheckedChange={setAutoRenew}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground">
                Catatan (Opsional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Tambahkan catatan untuk langganan ini..."
                className="neumo-input min-h-24 border-0 focus-visible:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/subscription/${subscription.id}`)}
              className="flex-1 h-12 md:h-14"
              disabled={updateSubscription.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 md:h-14"
              disabled={updateSubscription.isPending}
            >
              <Save className="mr-2 h-5 w-5" />
              {updateSubscription.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubscription;
