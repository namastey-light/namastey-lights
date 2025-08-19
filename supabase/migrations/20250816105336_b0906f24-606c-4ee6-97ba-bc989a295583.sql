-- Allow guest checkout: public inserts for orders and order_items
-- Orders: permit INSERT to anyone (keep admin SELECT/UPDATE as-is)
CREATE POLICY IF NOT EXISTS "Public can create orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

-- Order Items: permit INSERT to anyone
CREATE POLICY IF NOT EXISTS "Public can create order items"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (true);