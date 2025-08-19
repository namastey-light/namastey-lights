-- Create a function to set up admin user after they sign up
CREATE OR REPLACE FUNCTION public.handle_admin_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this email exists in admin_users table
  IF EXISTS (SELECT 1 FROM public.admin_users WHERE email = NEW.email) THEN
    -- Update the admin_users table with the auth user ID
    UPDATE public.admin_users 
    SET id = NEW.id 
    WHERE email = NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;