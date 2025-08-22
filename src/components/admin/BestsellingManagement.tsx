import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Star, MoveUp, MoveDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  selling_price: number;
  description: string;
}

interface BestsellingProduct {
  id: string;
  product_id: string;
  display_order: number;
  is_active: boolean;
  badge_text: string;
  products: Product;
}

const BestsellingManagement = () => {
  const [bestsellingProducts, setBestsellingProducts] = useState<BestsellingProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [badgeText, setBadgeText] = useState('Bestseller');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBestsellingProducts();
    fetchAllProducts();
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
            selling_price,
            description
          )
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBestsellingProducts(data || []);
    } catch (error) {
      console.error('Error fetching bestselling products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bestselling products.",
        variant: "destructive",
      });
    }
  };

  const fetchAllProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, selling_price, description')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setAllProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addBestsellingProduct = async () => {
    console.log('Attempting to add bestselling product...');
    console.log('Selected product:', selectedProduct);
    console.log('Badge text:', badgeText);
    
    // Check current user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('Current user:', user);
    console.log('User error:', userError);
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const nextOrder = Math.max(...bestsellingProducts.map(p => p.display_order), 0) + 1;
      
      const { error } = await supabase
        .from('bestselling_products')
        .insert({
          product_id: selectedProduct,
          display_order: nextOrder,
          badge_text: badgeText,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bestselling product added successfully.",
      });

      setSelectedProduct('');
      setBadgeText('Bestseller');
      fetchBestsellingProducts();
    } catch (error: any) {
      console.error('Error adding bestselling product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add bestselling product.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeBestsellingProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bestselling_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bestselling product removed successfully.",
      });

      fetchBestsellingProducts();
    } catch (error) {
      console.error('Error removing bestselling product:', error);
      toast({
        title: "Error",
        description: "Failed to remove bestselling product.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('bestselling_products')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });

      fetchBestsellingProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        title: "Error",
        description: "Failed to update product status.",
        variant: "destructive",
      });
    }
  };

  const updateOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('bestselling_products')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) throw error;
      fetchBestsellingProducts();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update display order.",
        variant: "destructive",
      });
    }
  };

  const moveUp = (product: BestsellingProduct) => {
    const currentIndex = bestsellingProducts.findIndex(p => p.id === product.id);
    if (currentIndex > 0) {
      const prevProduct = bestsellingProducts[currentIndex - 1];
      updateOrder(product.id, prevProduct.display_order);
      updateOrder(prevProduct.id, product.display_order);
    }
  };

  const moveDown = (product: BestsellingProduct) => {
    const currentIndex = bestsellingProducts.findIndex(p => p.id === product.id);
    if (currentIndex < bestsellingProducts.length - 1) {
      const nextProduct = bestsellingProducts[currentIndex + 1];
      updateOrder(product.id, nextProduct.display_order);
      updateOrder(nextProduct.id, product.display_order);
    }
  };

  const availableProducts = allProducts.filter(
    product => !bestsellingProducts.some(bp => bp.product_id === product.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Star className="w-6 h-6 text-neon-pink" />
        <h2 className="text-2xl font-orbitron font-bold text-neon-pink">
          Bestselling Products Management
        </h2>
      </div>

      {/* Add New Bestselling Product */}
      <Card className="neon-card">
        <CardHeader>
          <CardTitle className="text-neon-white">Add New Bestselling Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="product-select">Select Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - ₹{product.selling_price?.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="badge-text">Badge Text</Label>
              <Input
                id="badge-text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g., Bestseller, Popular, New"
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={addBestsellingProduct} 
                disabled={isLoading || !selectedProduct}
                className="btn-neon"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Bestselling Products */}
      <Card className="neon-card">
        <CardHeader>
          <CardTitle className="text-neon-white">Current Bestselling Products</CardTitle>
        </CardHeader>
        <CardContent>
          {bestsellingProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bestselling products configured yet.
            </div>
          ) : (
            <div className="space-y-4">
              {bestsellingProducts.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-card/50">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveUp(item)}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveDown(item)}
                        disabled={index === bestsellingProducts.length - 1}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground">{item.products.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Price: ₹{item.products.selling_price?.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{item.badge_text}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Display Order: {item.display_order}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${item.id}`} className="text-sm">
                        Active
                      </Label>
                      <Switch
                        id={`active-${item.id}`}
                        checked={item.is_active}
                        onCheckedChange={(checked) => toggleActive(item.id, checked)}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBestsellingProduct(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BestsellingManagement;