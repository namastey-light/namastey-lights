import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { state, toggleCart } = useCart();
  
  const cartCount = state.totalItems;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Customize Your Neon', href: '/customize' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/lovable-uploads/92b1a9f8-76b9-4a83-a360-ed2664b906aa.png" 
              alt="namstey Light Logo" 
              className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-xl transition-colors duration-300">
              <span 
                className="font-rajdhani font-bold text-foreground group-hover:text-neon-white uppercase tracking-wider transition-all duration-300"
                style={{
                  textShadow: '0 0 5px hsl(var(--neon-white) / 0.8), 0 0 10px hsl(var(--neon-white) / 0.6), 0 0 20px hsl(var(--neon-white) / 0.4), 0 0 40px hsl(var(--neon-white) / 0.3), 0 0 60px hsl(var(--neon-white) / 0.2)'
                }}
              >
                NAMASTEY
              </span>
              <span 
                className="text-neon-white ml-1 lowercase tracking-wide transition-all duration-300" 
                style={{ 
                  fontFamily: 'Dancing Script, cursive', 
                  fontSize: '1.4em',
                  fontWeight: '600',
                  fontStyle: 'italic',
                  textShadow: '0 0 5px hsl(var(--neon-white) / 0.9), 0 0 10px hsl(var(--neon-white) / 0.7), 0 0 20px hsl(var(--neon-white) / 0.5), 0 0 35px hsl(var(--neon-white) / 0.3), 0 0 50px hsl(var(--neon-white) / 0.2)'
                }}
              >
                lights
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-inter font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-neon-white neon-text'
                    : 'text-foreground hover:text-neon-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-neon-white border-neon-white text-black"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-inter font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-neon-white bg-neon-white/10 neon-text'
                      : 'text-foreground hover:text-neon-white hover:bg-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <CartDrawer />
    </nav>
  );
};

export default Navbar;