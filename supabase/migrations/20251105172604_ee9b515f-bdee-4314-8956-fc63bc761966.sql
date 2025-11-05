-- Drop the existing trigger
DROP TRIGGER IF EXISTS log_subscription_changes ON subscriptions;

-- Update the function to NOT log deletions (let CASCADE handle cleanup)
CREATE OR REPLACE FUNCTION public.log_subscription_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.subscription_audit_log (subscription_id, user_id, action, changes)
    VALUES (NEW.id, NEW.user_id, 'created', to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.subscription_audit_log (subscription_id, user_id, action, changes)
    VALUES (NEW.id, NEW.user_id, 'updated', jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ));
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    -- Don't insert audit log for delete, let CASCADE handle it
    RETURN OLD;
  END IF;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER log_subscription_changes
  BEFORE INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION log_subscription_change();