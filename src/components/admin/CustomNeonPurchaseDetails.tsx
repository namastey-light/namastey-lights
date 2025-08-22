import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, Palette, Type, Zap, X } from "lucide-react";
import NeonText from "@/components/ui/NeonText";

interface CustomNeonOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  custom_text: string;
  font_style: string;
  neon_color: string;
  size: string;
  has_dimmer: boolean;
  backing_shape: string;
  base_price: number;
  dimmer_price: number;
  backing_price: number;
  character_price: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  preview_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const CustomNeonPurchaseDetails = () => {
  const [orders, setOrders] = useState<CustomNeonOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CustomNeonOrder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCustomOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_neon_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message.includes('JWT')) {
          toast({
            title: "Authentication Error",
            description: "Please log in again.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching custom orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch custom neon orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('custom_neon_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully.",
      });

      fetchCustomOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('custom_neon_orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment status updated successfully.",
      });

      fetchCustomOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateOrderId = (id: string) => {
    return id.substring(0, 8).toUpperCase();
  };

  const colors = [
    { id: 'pink', name: 'Hot Pink', class: 'neon-text', hex: '#ff1493' },
    { id: 'blue', name: 'Electric Blue', class: 'neon-text-blue', hex: '#00bfff' },
    { id: 'purple', name: 'Neon Purple', class: 'neon-text-purple', hex: '#9945ff' },
    { id: 'white', name: 'Pure White', class: 'neon-text-white', hex: '#ffffff' },
  ];

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

  const sizes = [
    { id: 'Regular', name: 'Regular', width: '12"' },
    { id: 'Medium', name: 'Medium', width: '18"' },
    { id: 'Large', name: 'Large', width: '24"' },
  ];

  useEffect(() => {
    fetchCustomOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('custom-neon-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_neon_orders'
        },
        () => fetchCustomOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-neon-pink" />
            Custom Neon Light Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Order ID</TableHead>
                  <TableHead className="min-w-[120px]">Customer</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Custom Text</TableHead>
                  <TableHead className="min-w-[100px] hidden xl:table-cell">Font Style</TableHead>
                  <TableHead className="min-w-[80px] hidden md:table-cell">Base Price</TableHead>
                  <TableHead className="min-w-[80px] hidden sm:table-cell">Characters</TableHead>
                  <TableHead className="min-w-[80px] hidden sm:table-cell">Backing</TableHead>
                  <TableHead className="min-w-[80px] hidden sm:table-cell">Dimmer</TableHead>
                  <TableHead className="min-w-[100px]">Total</TableHead>
                  <TableHead className="min-w-[100px] hidden md:table-cell">Payment</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Date</TableHead>
                  <TableHead className="min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {generateOrderId(order.id)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                      <div className="lg:hidden text-xs text-muted-foreground mt-1">
                        "{order.custom_text.length > 20 ? order.custom_text.substring(0, 20) + '...' : order.custom_text}"
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="max-w-[150px] truncate text-sm">
                      "{order.custom_text}"
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <span className={`text-sm ${fonts.find(f => f.id === order.font_style)?.family || 'font-sans'}`}>
                      {fonts.find(f => f.id === order.font_style)?.name || 'Modern Sans'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">₹{order.base_price}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">₹{order.character_price}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">₹{order.backing_price}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">₹{order.dimmer_price}</TableCell>
                  <TableCell className="font-semibold">₹{order.total_amount.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                      <Badge variant={order.payment_method === 'cod' ? 'secondary' : 'default'} className="text-xs">
                        {order.payment_method === 'cod' ? 'COD' : 'Online'}
                      </Badge>
                      <div>
                        <Badge 
                          variant={
                            order.payment_status === 'paid' ? 'default' : 
                            order.payment_status === 'pending' ? 'secondary' : 
                            'destructive'
                          }
                          className="text-xs"
                        >
                          {order.payment_status === 'paid' ? 'Paid' : 
                           order.payment_status === 'pending' ? 'Pending' : 
                           order.payment_status === 'failed' ? 'Failed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Custom Neon Order Details - {selectedOrder && generateOrderId(selectedOrder.id)}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-sm">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm break-all">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm">{selectedOrder.customer_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Amount</label>
                    <p className="text-lg font-bold">₹{selectedOrder.total_amount.toLocaleString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Shipping Address</label>
                    <p className="text-sm">{selectedOrder.shipping_address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Payment Method</label>
                    <Badge variant={selectedOrder.payment_method === 'cod' ? 'secondary' : 'default'} className="text-xs">
                      {selectedOrder.payment_method === 'cod' ? 'COD' : 'Online Payment'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Payment Status</label>
                    <div>
                      <Badge 
                        variant={
                          selectedOrder.payment_status === 'paid' ? 'default' : 
                          selectedOrder.payment_status === 'pending' ? 'secondary' : 
                          'destructive'
                        }
                        className="text-xs"
                      >
                        {selectedOrder.payment_status === 'paid' ? 'Paid' : 
                         selectedOrder.payment_status === 'pending' ? 'Pending' : 
                         selectedOrder.payment_status === 'failed' ? 'Failed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Order Date</label>
                    <p className="text-sm">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Amount</label>
                    <p className="text-lg font-bold">₹{selectedOrder.total_amount.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Neon Design Details */}
              <Card className="border-neon-pink/20">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Live Preview */}
                    <div>
                      <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-neon-blue" />
                        Live Preview
                      </h4>
                      <div className="rounded-lg p-2 min-h-[200px] flex items-center justify-center bg-gray-100">
                        {selectedOrder.preview_image_url ? (
                          <img 
                            src={selectedOrder.preview_image_url} 
                            alt="Custom neon preview"
                            className="max-w-full max-h-[200px] object-contain rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              setImageModalSrc(selectedOrder.preview_image_url!);
                              setImageModalOpen(true);
                            }}
                          />
                        ) : (
                          <div 
                            className={`text-center ${fonts.find(f => f.id === selectedOrder.font_style)?.family} ${colors.find(c => c.id === selectedOrder.neon_color)?.class}`}
                            style={{ 
                              fontSize: selectedOrder.size === 'S' ? '1.5rem' : 
                                       selectedOrder.size === 'M' ? '2rem' : 
                                       selectedOrder.size === 'L' ? '2.5rem' : '3rem' 
                            }}
                          >
                            {selectedOrder.custom_text}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Configuration Details */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold">Configuration Details</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="font-medium flex items-center gap-1">
                            <Type className="h-3 w-3" />
                            Text
                          </label>
                          <p className="bg-muted p-2 rounded">"{selectedOrder.custom_text}"</p>
                        </div>
                        
                        <div>
                          <label className="font-medium">Font Style</label>
                          <p className={fonts.find(f => f.id === selectedOrder.font_style)?.family || 'font-sans'}>
                            {fonts.find(f => f.id === selectedOrder.font_style)?.name || 'Modern Sans'}
                          </p>
                        </div>
                        
                        <div>
                          <label className="font-medium flex items-center gap-1">
                            <Palette className="h-3 w-3" />
                            Neon Color
                          </label>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: colors.find(c => c.id === selectedOrder.neon_color)?.hex }}
                            />
                            <span>{colors.find(c => c.id === selectedOrder.neon_color)?.name}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="font-medium">Size</label>
                          <p>{sizes.find(s => s.id === selectedOrder.size)?.name} ({sizes.find(s => s.id === selectedOrder.size)?.width})</p>
                        </div>
                        
                        <div>
                          <label className="font-medium">Dimmer Control</label>
                          <Badge variant={selectedOrder.has_dimmer ? "default" : "secondary"}>
                            {selectedOrder.has_dimmer ? 'Yes (+₹200)' : 'No'}
                          </Badge>
                        </div>
                        
                        <div>
                          <label className="font-medium">Backing Shape</label>
                          <p className="capitalize">
                            {selectedOrder.backing_shape === 'rectangle' ? 'Rectangle (Free)' : 'Cut to Shape (+₹200)'}
                          </p>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="pt-3 border-t space-y-2">
                        <h5 className="font-semibold">Price Breakdown</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Base Price ({selectedOrder.size}):</span>
                            <span>₹{selectedOrder.base_price.toLocaleString()}</span>
                          </div>
                          {selectedOrder.character_price > 0 && (
                            <div className="flex justify-between">
                              <span>Extra Characters:</span>
                              <span>₹{selectedOrder.character_price.toLocaleString()}</span>
                            </div>
                          )}
                          {selectedOrder.dimmer_price > 0 && (
                            <div className="flex justify-between">
                              <span>Dimmer Add-on:</span>
                              <span>₹{selectedOrder.dimmer_price.toLocaleString()}</span>
                            </div>
                          )}
                          {selectedOrder.backing_price > 0 && (
                            <div className="flex justify-between">
                              <span>{selectedOrder.backing_shape === 'cut-to-shape' ? 'Cut to Shape:' : 'Rectangle Backing:'}</span>
                              <span>₹{selectedOrder.backing_price.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total:</span>
                            <span className="text-neon-pink">₹{selectedOrder.total_amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur"
              onClick={() => setImageModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={imageModalSrc}
              alt="Custom neon preview - enlarged"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};