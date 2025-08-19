-- Add MRP (original price) field to products table
ALTER TABLE public.products 
ADD COLUMN mrp numeric;