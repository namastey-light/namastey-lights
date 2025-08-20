import { useState } from 'react';
import BannerCarousel from '@/components/ui/BannerCarousel';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import NeonText from '@/components/ui/NeonText';
import { Palette, Zap, Download, ShoppingCart } from 'lucide-react';
import html2canvas from 'html2canvas';
const Customize = () => {
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();
  
  const [customText, setCustomText] = useState('YOUR TEXT');
  const [selectedFont, setSelectedFont] = useState('orbitron');
  const [selectedColor, setSelectedColor] = useState('pink');
  const [selectedSize, setSelectedSize] = useState('M');
  const [hasDimmer, setHasDimmer] = useState(false);
  const [backingShape, setBackingShape] = useState('cut-to-shape');

  const fonts = [
    { id: 'orbitron', name: 'Orbitron', family: 'font-orbitron' },
    { id: 'rajdhani', name: 'Rajdhani', family: 'font-rajdhani' },
    { id: 'passion-one', name: 'Passion One', family: 'font-passion-one' },
    { id: 'dancing-script', name: 'Dancing Script', family: 'font-dancing-script' },
    { id: 'flavors', name: 'Flavors', family: 'font-flavors' },
    { id: 'ewert', name: 'Ewert', family: 'font-ewert' },
    { id: 'fugaz-one', name: 'Fugaz One', family: 'font-fugaz-one' },
    { id: 'monoton', name: 'Monoton', family: 'font-monoton' },
    { id: 'abril-fatface', name: 'Abril Fatface', family: 'font-abril-fatface' },
    { id: 'playfair-display', name: 'Playfair Display', family: 'font-playfair-display' },
    { id: 'press-start', name: 'Press Start 2P', family: 'font-press-start' },
    { id: 'audiowide', name: 'Audiowide', family: 'font-audiowide' },
    { id: 'permanent-marker', name: 'Permanent Marker', family: 'font-permanent-marker' },
    { id: 'rubik-glitch', name: 'Rubik Glitch', family: 'font-rubik-glitch' },
    { id: 'rock-salt', name: 'Rock Salt', family: 'font-rock-salt' },
    { id: 'special-elite', name: 'Special Elite', family: 'font-special-elite' },
    { id: 'sans', name: 'Modern Sans', family: 'font-sans' },
    { id: 'mono', name: 'Digital Mono', family: 'font-mono' },
  ];

  const colors = [
    { id: 'blue', name: 'Blue', class: 'neon-text-blue', hex: '#00bfff' },
    { id: 'pink', name: 'Pink', class: 'neon-text-pink', hex: '#ff1493' },
    { id: 'purple', name: 'Purple', class: 'neon-text-purple', hex: '#9945ff' },
    { id: 'white', name: 'White', class: 'neon-text-white', hex: '#ffffff' },
    { id: 'red', name: 'Red', class: 'neon-text-red', hex: '#ff0000' },
    { id: 'green', name: 'Green', class: 'neon-text-green', hex: '#00ff00' },
    { id: 'yellow', name: 'Yellow', class: 'neon-text-yellow', hex: '#ffff00' },
    { id: 'orange', name: 'Orange', class: 'neon-text-orange', hex: '#ff8000' },
  ];

  const sizes = [
    { id: 'S', name: 'Small', width: '30cm', basePrice: 1999 },
    { id: 'M', name: 'Medium', width: '50cm', basePrice: 2999 },
    { id: 'L', name: 'Large', width: '70cm', basePrice: 4499 },
    { id: 'XL', name: 'Extra Large', width: '100cm', basePrice: 6999 },
  ];

  const calculatePrice = () => {
    const selectedSizeData = sizes.find(s => s.id === selectedSize);
    let basePrice = selectedSizeData?.basePrice || 2999;
    
    // Character multiplier
    const charCount = customText.length;
    const charPrice = charCount > 10 ? (charCount - 10) * 50 : 0;
    
    // Add-ons
    const dimmerPrice = hasDimmer ? 499 : 0;
    const backingPrice = backingShape === 'rectangle' ? 299 : 0;
    
    return basePrice + charPrice + dimmerPrice + backingPrice;
  };

  const selectedColorData = colors.find(c => c.id === selectedColor);
  const selectedFontData = fonts.find(f => f.id === selectedFont);

  const capturePreviewImage = async () => {
    const previewElement = document.querySelector('.neon-preview-container') as HTMLElement | null;
    if (!previewElement) return null;

    try {
      const canvas = await html2canvas(previewElement, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing preview:', error);
      return null;
    }
  };

  const handleDownloadPreview = async () => {
    const imageDataUrl = await capturePreviewImage();
    if (!imageDataUrl) {
      toast({
        title: "Error",
        description: "Failed to capture preview image.",
        variant: "destructive",
      });
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.download = `neon-preview-${customText.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.href = imageDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded!",
      description: "Preview image has been downloaded successfully.",
    });
  };

  const handleAddToCart = async () => {
    const finalPrice = calculatePrice();
    const selectedSizeData = sizes.find(s => s.id === selectedSize);
    
    // Capture preview image
    const previewImageUrl = await capturePreviewImage();
    
    addItem({
      id: `custom-${Date.now()}`,
      name: `Custom Neon: "${customText}"`,
      price: finalPrice,
      image: previewImageUrl || '/placeholder.svg',
      type: 'custom',
      customConfig: {
        text: customText,
        font: selectedFont,
        color: selectedColor,
        size: selectedSize,
        hasDimmer,
        backingShape,
        previewImageUrl
      }
    });

    toast({
      title: "Added to Cart!",
      description: `Your custom neon design has been added to cart.`,
    });
  };

  const handleBuyNow = async () => {
    // Add to cart first
    await handleAddToCart();
    // Then navigate to checkout
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-orbitron font-bold text-4xl md:text-6xl mb-6 text-neon-white neon-text">
            Customize Your Neon
          </h1>
          <p className="subtitle-cursive text-xl max-w-2xl mx-auto mb-0">
            Design your perfect neon sign with our real-time customizer. See your creation come to life!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-10">
        {/* Banner Carousel */}
        <BannerCarousel />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Preview Section */}
          <div className="space-y-6">
            <div className="relative p-0.5 rounded-3xl overflow-hidden"
                 style={{
                   background: `linear-gradient(135deg, 
                     hsl(var(--neon-orange) / 0.6), 
                     hsl(var(--neon-purple) / 0.6), 
                     hsl(var(--neon-pink) / 0.6),
                     hsl(var(--neon-orange) / 0.6)
                   )`
                 }}>
              <Card className="rounded-3xl backdrop-blur-sm" style={{
                background: `linear-gradient(135deg, 
                  hsl(var(--card) / 0.9) 0%, 
                  hsl(220 15% 12% / 0.85) 30%,
                  hsl(var(--card) / 0.9) 70%,
                  hsl(220 15% 10% / 0.9) 100%
                )`,
                boxShadow: `0 8px 32px hsl(220 15% 3% / 0.4)`
              }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                    <Zap className="w-5 h-5 text-neon-blue" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
              <CardContent>
                <div 
                  className="rounded-lg min-h-[250px] sm:min-h-[300px] flex items-center justify-center px-4 sm:px-8 bg-cover bg-center relative neon-preview-container overflow-hidden"
                  style={{ 
                    backgroundImage: `url('/lovable-uploads/760ea302-8469-42c7-8a14-29f704bfcb19.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                  <div 
                    className={`relative z-10 text-center ${selectedFontData?.family} ${selectedColorData?.class} break-words max-w-full flex items-center justify-center`}
                    style={{ 
                      fontSize: selectedSize === 'S' ? 'clamp(1.5rem, 4vw, 2rem)' : 
                               selectedSize === 'M' ? 'clamp(2rem, 6vw, 3rem)' : 
                               selectedSize === 'L' ? 'clamp(2.5rem, 8vw, 4rem)' : 
                               'clamp(3rem, 10vw, 5rem)',
                      // Keep Customize preview Blue independent of global theme
                      color: selectedColor === 'blue' ? 'hsl(195 100% 75%)' : undefined,
                      textShadow: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor, 2px 2px 4px rgba(0,0,0,0.8)',
                      lineHeight: '1.2',
                      wordBreak: 'break-word',
                      hyphens: 'auto',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {customText || 'YOUR TEXT'}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <Button variant="outline" className="btn-outline-neon" onClick={handleDownloadPreview}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Preview
                  </Button>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {sizes.find(s => s.id === selectedSize)?.width}
                  </Badge>
                </div>
              </CardContent>
              </Card>
            </div>

            {/* Price Breakdown */}
            <div className="relative p-0.5 rounded-3xl overflow-hidden"
                 style={{
                   background: `linear-gradient(135deg, 
                     hsl(var(--neon-pink) / 0.6), 
                     hsl(var(--neon-blue) / 0.6), 
                     hsl(var(--neon-purple) / 0.6)
                   )`
                 }}>
              <Card className="rounded-3xl backdrop-blur-sm" style={{
                background: `linear-gradient(135deg, 
                  hsl(var(--card) / 0.9) 0%, 
                  hsl(220 15% 12% / 0.85) 30%,
                  hsl(var(--card) / 0.9) 70%
                )`,
                boxShadow: `0 8px 32px hsl(220 15% 3% / 0.4)`
              }}>
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Price Breakdown</CardTitle>
                </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Base Price ({selectedSize})</span>
                  <span>₹{sizes.find(s => s.id === selectedSize)?.basePrice.toLocaleString()}</span>
                </div>
                
                {customText.length > 10 && (
                  <div className="flex justify-between">
                    <span>Extra Characters ({customText.length - 10})</span>
                    <span>₹{((customText.length - 10) * 50).toLocaleString()}</span>
                  </div>
                )}
                
                {hasDimmer && (
                  <div className="flex justify-between">
                    <span>Dimmer Add-on</span>
                    <span>₹499</span>
                  </div>
                )}
                
                {backingShape === 'rectangle' && (
                  <div className="flex justify-between">
                    <span>Rectangle Backing</span>
                    <span>₹299</span>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <NeonText color="blue">₹{calculatePrice().toLocaleString()}</NeonText>
                </div>
              </CardContent>
              </Card>
            </div>
          </div>

          {/* Customization Controls */}
          <div className="space-y-6">
            <div className="relative p-0.5 rounded-3xl overflow-hidden"
                 style={{
                   background: `linear-gradient(135deg, 
                     hsl(var(--neon-purple) / 0.6), 
                     hsl(var(--neon-orange) / 0.6), 
                     hsl(var(--neon-pink) / 0.6)
                   )`
                 }}>
              <Card className="rounded-3xl backdrop-blur-sm" style={{
                background: `linear-gradient(135deg, 
                  hsl(var(--card) / 0.9) 0%, 
                  hsl(220 15% 12% / 0.85) 30%,
                  hsl(var(--card) / 0.9) 70%
                )`,
                boxShadow: `0 8px 32px hsl(220 15% 3% / 0.4)`
              }}>
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">Text Settings</CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Text</label>
                  <Textarea
                    placeholder="Enter your custom text..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Font Style</label>
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font.id} value={font.id}>
                          <span className={font.family}>{font.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Neon Color</label>
                  <div className="grid grid-cols-4 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedColor === color.id 
                            ? 'border-neon-orange neon-glow' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs font-medium">{color.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
              </Card>
            </div>

            <div className="relative p-0.5 rounded-3xl overflow-hidden"
                 style={{
                   background: `linear-gradient(135deg, 
                     hsl(var(--neon-orange) / 0.6), 
                     hsl(var(--neon-blue) / 0.6), 
                     hsl(var(--neon-pink) / 0.6)
                   )`
                 }}>
              <Card className="rounded-3xl backdrop-blur-sm" style={{
                background: `linear-gradient(135deg, 
                  hsl(var(--card) / 0.9) 0%, 
                  hsl(220 15% 12% / 0.85) 30%,
                  hsl(var(--card) / 0.9) 70%
                )`,
                boxShadow: `0 8px 32px hsl(220 15% 3% / 0.4)`
              }}>
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">Size & Options</CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <div className="grid grid-cols-2 gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSize === size.id 
                            ? 'border-neon-blue neon-glow' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-medium">{size.name}</div>
                          <div className="text-sm text-muted-foreground">{size.width}</div>
                          <div className="text-sm text-neon-blue">₹{size.basePrice.toLocaleString()}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={hasDimmer}
                      onChange={(e) => setHasDimmer(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span>Add Dimmer Control (+₹499)</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium mb-2">Backing Shape</label>
                    <Select value={backingShape} onValueChange={setBackingShape}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cut-to-shape">Cut to Shape (Free)</SelectItem>
                        <SelectItem value="rectangle">Rectangle (+₹299)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                className="flex-1 font-semibold py-3 text-lg rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--neon-orange)), hsl(var(--neon-purple)))',
                  color: 'hsl(var(--background))',
                  boxShadow: '0 0 20px hsl(var(--neon-orange) / 0.4)'
                }}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                className="flex-1 font-semibold py-3 text-lg rounded-2xl"
                style={{
                  background: 'transparent',
                  border: '2px solid hsl(var(--neon-purple))',
                  color: 'hsl(var(--neon-purple))',
                  boxShadow: '0 0 20px hsl(var(--neon-purple) / 0.3)'
                }}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;