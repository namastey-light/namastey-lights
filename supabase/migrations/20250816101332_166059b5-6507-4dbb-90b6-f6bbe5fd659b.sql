-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Allow anonymous read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Allow anonymous read access to products" ON public.products;
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON public.product_images;
DROP POLICY IF EXISTS "Allow anonymous read access to product images" ON public.product_images;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Order items are viewable by order owner" ON public.order_items;
DROP POLICY IF EXISTS "Order items can be created with orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

-- Create simple policies for demo purposes
-- Allow public read access to categories, products, and images
CREATE POLICY "Public can read categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Public can read products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Public can read product images" 
ON public.product_images 
FOR SELECT 
USING (true);

-- Allow authenticated users full access for admin demo
CREATE POLICY "Authenticated users can manage categories" 
ON public.categories 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage products" 
ON public.products 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage product images" 
ON public.product_images 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage orders" 
ON public.orders 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage order items" 
ON public.order_items 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own profile" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- Allow public profile reads for general access
CREATE POLICY "Public can read profiles" 
ON public.profiles 
FOR SELECT 
USING (true);