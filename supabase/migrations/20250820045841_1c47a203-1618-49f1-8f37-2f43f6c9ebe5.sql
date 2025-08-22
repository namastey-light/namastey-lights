-- Add rating and review count fields to products table
ALTER TABLE public.products 
ADD COLUMN rating DECIMAL(2,1) DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN review_count INTEGER DEFAULT 0 CHECK (review_count >= 0);