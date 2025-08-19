-- Add delivery_fee and subtotal columns to orders table for proper price breakdown
ALTER TABLE public.orders 
ADD COLUMN delivery_fee numeric DEFAULT 0,
ADD COLUMN subtotal numeric DEFAULT 0;