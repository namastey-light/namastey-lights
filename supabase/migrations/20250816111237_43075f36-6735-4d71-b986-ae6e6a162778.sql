-- Add product image and configuration columns to order_items table
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS product_image TEXT,
ADD COLUMN IF NOT EXISTS product_config JSONB;