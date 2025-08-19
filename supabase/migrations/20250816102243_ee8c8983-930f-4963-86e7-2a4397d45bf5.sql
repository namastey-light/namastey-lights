-- Drop conflicting policies that might be causing issues
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;

-- Keep only the simple policies that work
-- The "Authenticated users can manage categories" policy should be sufficient