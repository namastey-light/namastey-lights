-- Drop existing policies
DROP POLICY IF EXISTS "Public can view bestselling products" ON public.bestselling_products;
DROP POLICY IF EXISTS "Admins can manage bestselling products" ON public.bestselling_products;

-- Create corrected policies with proper WITH CHECK clauses
CREATE POLICY "Public can view bestselling products" 
ON public.bestselling_products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert bestselling products" 
ON public.bestselling_products 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update bestselling products" 
ON public.bestselling_products 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete bestselling products" 
ON public.bestselling_products 
FOR DELETE 
USING (is_admin());