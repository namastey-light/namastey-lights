-- Create admin users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own data
CREATE POLICY "Admin users can view their own data" ON public.admin_users 
FOR SELECT USING (auth.uid()::text = id::text);

-- Insert default admin user (you can change email and username)
-- The actual auth will be handled by Supabase Auth
INSERT INTO public.admin_users (email, username) VALUES 
('admin@yourdomain.com', 'admin');