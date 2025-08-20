import { useState, useEffect } from 'react';
import BannerCarousel from '@/components/ui/BannerCarousel';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import NeonText from '@/components/ui/NeonText';
import ProductShareButton from '@/components/ui/ProductShareButton';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category, getDisplayPrice, getDisplayMRP } from '@/types/product';

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    // Set up real-time listeners
    const productChannel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchProducts(); // Refetch when products change
        }
      )
      .subscribe();

    const categoryChannel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          fetchCategories(); // Refetch when categories change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(categoryChannel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          product_images (id, image_url, alt_text, display_order)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const categoryName = product.categories?.name || '';
    const matchesCategory = selectedCategory === 'All' || categoryName === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    const primaryImage = product.product_images[0]?.image_url || '/placeholder.svg';

    addItem({
      id: product.id,
      name: product.name,
      price: getDisplayPrice(product),
      image: primaryImage,
      type: 'product'
    });

    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,80,255,0.1)_0%,transparent_50%)]"></div>
      
      {/* Hero Section */}
      <section className="relative z-10 py-12 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-orbitron font-bold text-4xl md:text-6xl mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Premium Neon Collection
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of stunning ready-made neon signs or create your own custom design.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Banner Carousel */}
        <BannerCarousel />
        
        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Categories */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'All' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory('All')}
                className={selectedCategory === 'All' ? "btn-neon" : "btn-outline-neon"}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className={selectedCategory === category.name ? "btn-neon" : "btn-outline-neon"}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Search & View Controls */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading products...</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProducts.map((product, index) => {
                const primaryImage = product.product_images[0]?.image_url || '/placeholder.svg';

                return (
                  <div 
                    key={product.id} 
                    className="group relative transition-all duration-500 hover:-translate-y-3 hover:scale-105 h-auto md:min-h-[650px]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Premium multicolor product card with proper rounded border */}
                    <div className="relative p-0.5 rounded-3xl overflow-hidden h-full"
                         style={{
                           background: `linear-gradient(135deg, 
                             hsl(var(--neon-orange) / 0.6), 
                             hsl(var(--neon-purple) / 0.6), 
                             hsl(var(--neon-pink) / 0.6),
                             hsl(var(--neon-orange) / 0.6)
                           )`
                         }}>
                      <div className="relative p-6 rounded-3xl backdrop-blur-sm overflow-hidden h-full flex flex-col"
                           style={{
                             background: `
                               linear-gradient(135deg, 
                                 hsl(var(--card) / 0.9) 0%, 
                                 hsl(220 15% 12% / 0.85) 30%,
                                 hsl(var(--card) / 0.9) 70%,
                                 hsl(220 15% 10% / 0.9) 100%
                               )
                             `,
                             boxShadow: `0 8px 32px hsl(220 15% 3% / 0.4)`
                           }}>
                      
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                           style={{
                             background: `
                               linear-gradient(135deg, 
                                 hsl(var(--neon-orange) / 0.08) 0%, 
                                 hsl(var(--neon-purple) / 0.08) 50%,
                                 hsl(var(--neon-pink) / 0.08) 100%
                               )
                             `,
                             backgroundSize: '200% 200%',
                             animation: 'gradientShift 3s ease infinite'
                           }}>
                      </div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <Link to={`/products/${product.id}`}>
                          <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl mb-4 overflow-hidden relative"
                               style={{
                                 boxShadow: '0 0 20px hsl(var(--neon-orange) / 0.3)'
                               }}>
                            <img
                              src={primaryImage}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 group-hover:opacity-100 transition-opacity duration-500"
                                 style={{
                                   background: `
                                     linear-gradient(45deg, 
                                       hsl(var(--neon-orange) / 0.1) 0%, 
                                       transparent 50%,
                                       hsl(var(--neon-purple) / 0.1) 100%
                                     )
                                   `
                                 }}>
                            </div>
                            
                            {/* Category badge */}
                            <Badge className="absolute top-3 left-3 backdrop-blur-sm group-hover:shadow-lg transition-all duration-300"
                                   style={{
                                     background: 'linear-gradient(135deg, hsl(var(--neon-orange) / 0.9), hsl(var(--neon-purple) / 0.9))',
                                     border: '1px solid hsl(var(--neon-orange) / 0.5)',
                                     color: 'hsl(var(--neon-white))',
                                     boxShadow: '0 0 20px hsl(var(--neon-orange) / 0.5)'
                                   }}>
                              {product.categories?.name || 'General'}
                            </Badge>
                          </div>
                        </Link>
                        
                        <Link to={`/products/${product.id}`}>
                          <h3 className="font-rajdhani font-bold text-lg mb-3 group-hover:text-transparent transition-all duration-300"
                              style={{
                                background: 'linear-gradient(135deg, hsl(var(--neon-orange)), hsl(var(--neon-purple)))',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                              }}>
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 transition-colors duration-300 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current group-hover:text-yellow-300' : 'text-gray-300'}`}
                                style={{
                                  filter: i < Math.floor(product.rating) ? 'drop-shadow(0 0 8px hsl(var(--neon-yellow) / 0.6))' : 'none'
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                            {product.rating.toFixed(1)} ({product.review_count} reviews)
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg group-hover:text-transparent transition-all duration-300"
                                  style={{
                                    background: 'linear-gradient(135deg, hsl(var(--neon-orange)), hsl(var(--neon-purple)))',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                  }}>
                              ₹{getDisplayPrice(product).toLocaleString()}
                            </span>
                            {getDisplayMRP(product) && getDisplayMRP(product) > getDisplayPrice(product) && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{getDisplayMRP(product).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Stock: {product.stock_quantity}
                          </div>
                        </div>
        
                        <div className="flex gap-3 mb-3">
                          <Button 
                            asChild
                            className="flex-1 group-hover:shadow-lg transition-shadow duration-300 rounded-2xl"
                            size="sm"
                            style={{
                              background: 'linear-gradient(135deg, hsl(var(--neon-orange)), hsl(var(--neon-purple)))',
                              color: 'hsl(var(--background))',
                              boxShadow: '0 0 20px hsl(var(--neon-orange) / 0.4)'
                            }}
                          >
                            <Link to={`/products/${product.id}`}>
                              Select Options
                            </Link>
                          </Button>
                          <Button 
                            asChild
                            className="flex-1 group-hover:shadow-lg transition-shadow duration-300 rounded-2xl"
                            size="sm"
                            style={{
                              background: 'transparent',
                              border: '2px solid hsl(var(--neon-purple))',
                              color: 'hsl(var(--neon-purple))',
                              boxShadow: '0 0 20px hsl(var(--neon-purple) / 0.3)'
                            }}
                          >
                            <Link to={`/products/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                        
                        {/* Share Button */}
                        <div className="relative">
                          <ProductShareButton 
                            productId={product.id}
                            productName={product.name}
                            productImage={primaryImage}
                          />
                        </div>
                      </div>
                      
                      {/* Multicolor bottom glow */}
                      <div className="absolute inset-x-0 bottom-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                           style={{
                             background: 'linear-gradient(90deg, hsl(var(--neon-orange)), hsl(var(--neon-purple)), hsl(var(--neon-pink)), hsl(var(--neon-orange)))',
                             backgroundSize: '200% 100%',
                             animation: 'gradientShift 2s ease infinite'
                           }}>
                      </div>
                      
                      {/* Outer glow effect */}
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                           style={{
                             boxShadow: '0 0 50px hsl(var(--neon-orange) / 0.4), 0 0 100px hsl(var(--neon-purple) / 0.3)'
                           }}>
                      </div>
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {products.length === 0 
                    ? "No products available. Add products from the admin panel to see them here."
                    : "No products found matching your criteria."
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;