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
  const [selectedFont, setSelectedFont] = useState('passionate');
  const [selectedColor, setSelectedColor] = useState('pink');
  const [selectedSize, setSelectedSize] = useState('M');
  const [hasDimmer, setHasDimmer] = useState(false);
  const [backingShape, setBackingShape] = useState('cut-to-shape');

  const fonts = [
    { id: 'passionate', name: 'Passionate', family: 'font-passionate' },
    { id: 'dreamy', name: 'Dreamy', family: 'font-dreamy' },
    { id: 'flowy', name: 'Flowy', family: 'font-flowy' },
    { id: 'original', name: 'Original', family: 'font-original' },
    { id: 'classic', name: 'Classic', family: 'font-classic' },
    { id: 'breeze', name: 'Breeze', family: 'font-breeze' },
    { id: 'funky', name: 'Funky', family: 'font-funky' },
    { id: 'chic', name: 'Chic', family: 'font-chic' },
    { id: 'delight', name: 'Delight', family: 'font-delight' },
    { id: 'classy', name: 'Classy', family: 'font-classy' },
    { id: 'romantic', name: 'Romantic', family: 'font-romantic' },
    { id: 'robo', name: 'ROBO', family: 'font-robo' },
    { id: 'charming', name: 'Charming', family: 'font-charming' },
    { id: 'quirky', name: 'Quirky', family: 'font-quirky' },
    { id: 'stylish', name: 'Stylish', family: 'font-stylish' },
    { id: 'sassy', name: 'Sassy', family: 'font-sassy' },
    { id: 'glam', name: 'Glam', family: 'font-glam' },
    { id: 'dope', name: 'DOPE', family: 'font-dope' },
    { id: 'chemistry', name: 'Chemistry', family: 'font-chemistry' },
    { id: 'realistic', name: 'Realistic', family: 'font-realistic' },
    { id: 'sparky', name: 'Sparky', family: 'font-sparky' },
    { id: 'vibey', name: 'Vibey', family: 'font-vibey' },
    { id: 'la-fi', name: 'La Fi', family: 'font-la-fi' },
    { id: 'bossy', name: 'Bossy', family: 'font-bossy' },
    { id: 'iconic', name: 'ICONIC', family: 'font-iconic' },
    { id: 'jolly', name: 'Jolly', family: 'font-jolly' },
    { id: 'modern', name: 'MODERN', family: 'font-modern' },
  ];

  const colors = [
    { id: 'blue', name: 'Ice Blue', class: 'neon-text-blue', hex: '#00bfff' },
    { id: 'pink', name: 'Pink', class: 'neon-text-pink', hex: '#ff1493' },
    { id: 'purple', name: 'Purple', class: 'neon-text-purple', hex: '#9945ff' },
    { id: 'white', name: 'White', class: 'neon-text-white', hex: '#ffffff' },
    { id: 'red', name: 'Red', class: 'neon-text-red', hex: '#ff0000' },
    { id: 'green', name: 'Green', class: 'neon-text-green', hex: '#00ff00' },
    { id: 'yellow', name: 'Yellow', class: 'neon-text-yellow', hex: '#ffff00' },
    { id: 'orange', name: 'Orange', class: 'neon-text-orange', hex: '#FFA500' },
    { id: 'navy', name: 'Navy Blue', class: 'neon-text-navy', hex: '#000080' },
    { id: 'warm-white', name: 'Warm White', class: 'neon-text-warm-white', hex: '#fdf6e3' },
  ];

  const sizes = [
    { id: 'S', name: 'Small', width: '18"×10"', basePrice: 1999 },
    { id: 'M', name: 'Medium', width: '24"×13"', basePrice: 2999 },
    { id: 'L', name: 'Large', width: '30"×15"', basePrice: 4499 },
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
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6),
                     hsl(var(--neon-white) / 0.6)
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
                  <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-neon-white to-neon-white bg-clip-text text-transparent">
                    <Zap className="w-5 h-5 text-neon-white" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="rounded-lg min-h-[250px] sm:min-h-[300px] flex items-center justify-center px-4 sm:px-8 bg-cover bg-center relative neon-preview-container overflow-hidden"
                    style={{
                      backgroundImage: `url('/lovable-uploads/WhatsApp Image 2025-08-21 at 17.48.22_b0915fcf.jpg')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                    <div
                      className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-center ${selectedFontData?.family} ${selectedColorData?.class}`}
                      style={{
                        fontSize: selectedSize === 'S' ? 'clamp(1.5rem, 4vw, 2rem)' :
                          selectedSize === 'M' ? 'clamp(2rem, 6vw, 3rem)' :
                            selectedSize === 'L' ? 'clamp(2.5rem, 8vw, 4rem)' :
                              'clamp(3rem, 10vw, 5rem)',
                              fontWeight:'100',
                        color: selectedColorData?.hex,
                        textShadow: '0 0 100px currentColor, 0 0 20px currentColor, 0 0 300px currentColor, 1px 1px 2px rgba(0,0,0,0.6)',
                        lineHeight: '1.2',
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                        width: '100%',
                        paddingTop: '1.5rem'
                      }}
                    >
                      {customText || 'YOUR TEXT'}
                    </div>

                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <Button variant="outline" className="btn" onClick={handleDownloadPreview}>
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
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6)
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
                  <CardTitle className="bg-gradient-to-r from-neon-white to-neon-white bg-clip-text text-transparent">Price Breakdown</CardTitle>
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
                    <p color="white">₹{calculatePrice().toLocaleString()}</p>
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
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6)
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
                  <CardTitle className="bg-gradient-to-r from-neon-white to-neon-white bg-clip-text text-transparent">Text Settings</CardTitle>
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
                    <label className="block text-sm font-medium mb-2 ">Font Style</label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger className="bg-transperent border border-gray-600">
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
                          className={`p-3 rounded-lg border-2 transition-all ${selectedColor === color.id
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
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6), 
                     hsl(var(--neon-white) / 0.6)
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
                  <CardTitle className="bg-gradient-to-r from-neon-white to-neon-white bg-clip-text text-transparent">Size & Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Size (inch)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${selectedSize === size.id
                              ? 'border-neon-orange'
                              : 'border-border hover:border-muted-foreground'
                            }`}
                        >
                          <div className="text-left">
                            <div className="font-medium">{size.name}</div>
                            <div className="text-sm text-muted-foreground">{size.width}</div>
                            <div className="text-sm text-neon-white">₹{size.basePrice.toLocaleString()}</div>
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
                        <SelectTrigger className="bg-transperent border border-gray-600">
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
                  background: 'linear-gradient(135deg, hsl(var(--neon-white)), hsl(var(--neon-white)))',
                  color: 'hsl(var(--background))',
                  boxShadow: '0 0 20px hsl(var(--neon-white) / 0.4)'
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
                  border: '2px solid hsl(var(--neon-white))',
                  color: 'hsl(var(--neon-white))',
                  boxShadow: '0 0 20px hsl(var(--neon-white) / 0.3)'
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