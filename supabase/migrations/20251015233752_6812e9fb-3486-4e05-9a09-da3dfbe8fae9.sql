-- Update profiles table untuk subscription management app
-- Drop kolom yang tidak diperlukan dari app sebelumnya
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS level,
DROP COLUMN IF EXISTS total_xp,
DROP COLUMN IF EXISTS current_streak,
DROP COLUMN IF EXISTS longest_streak,
DROP COLUMN IF EXISTS adventure_theme,
DROP COLUMN IF EXISTS ai_personality;

-- Tambah kolom untuk subscription management preferences
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'IDR' NOT NULL,
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Asia/Jakarta',
ADD COLUMN IF NOT EXISTS date_format text DEFAULT 'DD/MM/YYYY',
ADD COLUMN IF NOT EXISTS theme text DEFAULT 'dark';

-- Update trigger function untuk handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username, currency, timezone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'IDR',
    'Asia/Jakarta'
  );
  RETURN NEW;
END;
$function$;

-- Pastikan trigger sudah ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();