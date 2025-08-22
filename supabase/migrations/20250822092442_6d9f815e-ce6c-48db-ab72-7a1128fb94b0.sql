-- Remove size-specific pricing columns and add single size/price columns
ALTER TABLE public.products 
DROP COLUMN IF EXISTS small_price,
DROP COLUMN IF EXISTS small_mrp,
DROP COLUMN IF EXISTS medium_price,
DROP COLUMN IF EXISTS medium_mrp,
DROP COLUMN IF EXISTS large_price,
DROP COLUMN IF EXISTS large_mrp,
DROP COLUMN IF EXISTS extra_large_price,
DROP COLUMN IF EXISTS extra_large_mrp;

-- Add single size and pricing columns
ALTER TABLE public.products 
ADD COLUMN width_inches NUMERIC,
ADD COLUMN height_inches NUMERIC,
ADD COLUMN mrp NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN selling_price NUMERIC NOT NULL DEFAULT 0;