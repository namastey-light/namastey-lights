-- Allow public read access so Admin UI works in demo mode
-- Orders
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders"
ON public.orders
FOR SELECT
TO public
USING (true);

-- Order Items
DROP POLICY IF EXISTS "Public can view order items" ON public.order_items;
CREATE POLICY "Public can view order items"
ON public.order_items
FOR SELECT
TO public
USING (true);