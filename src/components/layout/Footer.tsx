import { Link } from 'react-router-dom';
import { Zap, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Custom Design', href: '/customize' },
    { name: 'Contact', href: '/contact' },
  ];

  const policies = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Return Policy', href: '/return-policy' },
    { name: 'Shipping Info', href: '/shipping-info' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/namasteylightsin?igsh=bWMwbHFzc2t1Nm5w&utm_source=qr' },
    { name: 'Youtube', icon: Youtube, href: 'https://youtube.com/@namasteylights?si=7aSRUWET6cYGxgNT' },
  ];

  return (
    <footer className="relative bg-card border-t border-white/10 mt-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group mb-4 hover:scale-105 transition-transform duration-300 cursor-pointer relative z-20"
            >
              <img 
                src="/lovable-uploads/92b1a9f8-76b9-4a83-a360-ed2664b906aa.png" 
                alt="namstey Light Logo" 
                className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-xl transition-colors duration-300">
                <span 
                  className="font-rajdhani font-bold text-foreground group-hover:text-neon-orange uppercase tracking-wider transition-all duration-300"
                  style={{
                    textShadow: '0 0 5px hsl(var(--neon-orange) / 0.8), 0 0 10px hsl(var(--neon-orange) / 0.6), 0 0 20px hsl(var(--neon-orange) / 0.4), 0 0 40px hsl(var(--neon-orange) / 0.3), 0 0 60px hsl(var(--neon-orange) / 0.2)'
                  }}
                >
                  NAMASTEY
                </span>
                <span 
                  className="text-neon-orange ml-1 lowercase tracking-wide transition-all duration-300" 
                  style={{ 
                    fontFamily: 'Dancing Script, cursive', 
                    fontSize: '1.4em',
                    fontWeight: '600',
                    fontStyle: 'italic',
                    textShadow: '0 0 5px hsl(var(--neon-orange) / 0.9), 0 0 10px hsl(var(--neon-orange) / 0.7), 0 0 20px hsl(var(--neon-orange) / 0.5), 0 0 35px hsl(var(--neon-orange) / 0.3), 0 0 50px hsl(var(--neon-orange) / 0.2)'
                  }}
                >
                  lights
                </span>
              </span>
            </Link>
            <p className="font-inter text-muted-foreground mb-6 max-w-md">
              Creating stunning custom neon signs and LED lights with premium quality materials. 
              Transform your space with our vibrant, long-lasting neon designs.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2 text-neon-blue" />
                believebrightcare@gmail.com
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-2 text-neon-blue" />
                +91 8384884622
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 text-neon-blue" />
                Badaun, Uttar pradesh, India
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-inter font-semibold text-lg mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-neon-pink transition-all duration-300 cursor-pointer relative z-20 block py-1 hover:scale-105"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-inter font-semibold text-lg mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Legal
            </h3>
            <ul className="space-y-2">
              {policies.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-neon-pink transition-all duration-300 cursor-pointer relative z-20 block py-1 hover:scale-105"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Namastey lights. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank" 
                  className="text-muted-foreground hover:text-neon-pink transition-all duration-300 cursor-pointer relative z-20 p-2 hover:scale-110 hover:bg-white/5 rounded-lg"
                  aria-label={social.name}
                >
                  <Icon className="w-10 h-10" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;