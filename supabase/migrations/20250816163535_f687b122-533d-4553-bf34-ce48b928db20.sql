-- Create custom neon orders table
CREATE TABLE public.custom_neon_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  
  -- Customization details
  custom_text TEXT NOT NULL,
  font_style TEXT NOT NULL DEFAULT 'orbitron',
  neon_color TEXT NOT NULL DEFAULT 'pink',
  size TEXT NOT NULL DEFAULT 'M',
  has_dimmer BOOLEAN NOT NULL DEFAULT false,
  backing_shape TEXT NOT NULL DEFAULT 'cut-to-shape',
  
  -- Pricing
  base_price NUMERIC NOT NULL,
  dimmer_price NUMERIC DEFAULT 0,
  backing_price NUMERIC DEFAULT 0,
  character_price NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  
  -- Order status
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  
  -- Preview image (will be generated)
  preview_image_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.custom_neon_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for custom neon orders
CREATE POLICY "Public can create custom neon orders" 
ON public.custom_neon_orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view custom neon orders" 
ON public.custom_neon_orders 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage custom neon orders" 
ON public.custom_neon_orders 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_custom_neon_orders_updated_at
BEFORE UPDATE ON public.custom_neon_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_neon_orders;