-- Add payment method column to orders table
ALTER TABLE public.orders 
ADD COLUMN payment_method TEXT DEFAULT 'cod';

-- Add payment method column to custom_neon_orders table  
ALTER TABLE public.custom_neon_orders 
ADD COLUMN payment_method TEXT DEFAULT 'cod';