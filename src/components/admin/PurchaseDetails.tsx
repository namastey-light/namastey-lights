import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Check, X, Clock, ZoomIn } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  subtotal?: number;
  delivery_fee?: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
  product_image?: string | null;
  product_config?: any;
  products?: {
    name: string;
    product_images?: {
      image_url: string;
    }[];
  } | null;
}

interface OrderWithItems extends Order {
  order_items: OrderItem[];
  subtotal?: number;
  delivery_fee?: number;
}

export function PurchaseDetails() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();

    // Set up real-time listeners for orders
    const ordersChannel = supabase
      .channel('admin-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders(); // Refetch when orders change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      const msg = String(error?.message || "");
      if (msg.includes("row-level security") || msg.includes("42501")) {
        setNeedsAuth(true);
        toast({
          title: "Admin login required",
          description: "Please sign in to view orders.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(
            id,
            order_id,
            product_id,
            product_name,
            quantity,
            price,
            created_at,
            product_image,
            product_config,
            products(
              name,
              product_images(image_url)
            )
          )
        `)
        .eq("id", orderId)
        .single();

      if (error) throw error;
      setSelectedOrder(data as OrderWithItems);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      
      fetchOrders();
      if (selectedOrder) {
        fetchOrderDetails(selectedOrder.id);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: paymentStatus })
        .eq("id", orderId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
      
      fetchOrders();
      if (selectedOrder) {
        fetchOrderDetails(selectedOrder.id);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Purchase Details</h1>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Purchase Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    NL{order.id.split('-')[0].toUpperCase()}
                  </TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.customer_email}</TableCell>
                  <TableCell>₹{order.subtotal || (order.total_amount - (order.delivery_fee || 299))}</TableCell>
                  <TableCell>₹{order.delivery_fee || 299}</TableCell>
                  <TableCell>₹{order.total_amount}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {order.payment_method === 'cod' ? 'COD' : 'Online Payment'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchOrderDetails(order.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Name:</strong> {selectedOrder.customer_name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedOrder.customer_email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedOrder.customer_phone || "N/A"}
                    </div>
                    <div>
                      <strong>Address:</strong> {selectedOrder.shipping_address}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Order ID:</strong> NL{selectedOrder.id.split('-')[0].toUpperCase()}
                    </div>
                    <div>
                      <strong>Subtotal:</strong> ₹{selectedOrder.subtotal || (selectedOrder.total_amount - (selectedOrder.delivery_fee || 299))}
                    </div>
                    <div>
                      <strong>Delivery Fee:</strong> ₹{selectedOrder.delivery_fee || 299}
                    </div>
                    <div>
                      <strong>Total Amount:</strong> ₹{selectedOrder.total_amount}
                    </div>
                    <div>
                      <strong>Payment Method:</strong>{" "}
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {selectedOrder.payment_method === 'cod' ? 'COD' : 'Online Payment'}
                      </span>
                    </div>
                    <div>
                      <strong>Payment Status:</strong>{" "}
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {selectedOrder.payment_status}
                      </span>
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Configuration</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.order_items.map((item) => {
                        const productImage = item.product_image || 
                                           item.products?.product_images?.[0]?.image_url || 
                                           '/placeholder.svg';
                        let config: any = item.product_config as any;
                        try { if (typeof config === 'string') config = JSON.parse(config); } catch {}
                        
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.product_name || item.products?.name || "Product not found"}
                            </TableCell>
                            <TableCell>
                              <div 
                                className="cursor-pointer relative group"
                                onClick={() => setSelectedImage(productImage)}
                              >
                                <img 
                                  src={productImage} 
                                  alt={item.product_name}
                                  className="w-20 h-20 object-cover rounded-lg transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <ZoomIn className="w-6 h-6 text-white" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {config && (
                                <div className="text-xs space-y-1">
                                  <div>Size: {config.size}</div>
                                  <div>Color: {config.color}</div>
                                  <div>Type: {config.productType}</div>
                                  {config.brightnessController && (
                                    <div className="text-green-600">✓ Brightness Controller</div>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>₹{item.price}</TableCell>
                            <TableCell>₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Zoom Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Product Image</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <img 
                src={selectedImage} 
                alt="Product preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}