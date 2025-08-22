import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import NeonText from '@/components/ui/NeonText';
import NeonCard from '@/components/ui/NeonCard';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Zap, 
  Star, 
  Shield, 
  Truck, 
  Award,
  Plus,
  Minus,
  MessageCircle
} from 'lucide-react';
import { Product, getDisplayPrice, getDisplayMRP, getSizeDisplay } from '@/types/product';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('Blue');
  const [hasDimmer, setHasDimmer] = useState(false);
  const [backingShape, setBackingShape] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchSimilarProducts();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          product_images (id, image_url, alt_text, display_order)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive"
        });
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const productImages = product.product_images?.length > 0 
    ? product.product_images.map(img => img.image_url)
    : ['/placeholder.svg'];

  const primaryImage = product.product_images?.[0]?.image_url || '/placeholder.svg';

  const colors = [
    { id: 'Blue', name: 'Blue', hex: '#00bfff' },
    { id: 'Pink', name: 'Pink', hex: '#ff1493' },
    { id: 'Purple', name: 'Purple', hex: '#9945ff' },
    { id: 'White', name: 'White', hex: '#ffffff' },
    { id: 'Red', name: 'Red', hex: '#ff0000' },
    { id: 'Green', name: 'Green', hex: '#00ff00' },
    { id: 'Yellow', name: 'Yellow', hex: '#ffff00' },
    { id: 'Orange', name: 'Orange', hex: '#ffa500' },
  ];

  const calculatePrice = () => {
    let basePrice = getDisplayPrice(product);
    const dimmerPrice = hasDimmer ? 200 : 0;
    return basePrice + dimmerPrice;
  };

  const calculateMRP = () => {
    return getDisplayMRP(product);
  };

  const handleAddToCart = () => {
    const finalPrice = calculatePrice();
    
    addItem({
      id: `${product.id}-${selectedColor}-${hasDimmer}-${Date.now()}`,
      name: `${product.name}`,
      price: finalPrice,
      image: primaryImage,
      type: 'product',
      productConfig: {
        size: getSizeDisplay(product),
        color: selectedColor,
        brightnessController: hasDimmer,
        productType: backingShape,
        originalProductId: product.id
      }
    });

    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
  };



  const fetchSimilarProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          product_images (id, image_url, alt_text, display_order)
        `)
        .eq('is_active', true)
        .neq('id', product.id)
        .limit(3);

      if (!error && data) {
        setSimilarProducts(data);
      }
    } catch (error) {
      console.error('Error fetching similar products:', error);
    }
  };

  return (
    <div className="min-h-screen pt-8 bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-0 h-auto font-normal"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <span>/</span>
          <Link to="/products" className="hover:text-neon-blue transition-colors">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative p-0.5 rounded-3xl overflow-hidden"
                 style={{
                   background: `linear-gradient(135deg, 
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6),
                     hsl(var(--neon-white) / 0.6)
                   )`
                 }}>
              <div className="aspect-square bg-muted rounded-3xl overflow-hidden">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {productImages.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative p-0.5 rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImageIndex === index ? 'scale-105' : 'hover:scale-105'
                    }`}
                    style={{
                      background: selectedImageIndex === index 
                        ? `linear-gradient(135deg, hsl(var(--neon-white) / 0.8), hsl(var(--neon-white) / 0.8))`
                        : `linear-gradient(135deg, hsl(var(--border)), hsl(var(--border)))`
                    }}
                  >
                    <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-neon-white/20 text-neon-white">
                  {product.categories?.name || 'Neon Signs'}
                </Badge>
                {product.stock_quantity > 0 && (
                  <Badge className="bg-green-500/20 text-green-500">
                    In Stock
                  </Badge>
                )}
              </div>
              
              <h1 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 bg-gradient-to-r from-neon-white via-neon-white to-neon-white bg-clip-text text-transparent">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.review_count} reviews)
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="font-bold text-3xl text-neon-white">
                  ₹{calculatePrice().toLocaleString()}
                </span>
                {calculateMRP() && calculateMRP() > calculatePrice() && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{calculateMRP().toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description || `Fancoelite® Neon Signs can be in multiple sizes, can last 50,000+ hours, custom made with quality Neon LED Lights. Choose from a wide range of colours like Red, Pink, Blue, Ice Blue, Orange, White, Warm White, Purple, Yellow! Customise Neon Signs with your name, word, letter, logo or quote. Install it on a wall of bedroom, balcony, hall, terrace, office space or workspace.`}
              </p>

              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Size(inches): {getSizeDisplay(product)}</p>
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-6">


              {/* <div>
                <label className="block text-sm font-medium mb-3">Type <span className="text-red-500">*</span></label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="type"
                      value="Standard"
                      checked={backingShape === 'Standard'}
                      onChange={(e) => setBackingShape(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Standard</span>
                  </label>
                </div>
              </div> */}

              <div>
                <label className="block text-sm font-medium mb-3">Addons</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={hasDimmer}
                        onCheckedChange={(checked) => setHasDimmer(checked === true)}
                      />
                      <span>Add Brightness Controller</span>
                    </div>
                    <span className="text-neon-white font-medium">₹200</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full font-semibold py-3 text-lg rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--neon-white)), hsl(var(--neon-white)))',
                  color: 'hsl(var(--background))',
                  boxShadow: '0 0 20px hsl(var(--neonwhite) / 0.4)'
                }}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <Shield className="w-6 h-6 text-neon-white mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">12 Month Warranty</p>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 text-neon-white mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="text-center">
                <Award className="w-6 h-6 text-neon-white mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Premium Quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Your Neon Sign */}
        <div className="mb-16">
          <div>
            <h3 className="font-rajdhani font-semibold text-2xl mb-6 text-neon-white">
              About Your Neon Sign:
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Neon Attack's neon signs are handcrafted with advanced 2nd gen LED on high-quality 6MM transparent acrylic. 
              Energy-efficient, durable, and easy to install—perfect for any space!
            </p>

            {/* LED Neon Strip Image and Description */}
            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h4 className="font-orbitron font-bold text-xl mb-4 text-neon-pink">
                    Meet 2nd Gen LED Neon - 2X Brighter & Built to Last!
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Our revolutionary 2nd Gen LED Neon is twice as bright, 80% more energy-efficient, and built to 
                    outlast the rest. Plus, with adjustable brightness controls, and the option for waterproof durability, 
                    this is the ultimate neon upgrade you've been waiting for!
                  </p>
                  <p className="text-muted-foreground">
                    Say goodbye to dull, outdated neon—this is the future!
                  </p>
                </div>
                <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                  <img
                    src="\lovable-uploads\1755593981887.png"
                    alt="2nd Gen LED Neon Strip"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* The Box Contains */}
            <div className="mb-8">
              <h4 className="font-rajdhani font-semibold text-xl mb-4 text-neon-white">
                The Box Contains:
              </h4>
              <p className="text-muted-foreground mb-6">
                Our neon lights are ready to shine straight from the box!
              </p>
              <p className="text-muted-foreground">
                Each sign is mounted on clear acrylic for support and comes with pre-drilled holes. Stainless steel mounting 
                screws are included, making wall installation quick and easy.
              </p>
            </div>

            {/* Installation Guide */}
            <div>
              <h4 className="font-rajdhani font-semibold text-xl mb-6 text-neon-white">
                Here's how you can install our neon signs on your wall:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: 1,
                    title: "Take a measuring tape and mark out the position of your neon sign.",
                    image: "/lovable-uploads/AdobeStock_535119941_1_2.jpg"
                  },
                  {
                    step: 2,
                    title: "Safely Drill small holes on the wall.",
                    image: "/lovable-uploads/Rectangle_26311_1.jpg"
                  },
                  {
                    step: 3,
                    title: "Use the SS mounting screws to mount your neon sign on the wall.",
                    image: "/lovable-uploads/AdobeStock_1271062131_1_1.jpg"
                  },
                  {
                    step: 4,
                    title: "Connect the power adapter to the transparent cable and your sign is ready!",
                    image: "/lovable-uploads/AdobeStock_981467593_1_2.jpg"
                  }
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="aspect-square bg-muted rounded-xl mb-4 overflow-hidden">
                      <img
                        src={item.image}
                        alt={`Step ${item.step}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Similar Products */}
        <div className="mb-16">
          <h2 className="font-orbitron font-bold text-3xl mb-8 text-center">
            Similar <NeonText color="pink">Products</NeonText>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProducts.map((item) => {
              const itemPrimaryImage = item.product_images?.[0]?.image_url || '/placeholder.svg';
              
              return (
                <NeonCard key={item.id} className="group cursor-pointer">
                  <Link to={`/products/${item.id}`}>
                    <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                      <img
                        src={itemPrimaryImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <h3 className="font-rajdhani font-semibold text-lg mb-2 group-hover:text-neon-white transition-colors">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xl text-neon-white">
                        ₹{getDisplayPrice(item).toLocaleString()}
                      </span>
                      {getDisplayMRP(item) && getDisplayMRP(item) > getDisplayPrice(item) && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{getDisplayMRP(item).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>
                </NeonCard>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="font-orbitron font-bold text-3xl mb-8 text-center">
            FAQ
          </h2>
          <div className="space-y-4">
            {[
              { question: "How much does a customized neon sign cost?", answer: "Pricing varies based on size and customization options." },
              { question: "How long will it take to deliver my neon sign?", answer: "Standard delivery takes 7-10 business days." },
              { question: "If I customize a sign using the online neon sign maker, what will be its exact size?", answer: "The exact dimensions will be provided before finalizing your order." },
              { question: "Does the neon sign buzz?", answer: "No, our LED neon signs are completely silent." },
              { question: "Can you have quality LED neon signs without the cords?", answer: "Yes, we offer battery-powered options for cord-free installation." },
              { question: "I have my own design/logo. Can I get it customised into a neon sign?", answer: "Absolutely! We can create custom designs from your artwork." },
              { question: "Can you do a rush order?", answer: "Yes, rush orders are available for an additional fee." },
              { question: "What are the small marks on my sign?", answer: "These are cutting marks and are normal for LED neon strips." }
            ].map((faq, index) => (
              <div key={index} className="border-b border-white/10 pb-4">
                <h4 className="font-medium text-lg mb-2">{faq.question}</h4>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ProductDetail;