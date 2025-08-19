-- Create an admin user account
-- First, let's create a test admin user directly in the auth.users table
-- Since we can't directly insert into auth.users, we'll create a function to help set up admin accounts

-- Create a function to make a user admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET is_admin = true 
  WHERE user_id = (
    SELECT id FROM auth.users WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.make_user_admin(text) TO authenticated;

-- Create an RPC function to check admin status
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = $1 AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;