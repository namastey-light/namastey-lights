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

  const sizes = [
    { id: 'S', name: 'Small', width: '30cm' },
    { id: 'M', name: 'Medium', width: '50cm' },
    { id: 'L', name: 'Large', width: '70cm' },
    { id: 'XL', name: 'Extra Large', width: '100cm' },
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Custom Text</TableHead>
                <TableHead>Font Style</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Characters</TableHead>
                <TableHead>Backing</TableHead>
                <TableHead>Dimmer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">
                    {generateOrderId(order.id)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate">
                      "{order.custom_text}"
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={fonts.find(f => f.id === order.font_style)?.family || 'font-sans'}>
                      {fonts.find(f => f.id === order.font_style)?.name || 'Modern Sans'}
                    </span>
                  </TableCell>
                  <TableCell>₹{order.base_price}</TableCell>
                  <TableCell>₹{order.character_price}</TableCell>
                  <TableCell>₹{order.backing_price}</TableCell>
                  <TableCell>₹{order.dimmer_price}</TableCell>
                  <TableCell className="font-semibold">₹{order.total_amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={order.payment_method === 'cod' ? 'secondary' : 'default'}>
                        {order.payment_method === 'cod' ? 'COD' : 'Online Payment'}
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
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p>{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p>{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p>{selectedOrder.customer_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Amount</label>
                    <p className="text-lg font-bold">₹{selectedOrder.total_amount.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Shipping Address</label>
                    <p>{selectedOrder.shipping_address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Payment Method</label>
                    <Badge variant={selectedOrder.payment_method === 'cod' ? 'secondary' : 'default'}>
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
                      >
                        {selectedOrder.payment_status === 'paid' ? 'Paid' : 
                         selectedOrder.payment_status === 'pending' ? 'Pending' : 
                         selectedOrder.payment_status === 'failed' ? 'Failed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Order Date</label>
                    <p>{formatDate(selectedOrder.created_at)}</p>
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
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
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
                            {selectedOrder.has_dimmer ? 'Yes (+₹499)' : 'No'}
                          </Badge>
                        </div>
                        
                        <div>
                          <label className="font-medium">Backing Shape</label>
                          <p className="capitalize">
                            {selectedOrder.backing_shape === 'rectangle' ? 'Rectangle (+₹299)' : 'Cut to Shape (Free)'}
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
                              <span>Rectangle Backing:</span>
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