import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserPreferences, useUpdateUserPreferences } from "@/hooks/useUserPreferences";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const steps = [
  {
    title: "Selamat Datang di LanggananKu! 🎉",
    description: "Kelola semua langganan Anda dengan mudah. Mari kita mulai dengan tour singkat!",
    image: "📱",
  },
  {
    title: "Tambah Langganan",
    description: "Gunakan tombol tengah di navigasi bawah untuk menambah langganan baru. Pilih dari saran pintar atau isi manual.",
    image: "➕",
  },
  {
    title: "Dashboard & Analitik",
    description: "Pantau pengeluaran bulanan Anda dan lihat analisis lengkap di halaman Dashboard dan Analytics.",
    image: "📊",
  },
  {
    title: "Notifikasi & Reminder",
    description: "Dapatkan pengingat sebelum tanggal pembayaran agar tidak ketinggalan!",
    image: "🔔",
  },
  {
    title: "Free Trial Tracker",
    description: "Lacak masa percobaan gratis agar tidak lupa membatalkan sebelum ditagih.",
    image: "⏰",
  },
  {
    title: "Siap Digunakan!",
    description: "Anda sudah siap! Mulai tambahkan langganan pertama Anda dan kelola dengan lebih baik.",
    image: "✅",
  },
];

export function OnboardingTutorial() {
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  const [currentStep, setCurrentStep] = useState(0);

  const handleComplete = () => {
    updatePreferences.mutate({ has_completed_onboarding: true });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!preferences || preferences.has_completed_onboarding) {
    return null;
  }

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={true} modal>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">{step.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center text-6xl">{step.image}</div>
          
          <p className="text-center text-muted-foreground">
            {step.description}
          </p>

          <Progress value={progress} className="w-full" />
          
          <div className="flex items-center justify-between gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
              size="sm"
            >
              Lewati
            </Button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Kembali
                </Button>
              )}
              
              <Button onClick={handleNext} size="sm">
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Selesai
                  </>
                ) : (
                  <>
                    Lanjut
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
