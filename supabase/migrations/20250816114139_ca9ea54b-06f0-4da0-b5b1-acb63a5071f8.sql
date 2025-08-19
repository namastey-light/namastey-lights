-- Add size-specific pricing columns to products table
ALTER TABLE public.products 
DROP COLUMN IF EXISTS mrp,
DROP COLUMN IF EXISTS price;

-- Add pricing columns for each size
ALTER TABLE public.products 
ADD COLUMN small_mrp numeric,
ADD COLUMN small_price numeric,
ADD COLUMN medium_mrp numeric,
ADD COLUMN medium_price numeric,
ADD COLUMN large_mrp numeric,
ADD COLUMN large_price numeric,
ADD COLUMN extra_large_mrp numeric,
ADD COLUMN extra_large_price numeric;