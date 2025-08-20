import { Share2, Copy, MessageCircle, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

interface ProductShareButtonProps {
  productId: string;
  productName: string;
  productImage?: string;
}

const ProductShareButton = ({ productId, productName, productImage }: ProductShareButtonProps) => {
  const { toast } = useToast();
  
  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/products/${productId}`;
  const shareText = `Check out this amazing neon sign: ${productName}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      toast({
        title: "Link Copied!",
        description: "Product link has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive"
      });
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${productUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: shareText,
          url: productUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full backdrop-blur-sm hover:bg-purple-500/10 transition-all duration-300 rounded-xl"
          style={{
            border: '1px solid hsl(var(--neon-purple) / 0.5)',
            boxShadow: '0 0 15px hsl(var(--neon-purple) / 0.2)'
          }}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Product
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWhatsAppShare}
            className="justify-start gap-2 hover:bg-green-500/10 hover:text-green-400"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTwitterShare}
            className="justify-start gap-2 hover:bg-blue-500/10 hover:text-blue-400"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="justify-start gap-2 hover:bg-purple-500/10 hover:text-purple-400"
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </Button>
          {navigator.share && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNativeShare}
              className="justify-start gap-2 hover:bg-neon-white/10 hover:text-neon-white"
            >
              <Share2 className="w-4 h-4" />
              More Options
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductShareButton;