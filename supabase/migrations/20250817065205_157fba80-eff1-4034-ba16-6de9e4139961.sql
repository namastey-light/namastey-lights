-- Create bestselling_products table to manage featured products on home page
CREATE TABLE public.bestselling_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  badge_text TEXT NOT NULL DEFAULT 'Bestseller',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_bestselling_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT unique_product_bestseller UNIQUE (product_id)
);

-- Enable Row Level Security
ALTER TABLE public.bestselling_products ENABLE ROW LEVEL SECURITY;

-- Create policies for bestselling products
CREATE POLICY "Public can view bestselling products" 
ON public.bestselling_products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage bestselling products" 
ON public.bestselling_products 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bestselling_products_updated_at
BEFORE UPDATE ON public.bestselling_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_bestselling_products_display_order ON public.bestselling_products(display_order, is_active);
CREATE INDEX idx_bestselling_products_active ON public.bestselling_products(is_active);