import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import NeonText from '@/components/ui/NeonText';
import NeonCard from '@/components/ui/NeonCard';
import { supabase } from '@/integrations/supabase/client';
import {
  Zap,
  Shield,
  Clock,
  Truck,
  Star,
  ArrowRight,
  Heart,
  Coffee,
  GamepadIcon,
  PartyPopper,
  Quote,
  Users,
  Award,
  CheckCircle,
  MessageCircle
} from 'lucide-react';

const Index = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [realtimeProducts, setRealtimeProducts] = useState<any[]>([]);
  const [bestsellingProducts, setBestsellingProducts] = useState<any[]>([]);

  // Set up real-time listeners for main website
  useEffect(() => {
    fetchBestsellingProducts();

    const productChannel = supabase
      .channel('main-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          // Trigger a refresh of the products page when products change
          console.log('Products updated - main website will reflect changes');
          fetchBestsellingProducts();
        }
      )
      .subscribe();

    const categoryChannel = supabase
      .channel('main-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          // Trigger a refresh when categories change
          console.log('Categories updated - main website will reflect changes');
        }
      )
      .subscribe();

    const bestsellingChannel = supabase
      .channel('bestselling-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bestselling_products'
        },
        () => {
          fetchBestsellingProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(categoryChannel);
      supabase.removeChannel(bestsellingChannel);
    };
  }, []);

  const fetchBestsellingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('bestselling_products')
        .select(`
          *,
          products (
            id,
            name,
            medium_price,
            medium_mrp,
            description,
            product_images (
              image_url,
              alt_text
            )
          )
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(6);

      if (error) throw error;

      const formattedProducts = data?.map(item => ({
        id: item.products.id,
        name: item.products.name,
        price: item.products.medium_price,
        originalPrice: item.products.medium_mrp,
        image: item.products.product_images?.[0]?.image_url || '/placeholder.svg',
        badge: item.badge_text,
        rating: Math.round((4.8 + Math.random() * 0.2) * 10) / 10, // Generate clean rating between 4.8-5.0
        reviews: Math.floor(Math.random() * 300) + 50 // Generate random reviews between 50-350
      })) || [];

      setBestsellingProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching bestselling products:', error);
    }
  };

  const handleAddToCart = (product: typeof bestsellingProducts[0]) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      type: 'product'
    });

    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };
  const features = [
    {
      icon: Shield,
      title: 'Premium LEDs',
      description: '50,000+ hours lifespan with energy-efficient technology'
    },
    {
      icon: Award,
      title: '12-Month Warranty',
      description: 'Complete protection against manufacturing defects'
    },
    {
      icon: Zap,
      title: 'Safe & Low Heat',
      description: 'Advanced heat management for safety and longevity'
    },
    {
      icon: CheckCircle,
      title: 'Easy Installation',
      description: 'Simple setup with all mounting hardware included'
    }
  ];

  const categories = [
    {
      name: 'Bedroom',
      icon: Heart,
      image: '/lovable-uploads/bedroom.jpeg',
      description: 'Romantic neon lights',
      count: '10+ designs'
    },
    {
      name: 'Bar/Cafe',
      icon: Coffee,
      image: '/lovable-uploads/bar.jpeg',
      description: 'Professional business',
      count: '15+ designs'
    },
    {
      name: 'Gaming Zone',
      icon: GamepadIcon,
      image: '/lovable-uploads/gaming.jpeg',
      description: 'Epic gaming setup lights',
      count: '5+ designs'
    },
    {
      name: 'Wedding/Event',
      icon: PartyPopper,
      image: '/lovable-uploads/wedding.jpeg',
      description: 'Special occasion decor',
      count: '20+ designs'
    },
    {
      name: 'Quotes',
      icon: Quote,
      image: '/lovable-uploads/quots.jpeg',
      description: 'Inspirational text designs',
      count: '15+ designs'
    }
  ];

  // Bestselling products are now fetched from database

  const testimonials = [
    {
      name: 'Amit Verma',
      rating: 5,
      review: "Namastey Lights transformed my living room! The custom neon sign adds such a vibrant vibe, and everyone compliments it when they visit.",
      image: '/lovable-uploads/p1.jpg',
      location: 'Delhi'
    },
    {
      name: 'Rohit Mehra',
      rating: 5,
      review: "The service was smooth and quick. My café looks stunning with the neon board from Namastey Lights. Customers love the new look!",
      image: '/lovable-uploads/p2.jpg',
      location: 'Bangalore'
    },
    {
      name: 'Karan Malhotra',
      rating: 5,
      review: "Absolutely amazing quality and stunning craftsmanship. I ordered a name sign for my studio, and it glows perfectly bright with vibrant colors. Definitely worth spent!",
      image: '/lovable-uploads/p3.jpg',
      location: 'Mumbai'
    },
    {
      name: 'Vikram Sharma',
      rating: 5,
      review: "From design to delivery, the Namastey Lights team was super helpful. My customized sign arrived on time and looks even better in person.",
      image: '/lovable-uploads/p5.jpg',
      location: 'Pune'
    },
    {
      name: 'Sahil Kapoor',
      rating: 5,
      review: "Great craftsmanship and excellent brightness. My neon sign has completely changed the look of my gaming setup. Highly recommended!",
      image: '/lovable-uploads/p4.jpg',
      location: 'Hyderabad'
    }
  ];

  const process = [
    { step: 1, title: 'Choose', description: 'Browse our collection or start with custom design' },
    { step: 2, title: 'Customize', description: 'Personalize colors, size, and text to your liking' },
    { step: 3, title: 'Preview', description: 'See your design come to life with our live preview' },
    { step: 4, title: 'Order', description: 'Secure checkout with multiple payment options' },
    { step: 5, title: 'Delivered', description: 'Fast delivery with professional installation available' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with premium neon cartoon background */}
      <section className="bg-background py-[20px] md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-float">
            <h1 className="font-orbitron font-bold text-3xl md:text-5xl lg:text-6xl mb-4 leading-tight">
              <span className="text-[#CCFF33] font-dancing-script drop-shadow-[0_0_12px_#CCFF33]">Create</span>{' '}
              <br></br>
              <span className="text-white font-orbitron font-bold">Stunning</span>{' '}
              <span className="text-[#ffffff] font-edu-cursive drop-shadow-[0_0_60px_#ffffff]">Neon Signs</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Large Banner Section */}
      <section className="bg-background px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Desktop / Tablet Banner */}
          <div className="relative hidden md:flex rounded-2xl md:rounded-3xl overflow-hidden min-h-[300px] md:min-h-[400px] lg:min-h-[500px] items-center justify-center border-2 ">
            <img
              src="\lovable-uploads\Neon-Carnival-Sale-1500x577.png"
              alt="Banner"
              className="w-full h-full object-cover pointer-events-none select-none"
              loading="lazy"
            />
          </div>

          {/* Mobile Banner (Square) */}
          <div className="relative flex md:hidden rounded-2xl overflow-hidden aspect-square items-center justify-center border-2  border-muted-foreground/30">
            <img
              src="\lovable-uploads\mobile-banner.jpg"
              alt="Mobile Banner"
              className="w-full h-full object-cover pointer-events-none select-none"
              loading="lazy"
            />
          </div>


        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="bg-background pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild className="btn-neon text-lg px-8 py-4">
              <Link to="/products">
                Shop Ready-Made Signs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button asChild className="btn-neon text-lg px-8 py-4">
              <Link to="/customize">
                <Zap className="mr-2 w-5 h-5" />
                Customize Your Neon
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* simple black bg */}
      <div className="bg-background">


        {/* Why Choose Us Section */}
        <section className="py-[10px] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-[30px] animate-fade-in">


              <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-neon-white"
                style={{

                }}>
                Why Choose{' '}
                <span
                  className="text-white font-bold"
                  style={{
                    textShadow: `
      0 0 0px rgba(255, 255, 255, 0.8), 
      0 0 5px rgba(255, 255, 255, 0.6), 
      0 0 14px rgba(255, 255, 255, 0.4), 
      0 0 20px rgba(255, 255, 255, 0.3)
    `
                  }}
                >
                  Namastey lights?
                </span>

              </h2>


              <p className="subtitle-cursive text-xl max-w-2xl mx-auto">
                We combine premium materials, expert craftsmanship, and innovative design to create neon signs that shine bright and last long.
              </p>
            </div>

            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="flex overflow-x-auto gap-6 pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible scrollbar-hide py-1 md:py-0">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative transition-all duration-300 md:hover:-translate-y-1 md:hover:scale-105 flex-shrink-0 w-80 md:w-auto"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Minimal clean card */}
                    <div className="relative p-6 rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm md:hover:border-neon-white/30 md:hover:bg-card/70 transition-all duration-300">

                      {/* Simple icon container */}
                      <div className="mb-4 flex justify-center">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400/20 to-red-500/20 md:group-hover:from-orange-400/30 md:group-hover:to-red-500/30 transition-all duration-300">
                          <Icon className="w-6 h-6 text-neon-white md:group-hover:text-neon-white transition-colors duration-300" />
                        </div>
                      </div>

                      {/* Title with theme gradient */}
                      <h3 className="font-rajdhani font-bold text-lg mb-3 text-center text-neon-white">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="subtitle-cursive text-sm text-center leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Subtle bottom accent */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 md:group-hover:w-16 transition-all duration-300"></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Swipe Indicator for Mobile */}
            <div className="flex md:hidden justify-center mt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>Swipe to view more</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Showcase */}
        <section className="py-[30px] relative z-10">
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-neon-white "
                style={{

                }}>
                Popular Categories
              </h2>
              <p className="subtitle-cursive text-xl max-w-2xl mx-auto">
                Discover our most loved neon sign categories, each designed to perfectly match your space and style.
              </p>
            </div>

            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="flex overflow-x-auto gap-6 pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:overflow-visible scrollbar-hide py-0 md:py-0">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div
                    key={index}
                    className="group relative cursor-pointer transition-all duration-500 md:hover:-translate-y-4 md:hover:scale-105 flex-shrink-0 w-80 md:w-auto"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Premium multicolor category card with proper rounded border */}
                    <div className="relative p-0.5 rounded-3xl overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, 
                           hsl(var(--neon-white) / 0.7), 
                           hsl(var(--neon-white) / 0.7), 
                           hsl(var(--neon-white) / 0.5),
                           hsl(var(--neon-white) / 0.7)
                         )`
                      }}>
                      <div className="relative p-6 rounded-3xl backdrop-blur-sm text-center overflow-hidden"
                        style={{
                          background: `
                             linear-gradient(135deg, 
                               hsl(var(--card) / 0.95) 0%, 
                               hsl(220 15% 13% / 0.9) 25%,
                               hsl(var(--card) / 0.95) 50%,
                               hsl(220 15% 11% / 0.9) 75%,
                               hsl(var(--card) / 0.95) 100%
                             )
                           `,
                          boxShadow: `0 8px 32px hsl(220 15% 3% / 0.5)`
                        }}>

                        {/* Animated multicolor overlay */}
                        <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `
                             linear-gradient(135deg, 
                               hsl(var(--neon-white) / 0.06) 0%, 
                               hsl(var(--neon-white) / 0.06) 50%,
                               hsl(var(--neon-white) / 0.03) 100%
                             )
                           `,
                            backgroundSize: '200% 200%',
                            animation: 'gradientShift 4s ease infinite'
                          }}>
                        </div>

                        <div className="relative z-10">
                          <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl mb-4 overflow-hidden relative"
                            style={{
                              boxShadow: '0 0 20px hsl(var(--neon-white) / 0.3)'
                            }}>
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 md:group-hover:opacity-100 transition-opacity duration-500"
                              style={{
                                background: `
                                 linear-gradient(45deg, 
                                   hsl(var(--neon-white) / 0.1) 0%, 
                                   transparent 50%,
                                   hsl(var(--neon-white) / 0.1) 100%
                                 )
                               `
                              }}>
                            </div>
                          </div>

                          <div className="mb-4 flex justify-center">
                            <div className="p-3 rounded-3xl group-hover:scale-110 transition-transform duration-300"
                              style={{
                                background: `
                                 linear-gradient(135deg, 
                                   hsl(var(--neon-white) / 0.3) 0%, 
                                   hsl(var(--neon-white) / 0.3) 100%
                                 )
                               `,
                                boxShadow: `
                                 0 0 20px hsl(var(--neon-white) / 0.4),
                                 inset 0 0 20px hsl(var(--neon-white) / 0.2)
                               `
                              }}>
                              <Icon className="w-6 h-6 text-neon-white group-hover:rotate-12 transition-all duration-300" />
                            </div>
                          </div>

                          <h3 className="font-rajdhani font-bold text-lg mb-2 md:group-hover:text-transparent transition-all duration-300"
                            style={{
                              background: 'linear-gradient(135deg, hsl(var(--neon-white)), hsl(var(--neon-white)))',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                            }}>
                            {category.name}
                          </h3>

                          <p className="font-inter text-sm text-muted-foreground mb-3 md:group-hover:text-foreground/80 transition-colors duration-300">
                            {category.description}
                          </p>

                          <span className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, hsl(var(--neon-white) / 0.2), hsl(var(--neon-white) / 0.2))',
                              border: '1px solid hsl(var(--neon-white) / 0.3)',
                              color: 'hsl(var(--neon-white))'
                            }}>
                            {category.count}
                          </span>
                        </div>

                        {/* Multicolor bottom glow */}
                        <div className="absolute inset-x-0 bottom-0 h-1 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: 'linear-gradient(90deg, hsl(var(--neon-white)), hsl(var(--neon-white)), hsl(var(--neon-white)), hsl(var(--neon-white)))',
                            backgroundSize: '200% 100%',
                            animation: 'gradientShift 3s ease infinite'
                          }}>
                        </div>

                        {/* Outer glow effect */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            boxShadow: '0 0 60px hsl(var(--neon-white) / 0.4), 0 0 100px hsl(var(--neon-white) / 0.2)'
                          }}>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Swipe Indicator for Mobile */}
            <div className="flex md:hidden justify-center mt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>Swipe to explore categories</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="text-center mt-12">
              <Button asChild className="btn-neon group hover:shadow-lg hover:shadow-neon-white/30 transition-shadow duration-300">
                <Link to="/products">
                  View All Categories
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Bestsellers Carousel */}
        <section className="py-[20px] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-neon-white"
                style={{

                }}>
                Bestselling Neon Signs
              </h2>
              <p className="subtitle-cursive text-xl max-w-2xl mx-auto">
                Our most popular designs loved by thousands of customers worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-0">
              {bestsellingProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No bestselling products yet.</p>
                </div>
              ) : (
                bestsellingProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative transition-all duration-500 hover:-translate-y-3 hover:scale-105"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Premium multicolor product card with proper rounded border */}
                    <div className="relative p-0.5 rounded-3xl overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, 
                         hsl(var(--neon-orange) / 0.6), 
                         hsl(var(--neon-purple) / 0.6), 
                         hsl(var(--neon-pink) / 0.6),
                         hsl(var(--neon-orange) / 0.6)
                       )`
                      }}>
                      <div className="relative p-6 rounded-3xl backdrop-blur-sm overflow-hidden"
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

                        <div className="relative z-10">
                          <Link to={`/products/${product.id}`}>
                            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl mb-4 overflow-hidden relative"
                              style={{
                                boxShadow: '0 0 20px hsl(var(--neon-orange) / 0.3)'
                              }}>
                              <img
                                src={product.image}
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
                              <Badge className="absolute top-3 left-3 backdrop-blur-sm group-hover:shadow-lg transition-all duration-300"
                                style={{
                                  background: 'linear-gradient(135deg, hsl(var(--neon-orange) / 0.9), hsl(var(--neon-purple) / 0.9))',
                                  border: '1px solid hsl(var(--neon-orange) / 0.5)',
                                  color: 'hsl(var(--neon-white))',
                                  boxShadow: '0 0 20px hsl(var(--neon-orange) / 0.5)'
                                }}>
                                {product.badge}
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
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                              {product.rating} ({product.reviews} reviews)
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
                                ₹{product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3">
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
                ))
              )}
            </div>
          </div>
        </section>

        {/* How It Works Process */}
        <section className="py-[50px] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-neon-white"
                style={{

                }}>
                How It Works
              </h2>
              <p className="subtitle-cursive text-xl max-w-2xl mx-auto">
                From concept to delivery, we make creating your perfect neon sign simple and stress-free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {process.map((step, index) => (
                <div
                  key={index}
                  className="text-center relative group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {index < process.length - 1 && (
                    <div
                      className={`absolute ${
                        // mobile me vertical line, desktop me horizontal
                        "left-1/2 top-full w-0.5 h-12 md:top-8 md:left-full md:w-full md:h-0.5"
                        } bg-gradient-to-b md:bg-gradient-to-r from-neon-white via-neon-white to-neon-white 
    transform md:translate-x-4`}
                    ></div>
                  )}


                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-pink to-neon-blue flex items-center justify-center text-background font-bold text-xl relative group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-neon-pink/40">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-pink to-neon-blue opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                      <span className="relative z-10">{step.step}</span>
                    </div>
                  </div>

                  <h3 className="font-rajdhani font-semibold text-xl mb-3 text-neon-white group-hover:text-neon-white transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="subtitle-cursive text-l group-hover:text-foreground/80 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-[50px] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-fade-in order-2 lg:order-1 text-center lg:text-left">
                <div>

                  <h2 className="font-orbitron font-bold text-3xl sm:text-4xl md:text-5xl mb-6"
                    style={{

                    }}>
                    Who{' '}
                    <span className="bg-gradient-to-r from-neon-green to-neon-yellow bg-clip-text text-transparent"
                      style={{

                      }}>
                      are we?
                    </span>
                  </h2>

                  <p className="font-rajdhani font-bold text-lg sm:text-xl md:text-2xl text-neon-white mb-8">
                    My name is Khan, and Namastey Lights is not just a brand—it’s my dream turned into reality.
                  </p>
                </div>

                <div className="space-y-6">
                  <p className="  sm:text-lg subtitle-cursive text-xl leading-relaxed">
                    After preparing for NEET and deciding to take a different path, I chose to build something of my own. With no team, no big backing, just determination and countless hours of hard work, I started this journey as a solo entrepreneur. From learning the craft to managing designs, production, and customer service, every step has been a challenge and a lesson.
                  </p>

                  <p className="  sm:text-lg subtitle-cursive text-xl leading-relaxed">
                    Today, Namastey Lights stands as a symbol of creativity, resilience, and passion—bringing customized LED neon signs that add light and life to people’s homes, businesses, and celebrations across India.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
                  <Button asChild className="btn-neon text-lg px-6 sm:px-8 py-4">
                    <Link to="/products">
                      <Zap className="mr-2 w-5 h-5" />
                      Shop Ready Made Signs
                    </Link>
                  </Button>
                  <Button asChild className="btn-neon text-lg px-6 sm:px-8 py-4">
                    <Link to="/contact">
                      Learn More About Us
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Vidio */}
              <div className="relative group order-1 lg:order-2">
                <div
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    boxShadow:
                      '0 0 40px hsl(var(--neon-white) / 0.3), 0 0 80px hsl(var(--neon-yellow) / 0.2)'
                  }}
                >
                  <video
                    src="/lovable-uploads/nmsteylights.mp4"  // yahan apna video path daalna
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{
                      background: `
          linear-gradient(45deg, 
            hsl(var(--neon-white) / 0.3) 0%, 
            transparent 50%,
            hsl(var(--neon-white) / 0.3) 100%
          )
        `
                    }}
                  ></div>
                </div>

                {/* Floating stats - responsive positioning */}
                <div
                  className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-card/90 backdrop-blur-sm border border-neon-white/30 rounded-2xl p-3 sm:p-4 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 0 20px hsl(var(--neon-white) / 0.4)'
                  }}
                >
                  <div className="text-center">
                    <div className="font-orbitron font-bold text-xl sm:text-2xl text-neon-white">10K+</div>
                    <div className="font-inter text-xs sm:text-sm text-muted-foreground">Community</div>
                  </div>
                </div>

                <div
                  className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-card/90 backdrop-blur-sm border border-neon-white/30 rounded-2xl p-3 sm:p-4 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 0 20px hsl(var(--neon-white) / 0.4)'
                  }}
                >
                  <div className="text-center">
                    <div className="font-orbitron font-bold text-xl sm:text-2xl text-neon-white">2025</div>
                    <div className="font-inter text-xs sm:text-sm text-muted-foreground">Founded</div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-[50px] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-neon-white"
                style={{

                }}>
                What Our Customers Say
              </h2>
              <p className="subtitle-cursive text-xl max-w-2xl mx-auto">
                Real reviews from real customers who transformed their spaces with our neon signs.
              </p>
            </div>

            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="flex overflow-x-auto gap-8 pb-4 md:pb-0 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide py-6 md:py-0">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative transition-all duration-500 md:hover:-translate-y-3 md:hover:scale-105 flex-shrink-0 w-80 md:w-auto"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Premium multicolor testimonial card with proper rounded border */}
                  <div className="relative p-0.5 rounded-3xl overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, 
                         hsl(var(--neon-purple) / 0.6), 
                         hsl(var(--neon-white) / 0.4), 
                         hsl(var(--neon-blue) / 0.6),
                         hsl(var(--neon-purple) / 0.6)
                       )`
                    }}>
                    <div className="relative p-6 rounded-3xl backdrop-blur-sm overflow-hidden"
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
                      <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `
                           linear-gradient(135deg, 
                             hsl(var(--neon-purple) / 0.08) 0%, 
                             hsl(var(--neon-white) / 0.04) 50%,
                             hsl(var(--neon-blue) / 0.08) 100%
                           )
                         `,
                          backgroundSize: '200% 200%',
                          animation: 'gradientShift 4s ease infinite'
                        }}>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 rounded-full mr-4 flex items-center justify-center md:group-hover:scale-110 transition-transform duration-300"
                            style={{
                              background: `
                               linear-gradient(135deg, 
                                 hsl(var(--neon-purple) / 0.3) 0%, 
                                 hsl(var(--neon-blue) / 0.3) 100%
                               )
                             `,
                              boxShadow: `
                               0 0 20px hsl(var(--neon-purple) / 0.4),
                               inset 0 0 20px hsl(var(--neon-blue) / 0.2)
                             `
                            }}>
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-rajdhani font-bold text-lg md:group-hover:text-transparent transition-all duration-300"
                              style={{
                                background: 'linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-blue)))',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                              }}>
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-muted-foreground md:group-hover:text-foreground/80 transition-colors duration-300">
                              {testimonial.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current md:group-hover:text-yellow-300 transition-colors duration-300"
                              style={{
                                filter: 'drop-shadow(0 0 8px hsl(var(--neon-yellow) / 0.6))'
                              }}
                            />
                          ))}
                        </div>

                        <p className="font-inter text-muted-foreground italic md:group-hover:text-foreground/90 transition-colors duration-300">
                          "{testimonial.review}"
                        </p>
                      </div>

                      {/* Multicolor bottom glow */}
                      <div className="absolute inset-x-0 bottom-0 h-1 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: 'linear-gradient(90deg, hsl(var(--neon-purple)), hsl(var(--neon-white)), hsl(var(--neon-blue)), hsl(var(--neon-purple)))',
                          backgroundSize: '200% 100%',
                          animation: 'gradientShift 3s ease infinite'
                        }}>
                      </div>

                      {/* Outer glow effect */}
                      <div className="absolute inset-0 rounded-3xl opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          boxShadow: '0 0 50px hsl(var(--neon-purple) / 0.4), 0 0 100px hsl(var(--neon-blue) / 0.3)'
                        }}>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Swipe Indicator for Mobile */}
            <div className="flex md:hidden justify-center mt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>Swipe to read more reviews</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-[50px] relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="animate-fade-in">
              <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-neon-white"
                style={{

                }}>
                Ready to Light Up Your Space?
              </h2>
              <p className="subtitle-cursive text-xl mb-8">
                Join thousands of satisfied customers and create your perfect neon sign today.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild className="btn-neon text-lg px-8 py-4 group hover:shadow-2xl hover:shadow-neon-pink/40 transition-shadow duration-500">
                  <Link to="/customize">
                    <Zap className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    Start Customizing
                  </Link>
                </Button>

                <Button asChild className="btn-neon text-lg px-8 py-4 group hover:shadow-2xl hover:shadow-neon-blue/40 transition-shadow duration-500">
                  <Link to="/contact">
                    Get a Quote
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-[1px] relative z-10 px-[20px] sm:px-[100px]">
        <div className="mb-16">
          <h2 className="font-orbitron font-bold text-5xl mb-8 text-center pt-[1px]">
            FAQ
          </h2>
          <div className="space-y-4 pt-1 sm:pt-[20px] mb-[1px] ">
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
        </section>


      </div> {/* End unified background wrapper */}

      {/* WhatsApp Order Button */}
      <a
        href="https://wa.me/918384884622?text=Hello%20I%20want%20to%20order%20neon%20signs" // Replace with your actual WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="flex items-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          {/* Order On text bubble */}
          {/* <div className="bg-neon-white text-gray-900 px-[5px] py-[1px] square-l-full border-2 border-green-500/20 font-medium text-l mx-1">
            Order On
          </div> */}
          
          {/* WhatsApp icon circle */}
<div className="relative group">
  <div className="bg-green-500 hover:bg-green-600 rounded-full p-3 border-2 border-green-400/20 hover:border-green-300/40 transition-colors duration-300 relative animate-blink">
    {/* Neon glow effect */}
    <div className="absolute inset-0 rounded-full bg-green-400/30 blur-lg scale-110 opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <MessageCircle className="w-6 h-6 text-white relative z-10" />
  </div>
</div>

        </div>
      </a>
    </div>
  );
};

export default Index;