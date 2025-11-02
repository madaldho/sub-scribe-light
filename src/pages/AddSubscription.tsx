import { useState, FormEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Lightbulb, PenLine, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useAddSubscription } from "@/hooks/useSubscriptions";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { toast } from "sonner";
import { ServiceSuggestions } from "@/components/subscriptions/ServiceSuggestions";
import { LogoUploader } from "@/components/subscriptions/LogoUploader";
import { calculateNextBillingDate, formatBillingCycle, type BillingCycle } from "@/lib/dateUtils";

const AddSubscription = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choose" | "smart" | "manual">("choose");
  const [period, setPeriod] = useState<BillingCycle>("monthly");
  const [autoRenew, setAutoRenew] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const addSubscription = useAddSubscription();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const formFieldsRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to form fields when service is selected
  useEffect(() => {
    if (serviceName && formFieldsRef.current) {
      setTimeout(() => {
        formFieldsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }, 100);
    }
  }, [serviceName]);

  

  // Format number with thousand separator
  const formatNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    return parseInt(numbers).toLocaleString('id-ID');
  };

  // Parse formatted number to float
  const parseFormattedNumber = (value: string) => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setPriceDisplay(formatted);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get("name") as string;
    const description = formData.get("package") as string;
    const price = parseFormattedNumber(priceDisplay);
    const currency = (formData.get("currency") as string) || "IDR";
    const startDate = formData.get("startDate") as string;
    const category = (formData.get("category") as string) || "lainnya";
    const notes = formData.get("notes") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    
    console.log("Form data:", { name, period, startDate, isTrial });
    const { nextBillingDate } = calculateNextBillingDate(startDate, period);
    console.log("Calculated next billing date:", nextBillingDate, "for period:", period);

    // Validate required fields
    if (!name.trim()) {
      toast.error("Nama layanan harus diisi");
      return;
    }
    
    if (!price || price <= 0) {
      toast.error("Harga harus lebih dari 0");
      return;
    }
    
    if (!startDate) {
      toast.error("Tanggal mulai harus diisi");
      return;
    }

    const subscriptionData = {
      name,
      description: description || null,
      price: Number(price),
      currency: currency || "IDR",
      billing_cycle: period,
      start_date: startDate,
      next_billing_date: nextBillingDate,
      category: category || "lainnya",
      notes: notes || null,
      status: isTrial ? 'trial' : 'active',
      logo_url: logoUrl || null,
      payment_method: paymentMethod || null,
      auto_renew: autoRenew,
      last_payment_date: isTrial ? null : startDate,
      is_trial: isTrial,
      trial_end_date: isTrial ? trialEndDate : null,
    };

    console.log("Submitting subscription data:", subscriptionData);

    addSubscription.mutate(subscriptionData, {
      onSuccess: () => {
        toast.success("Langganan berhasil ditambahkan!");
        navigate("/subscriptions");
      },
      onError: (error: any) => {
        console.error("Failed to add subscription:", error);
        toast.error(error.message || "Gagal menambahkan langganan");
      }
    });
  };

  const renderFormFields = () => (
    <>
      {/* Package */}
      <div className="space-y-2">
        <Label htmlFor="package" className="text-foreground">
          Paket/Level
        </Label>
        <Input
          id="package"
          name="package"
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
            name="price"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={priceDisplay}
            onChange={handlePriceChange}
            className="neumo-input h-12 border-0 focus-visible:ring-primary"
            required
          />
          {priceDisplay && (
            <p className="text-xs text-muted-foreground">
              Harga: {priceDisplay}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-foreground">
            Mata Uang
          </Label>
          <Input
            id="currency"
            name="currency"
            defaultValue="IDR"
            className="neumo-input h-12 border-0 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Billing Period */}
      <div className="space-y-3">
        <Label className="text-foreground">Periode Pembayaran</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "daily", label: "Harian" },
            { value: "weekly", label: "Mingguan" },
            { value: "monthly", label: "Bulanan" },
            { value: "yearly", label: "Tahunan" }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className={`neumo-card p-4 rounded-xl cursor-pointer transition-all text-center ${
                period === option.value
                  ? "border-2 border-primary bg-primary/5 shadow-[0_0_20px_rgba(142,192,165,0.3)]"
                  : "border-2 border-transparent hover:border-primary/30"
              }`}
              onClick={() => {
                console.log("Selected period:", option.value);
                setPeriod(option.value as BillingCycle);
              }}
            >
              <span className="text-foreground font-medium">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-foreground">
          Tanggal Mulai
        </Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          defaultValue={new Date().toISOString().split('T')[0]}
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
          name="category"
          placeholder="contoh: Entertainment, Development"
          defaultValue="lainnya"
          className="neumo-input h-12 border-0 focus-visible:ring-primary"
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="paymentMethod" className="text-foreground">
            Metode Pembayaran (Opsional)
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
            className="h-6 px-2 text-xs gap-1"
          >
            <SettingsIcon className="h-3 w-3" />
            Kelola
          </Button>
        </div>
        <Select name="paymentMethod">
          <SelectTrigger className="neumo-input h-12 border-0">
            <SelectValue placeholder="Pilih metode pembayaran" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
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
            required={isTrial}
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
          name="notes"
          placeholder="Tambahkan catatan untuk langganan ini..."
          className="neumo-input min-h-24 border-0 focus-visible:ring-primary resize-none"
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Tambah Langganan
          </h1>
          <p className="text-muted-foreground">
            Isi detail langganan baru Anda
          </p>
        </header>

        {/* Mode Selection */}
        {mode === "choose" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card
              className="p-6 md:p-8 cursor-pointer border-2 border-border hover:border-primary transition-all group text-center"
              onClick={() => setMode("smart")}
            >
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-foreground mb-2">Saran Pintar</h3>
              <p className="text-sm text-muted-foreground">
                Pilih dari layanan populer dengan logo otomatis
              </p>
            </Card>

            <Card
              className="p-6 md:p-8 cursor-pointer border-2 border-border hover:border-primary transition-all group text-center"
              onClick={() => setMode("manual")}
            >
              <PenLine className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-foreground mb-2">Isi Manual</h3>
              <p className="text-sm text-muted-foreground">
                Tambahkan langganan kustom dengan detail sendiri
              </p>
            </Card>
          </div>
        )}

        {/* Smart Suggestions Mode */}
        {mode === "smart" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="neumo-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Pilih Layanan</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode("choose")}
                >
                  Kembali
                </Button>
              </div>
              <ServiceSuggestions 
                onSelect={(service) => {
                  setServiceName(service.name);
                  setLogoUrl(service.logo);
                  const categoryInput = document.getElementById('category') as HTMLInputElement;
                  if (categoryInput) categoryInput.value = service.category;
                }}
              />
            </div>

            {serviceName && (
              <>
                <div ref={formFieldsRef} className="neumo-card p-4 md:p-6 space-y-6 scroll-mt-6">
                  {/* Service Name (readonly after selection) */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Nama Layanan
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={serviceName}
                      readOnly
                      className="neumo-input h-12 border-0 focus-visible:ring-primary bg-muted"
                    />
                  </div>

                  {renderFormFields()}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pb-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setServiceName("");
                      setLogoUrl("");
                      setMode("choose");
                    }}
                    className="flex-1 h-12 md:h-14"
                    disabled={addSubscription.isPending}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 md:h-14"
                    disabled={addSubscription.isPending}
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {addSubscription.isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Manual Mode */}
        {mode === "manual" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="neumo-card p-4 md:p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Form Manual</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode("choose")}
                >
                  Kembali
                </Button>
              </div>

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
                  name="name"
                  placeholder="contoh: Netflix, Spotify"
                  className="neumo-input h-12 border-0 focus-visible:ring-primary"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>

              {renderFormFields()}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setServiceName("");
                  setLogoUrl("");
                  setMode("choose");
                }}
                className="flex-1 h-12 md:h-14"
                disabled={addSubscription.isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 md:h-14"
                disabled={addSubscription.isPending}
              >
                <Save className="mr-2 h-5 w-5" />
                {addSubscription.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddSubscription;
