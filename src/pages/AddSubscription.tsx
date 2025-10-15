import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const AddSubscription = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("monthly");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Langganan berhasil ditambahkan!");
    navigate("/subscriptions");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="neumo-card neumo-card-hover rounded-xl mb-4 border-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Tambah Langganan
          </h1>
          <p className="text-foreground-muted">
            Isi detail langganan baru Anda
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="neumo-card p-6 space-y-6">
            {/* Service Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nama Layanan
              </Label>
              <Input
                id="name"
                placeholder="contoh: Netflix, Spotify"
                className="neumo-input h-12 border-0 focus-visible:ring-primary"
                required
              />
            </div>

            {/* Package */}
            <div className="space-y-2">
              <Label htmlFor="package" className="text-foreground">
                Paket/Level
              </Label>
              <Input
                id="package"
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
                  placeholder="0"
                  className="neumo-input h-12 border-0 focus-visible:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-foreground">
                  Mata Uang
                </Label>
                <Input
                  id="currency"
                  defaultValue="Rp"
                  className="neumo-input h-12 border-0 focus-visible:ring-primary"
                />
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
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      onClick={() => setPeriod(option.value)}
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
                placeholder="contoh: Entertainment, Development"
                className="neumo-input h-12 border-0 focus-visible:ring-primary"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground">
                Catatan (Opsional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Tambahkan catatan untuk langganan ini..."
                className="neumo-input min-h-24 border-0 focus-visible:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="neumo-card neumo-card-hover flex-1 h-14 rounded-2xl border-0"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="neumo-card neumo-card-hover flex-1 h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="mr-2 h-5 w-5" />
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscription;
