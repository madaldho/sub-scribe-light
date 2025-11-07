import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, LogIn, UserPlus } from "lucide-react";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Login Gagal",
            description: error.message === "Invalid login credentials" 
              ? "Email atau password salah"
              : error.message
          });
        } else {
          toast({
            title: "Login Berhasil!",
            description: "Selamat datang kembali"
          });
        }
      } else {
        if (!username.trim()) {
          toast({
            variant: "destructive",
            title: "Username diperlukan",
            description: "Silakan masukkan username"
          });
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password, username);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              variant: "destructive",
              title: "Email Sudah Terdaftar",
              description: "Gunakan email lain atau login"
            });
          } else {
            toast({
              variant: "destructive",
              title: "Registrasi Gagal",
              description: error.message
            });
          }
        } else {
          toast({
            title: "Registrasi Berhasil!",
            description: "Akun Anda telah dibuat"
          });
          // Auto-redirect will happen via auth state change
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="neumo-card p-3 rounded-2xl">
            <img 
              src={logoLight} 
              alt="LanggananKu" 
              className="h-10 w-10 object-contain dark:hidden"
            />
            <img 
              src={logoDark} 
              alt="LanggananKu" 
              className="h-10 w-10 object-contain hidden dark:block"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">LanggananKu</h1>
            <p className="text-sm text-foreground-muted">Kelola Langganan</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-12">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {isLogin ? "Selamat Datang" : "Mulai Sekarang"}
            </h2>
            <p className="text-foreground-muted">
              {isLogin 
                ? "Masuk ke akun Anda" 
                : "Buat akun baru untuk melanjutkan"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground-muted text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="neumo-input pl-12 h-14 text-base border-0 focus-visible:ring-primary"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground-muted text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neumo-input pl-12 h-14 text-base border-0 focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground-muted text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="neumo-input pl-12 h-14 text-base border-0 focus-visible:ring-primary"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="default"
              size="lg"
              className="w-full h-14 text-base font-semibold"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                  <span>{isLogin ? "Masuk" : "Daftar"}</span>
                </div>
              )}
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setUsername("");
                setEmail("");
                setPassword("");
              }}
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              {isLogin ? (
                <>
                  Belum punya akun?{" "}
                  <span className="text-primary font-semibold">Daftar</span>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <span className="text-primary font-semibold">Masuk</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-6 text-center">
        <p className="text-xs text-foreground-muted">
          Dengan melanjutkan, Anda menyetujui syarat & ketentuan kami
        </p>
      </div>
    </div>
  );
};

export default Auth;
