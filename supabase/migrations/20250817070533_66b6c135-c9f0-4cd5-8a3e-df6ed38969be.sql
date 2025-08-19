-- Temporarily disable RLS to test if the issue is with the policies
ALTER TABLE public.bestselling_products DISABLE ROW LEVEL SECURITY;

-- Test if basic insert works without RLS
-- We'll re-enable it after debugging