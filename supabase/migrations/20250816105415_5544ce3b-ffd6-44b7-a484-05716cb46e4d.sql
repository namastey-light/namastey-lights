-- Allow guest checkout: public inserts for orders and order_items
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
DROP POLICY IF EXISTS "Public can create order items" ON public.order_items;

-- Orders: permit INSERT to anyone (keep admin SELECT/UPDATE as-is)
CREATE POLICY "Public can create orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

-- Order Items: permit INSERT to anyone
CREATE POLICY "Public can create order items"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (true);