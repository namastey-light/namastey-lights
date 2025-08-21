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
import { Product, getDisplayPrice, getDisplayMRP, getPriceBySize, getMRPBySize } from '@/types/product';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
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

  const sizes = [
    { id: 'S', name: 'Small', width: '0.5ft width × 0.5ft height', price: getPriceBySize(product, 'small') },
    { id: 'M', name: 'Medium', width: '1ft width × 1ft height', price: getPriceBySize(product, 'medium') },
    { id: 'L', name: 'Large', width: '1.5ft width × 1.5ft height', price: getPriceBySize(product, 'large') },
  ];

  const colors = [
    { id: 'blue', name: 'Ice Blue', class: 'neon-text-blue', hex: '#00bfff' },
    { id: 'pink', name: 'Pink', class: 'neon-text-pink', hex: '#ff1493' },
    { id: 'purple', name: 'Purple', class: 'neon-text-purple', hex: '#9945ff' },
    { id: 'white', name: 'White', class: 'neon-text-white', hex: '#ffffff' },
    { id: 'red', name: 'Red', class: 'neon-text-red', hex: '#ff0000' },
    { id: 'green', name: 'Green', class: 'neon-text-green', hex: '#00ff00' },
    { id: 'yellow', name: 'Yellow', class: 'neon-text-yellow', hex: '#ffff00' },
    { id: 'orange', name: 'Orange', class: 'neon-text-white', hex: '#f5f5dc' },
    { id: 'navy', name: 'Navy Blue', class: 'neon-text-navy', hex: '#000080' },
    { id: 'warm-white', name: 'Warm White', class: 'neon-text-warm-white', hex: '#fdf6e3' },
  ];

  const calculatePrice = () => {
    const selectedSizeData = sizes.find(s => s.id === selectedSize);
    let basePrice = selectedSizeData?.price || getDisplayPrice(product);

    const dimmerPrice = hasDimmer ? 500 : 0;

    return basePrice + dimmerPrice;
  };

  const calculateMRP = () => {
    const sizeMapping = { S: 'small', M: 'medium', L: 'large', XL: 'extra_large' } as const;
    const size = sizeMapping[selectedSize as keyof typeof sizeMapping] || 'medium';
    return getMRPBySize(product, size);
  };

  const handleAddToCart = () => {
    const finalPrice = calculatePrice();
    const selectedSizeData = sizes.find(s => s.id === selectedSize);

    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}-${hasDimmer}-${Date.now()}`,
      name: `${product.name} (${selectedSizeData?.name})`,
      price: finalPrice,
      image: primaryImage,
      type: 'product',
      productConfig: {
        size: selectedSize,
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
          <Link to="/products" className="hover:text-neon-white transition-colors">Products</Link>
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
                    className={`relative p-0.5 rounded-2xl overflow-hidden transition-all duration-300 ${selectedImageIndex === index ? 'scale-105' : 'hover:scale-105'
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
                <Badge className="bg-gray-900/20 text-neon-white">
                  {product.categories?.name || 'Neon Signs'}
                </Badge>
                {product.stock_quantity > 0 && (
                  <Badge className="bg-green-500/20 text-green-500">
                    In Stock
                  </Badge>
                )}
              </div>

              <h1 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 bg-gradient-to-r from-neon-white via-neon-white to-blue-400 bg-clip-text text-transparent">
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



              <p className="subtitle-cursive text-l leading-relaxed mb-6">
                {product.description || `Fancoelite® Neon Signs can be in multiple sizes, can last 50,000+ hours, custom made with quality Neon LED Lights. Choose from a wide range of colours like Red, Pink, Blue, Ice Blue, Orange, White, Warm White, Purple, Yellow! Customise Neon Signs with your name, word, letter, logo or quote. Install it on a wall of bedroom, balcony, hall, terrace, office space or workspace.`}
              </p>

              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Size: 0.5ft width × 0.5ft height</p>
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Size</label>
                <div className="grid grid-cols-2 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${selectedSize === size.id
                          ? 'border-neon-white bg-neon-white/10'
                          : 'border-border hover:border-muted-foreground'
                        }`}
                    >
                      <div className="font-medium">{size.name}</div>
                      <div className="text-sm text-muted-foreground">{size.width}</div>
                      <div className="text-sm text-neon-white">₹{size.price.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Color <span className="text-red-500">*</span></label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Addons</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={hasDimmer}
                        onCheckedChange={(checked) => setHasDimmer(checked === true)}
                      />
                      <span>Brightness Controller</span>
                    </div>
                    <span className="text-neon-white font-medium">₹500</span>
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
                  boxShadow: '0 0 20px hsl(var(--neon-white) / 0.4)'
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
          <NeonCard>
            <h3 className="font-rajdhani font-semibold text-2xl mb-6 text-neon-white">
              About Your Neon Sign:
            </h3>
            <p className="subtitle-cursive text-xl leading-relaxed mb-8">
              Every Namastey Lights sign is built on 6MM clear acrylic with advanced LEDs that shine bright while saving energy. Strong, lightweight, and hassle-free to install—perfect to vibe up your space!
            </p>

            {/* LED Neon Strip Image and Description */}
            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h4 className="font-orbitron font-bold text-xl mb-4 text-neon-pink">
                    🚀 2nd Gen LED Neon is here – Brighter than ever, tough as always!
                  </h4>
                  <p className="subtitle-cursive text-xl mb-4">
                    Light it up smarter! Our 2nd Gen LED Neon gives you double the shine, saves energy, and lasts way longer. Control the glow to match your mood, and even go waterproof for the perfect indoor-outdoor vibe.
                  </p>
                  <p className="subtitle-cursive text-l">
                    No more boring, faded neon—this is where the future shines.
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
              <p className="subtitle-cursive text-xl mb-6">
                From package to wall in minutes — let your space glow instantly.
              </p>
              <p className="subtitle-cursive text-xl">
                Strong acrylic backing, precision-drilled holes, and stainless steel screws included — because hanging your neon should be as easy as switching it on.
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
                    <p className="subtitle-cursive text-sm">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </NeonCard>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="font-orbitron font-bold text-3xl mb-8 text-center">
            FAQ
          </h2>
          <div className="space-y-4">
            {[
              { question: "How much does a custom neon sign cost?", answer: "The price depends on the size, style, and design details you choose." },
              { question: "How long does delivery usually take?", answer: "Most orders arrive within 7–10 business days after confirmation." },
              { question: "What size will my customized neon sign be?", answer: "You’ll receive the exact dimensions before we finalize your order." },
              { question: "Do LED neon signs make noise?", answer: "Nope! Our LED neon signs are 100% silent and buzz-free." },
              { question: "Can I get a neon sign without visible cords?", answer: "Yes, we also offer battery-powered models for a clean, cord-free look." },
              { question: "Can you make a neon sign from my logo or design?", answer: "Absolutely! Share your artwork and we’ll bring it to life in neon." },
              { question: "Do you accept urgent/rush orders?", answer: "Yes, we can fast-track production for an additional charge." },
              { question: "Why are there tiny marks on my sign?", answer: "Those are normal cutting marks from LED tubing and don’t affect quality." }
            ].map((faq, index) => (
              <div key={index} className="border-b border-white/10 pb-4">
                <h4 className="subtitle-cursive text-xl mb-2">{faq.question}</h4>
                <p className="subtitle-cursive text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Similar Products */}
        <div className="mb-[25px]">
          <h2 className="font-orbitron font-bold text-3xl mb-2 text-center">
            Similar <NeonText color="pink">Products</NeonText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-[30px]">
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

                    <h3 className="font-rajdhani font-semibold text-lg mb-2 group-hover:text-neon-pink transition-colors">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xl text-neon-blue">
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
      </div>
    </div>
  );
};

export default ProductDetail;