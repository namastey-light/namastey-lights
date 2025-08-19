-- Permit public writes for demo so admin panel works without auth
-- Categories
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;
CREATE POLICY "Anyone can insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete categories" ON public.categories FOR DELETE USING (true);

-- Products
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

-- Product images
DROP POLICY IF EXISTS "Authenticated users can manage product images" ON public.product_images;
CREATE POLICY "Anyone can insert product images" ON public.product_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update product images" ON public.product_images FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete product images" ON public.product_images FOR DELETE USING (true);