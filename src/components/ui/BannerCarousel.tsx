import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from './button';

interface Banner {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  display_order: number;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    fetchBanners();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('banner-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'banners'
        },
        () => {
          fetchBanners();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [banners.length, isAutoScrolling]);

  const fetchBanners = async () => {
    try {
      console.log('Fetching banners...');
      const { data, error } = await supabase
        .from('banners')
        .select('id, title, image_url, link_url, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching banners:', error);
        throw error;
      }
      console.log('Banners fetched:', data);
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextBanner = () => {
    setIsAutoScrolling(false); // Stop auto-scroll when user manually navigates
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsAutoScrolling(true), 10000); // Resume auto-scroll after 10 seconds
  };

  const prevBanner = () => {
    setIsAutoScrolling(false);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextBanner();
    } else if (isRightSwipe) {
      prevBanner();
    }
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextBanner();
    } else if (isRightSwipe) {
      prevBanner();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleBannerClick = (banner: Banner) => {
    // Only trigger click if it's not a swipe and there's a link
    const distance = Math.abs(touchStart - touchEnd);
    if (distance < 10 && banner.link_url) {
      window.open(banner.link_url, '_blank');
    }
  };

  if (loading) {
    console.log('BannerCarousel is loading...');
    return (
      <div className="w-full mb-8 p-4 text-center text-muted-foreground">
        Loading banners...
      </div>
    );
  }

  if (banners.length === 0) {
    console.log('No banners found, hiding carousel');
    return null;
  }

  return (
    <div className="relative w-full mb-2">
      {/* Horizontal Scrollable Banner Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {banners.map((banner) => (
            <div 
              key={banner.id}
              className="flex-shrink-0 relative group cursor-pointer"
              onClick={() => handleBannerClick(banner)}
            >
              <div className="relative w-[360px] h-[180px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={banner.image_url}
                  alt={banner.title || 'Offer Banner'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  draggable={false}
                />
                
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
                
                {/* Banner Title - Only show if banner doesn't have its own text */}
                {banner.title && (
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                    <h3 className="text-white text-xs font-medium">
                      {banner.title}
                    </h3>
                  </div>
                )}

                {/* Special Offer Badge */}
                <div className="absolute top-3 left-3">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    🎉 OFFER
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      {banners.length > 1 && (
        <div className="flex justify-center mt-4">
          <div className="text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-3 py-1 rounded-full border">
            ← Scroll to see more offers →
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;