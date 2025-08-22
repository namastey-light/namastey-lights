import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NeonText from '@/components/ui/NeonText';
import {
  CreditCard,
  Truck,
  Shield,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const { toast } = useToast();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    address1: '',
    address2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    preferredDate: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingFee = 0;
  const discount = 0;
  const grandTotal = state.totalPrice + shippingFee - discount;

  const handleRazorpayPayment = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Create Razorpay order
        const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
          body: {
            amount: grandTotal,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
          }
        });

        if (orderError) throw orderError;

        // Ensure Razorpay SDK is available
        const RazorpayConstructor = (window as any).Razorpay;
        if (!RazorpayConstructor) {
          throw new Error('Razorpay SDK failed to load');
        }

        // Initialize Razorpay
        const options = {
          key: 'rzp_test_R6GyW9jpjGA33l', // Your Razorpay Key ID (publishable)
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Neon Lights',
          description: 'Custom Neon Sign Order',
          order_id: orderData.id,
          handler: async (response: any) => {
            try {
              // Verify payment
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }
              });

              if (verifyError || !verifyData?.success) {
                throw new Error('Payment verification failed');
              }

              // Payment successful, save order then resolve
              await saveOrder('paid');
              resolve();
            } catch (err) {
              console.error('Verification/save error:', err);
              toast({
                title: 'Payment Verification Failed',
                description: 'We could not verify the payment. Please contact support.',
                variant: 'destructive'
              });
              reject(err);
            }
          },
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone
          },
          theme: {
            color: '#EC4899'
          },
          modal: {
            ondismiss: () => reject(new Error('Payment modal closed'))
          }
        } as any;

        const rzp = new RazorpayConstructor(options);

        rzp.on('payment.failed', (response: any) => {
          toast({
            title: 'Payment Failed',
            description: response?.error?.description ?? 'Your payment could not be completed.',
            variant: 'destructive'
          });
          reject(new Error(response?.error?.description ?? 'Payment failed'));
        });

        rzp.open();
      } catch (error) {
        console.error('Razorpay payment error:', error);
        toast({
          title: 'Payment Error',
          description: 'Failed to initialize payment. Please try again.',
          variant: 'destructive'
        });
        reject(error);
      }
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: 'customer' | 'delivery'
  ) => {
    const { name, value } = e.target;
    if (section === 'customer') {
      setCustomerInfo(prev => ({ ...prev, [name]: value }));
    } else {
      setDeliveryInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Handle Razorpay payment
      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment();
        return;
      }

      await saveOrder();
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveOrder = async (paymentStatus: string = 'pending') => {
    // Create order in database
    const fullAddress = `${deliveryInfo.address1}, ${deliveryInfo.address2 ? deliveryInfo.address2 + ', ' : ''}${deliveryInfo.landmark ? 'Near ' + deliveryInfo.landmark + ', ' : ''}${deliveryInfo.city}, ${deliveryInfo.state} - ${deliveryInfo.pincode}`;

    // Generate a UUID on the client to avoid SELECT RLS issues
    const orderUuid = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? crypto.randomUUID()
      : `${Date.now()}-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

    // Separate custom and regular items
    const customItems = state.items.filter(item => item.type === 'custom');
    const regularItems = state.items.filter(item => item.type !== 'custom');

    // Create display order number
    const displayOrderNo = `NL${orderUuid.split('-')[0].toUpperCase()}`;

    // Handle regular product orders
    if (regularItems.length > 0) {
      // Insert regular order with known UUID
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          id: orderUuid,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          shipping_address: fullAddress,
          subtotal: regularItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          delivery_fee: shippingFee,
          total_amount: regularItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingFee,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          status: 'pending'
        }]);

      if (orderError) throw orderError;

      // Insert regular order items
      const orderItems = regularItems.map(item => ({
        order_id: orderUuid,
        product_id: item.productConfig?.originalProductId || item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        product_image: item.image,
        product_config: item.productConfig || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // Handle custom neon orders (separate table)
    if (customItems.length > 0) {
      const customOrderItems = customItems.map(item => {
        const size = item.customConfig?.size || 'Medium';
        const text = item.customConfig?.text || '';
        const basePriceMap: Record<string, number> = { Regular: 1449, Medium: 1949, Large: 2450 };
        const base_price = basePriceMap[size] ?? 1949;
        const character_price = text.length > 5 ? (text.length - 5) * 100 : 0;
        const dimmer_price = item.customConfig?.hasDimmer ? 200 : 0;
        const backing_price = item.customConfig?.backingShape === 'cut-to-shape' ? 200 : 0;
        const total_per_item = base_price + character_price + dimmer_price + backing_price;

        return {
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          shipping_address: fullAddress,
          custom_text: item.customConfig?.text || '',
          font_style: item.customConfig?.font || 'orbitron',
          neon_color: item.customConfig?.color || 'pink',
          size: size,
          has_dimmer: item.customConfig?.hasDimmer || false,
          backing_shape: item.customConfig?.backingShape || 'cut-to-shape',
          preview_image_url: item.customConfig?.previewImageUrl || null,
          base_price,
          dimmer_price,
          backing_price,
          character_price,
          total_amount: total_per_item * item.quantity,
          payment_method: paymentMethod,
          status: 'pending',
          payment_status: paymentStatus
        };
      });

      const { error: customOrderError } = await supabase
        .from('custom_neon_orders')
        .insert(customOrderItems);

      if (customOrderError) {
        console.error('Error saving custom orders:', customOrderError);
        throw customOrderError;
      }
    }

    // Store order details for confirmation page
    localStorage.setItem('lastOrderDetails', JSON.stringify({
      orderId: displayOrderNo,
      totalAmount: grandTotal,
      paymentMethod,
      shippingAddress: fullAddress,
      customerName: customerInfo.name
    }));

    if (paymentMethod === 'razorpay') {
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${displayOrderNo} has been confirmed. You'll receive a confirmation email shortly.`,
      });
    } else {
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${displayOrderNo} confirmed for Cash on Delivery. We'll call you before delivery.`,
      });
    }

    clearCart();
    navigate(`/order-confirmation?orderId=${displayOrderNo}`);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-orbitron font-bold text-3xl mb-4">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button asChild className="btn-neon">
            <a href="/products">Continue Shopping</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-orbitron font-bold text-4xl text-center mb-8">
          <NeonText color="pink">Secure</NeonText>{' '}
          <NeonText color="white">Checkout</NeonText>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer & Delivery Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <Card className="neon-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-neon-white" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={customerInfo.name}
                        onChange={(e) => handleInputChange(e, 'customer')}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange(e, 'customer')}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange(e, 'customer')}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card className="neon-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-neon-white" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      name="address1"
                      required
                      value={deliveryInfo.address1}
                      onChange={(e) => handleInputChange(e, 'delivery')}
                      placeholder="House/Flat/Building name and number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      name="address2"
                      value={deliveryInfo.address2}
                      onChange={(e) => handleInputChange(e, 'delivery')}
                      placeholder="Street, Area, Colony"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        name="landmark"
                        value={deliveryInfo.landmark}
                        onChange={(e) => handleInputChange(e, 'delivery')}
                        placeholder="Near..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        required
                        value={deliveryInfo.city}
                        onChange={(e) => handleInputChange(e, 'delivery')}
                        placeholder="Mumbai"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={deliveryInfo.state} onValueChange={(value) => setDeliveryInfo(prev => ({ ...prev, state: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* States */}
                          <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                          <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                          <SelectItem value="assam">Assam</SelectItem>
                          <SelectItem value="bihar">Bihar</SelectItem>
                          <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                          <SelectItem value="goa">Goa</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="haryana">Haryana</SelectItem>
                          <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                          <SelectItem value="jharkhand">Jharkhand</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="kerala">Kerala</SelectItem>
                          <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="manipur">Manipur</SelectItem>
                          <SelectItem value="meghalaya">Meghalaya</SelectItem>
                          <SelectItem value="mizoram">Mizoram</SelectItem>
                          <SelectItem value="nagaland">Nagaland</SelectItem>
                          <SelectItem value="odisha">Odisha</SelectItem>
                          <SelectItem value="punjab">Punjab</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="sikkim">Sikkim</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="telangana">Telangana</SelectItem>
                          <SelectItem value="tripura">Tripura</SelectItem>
                          <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                          <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                          <SelectItem value="west-bengal">West Bengal</SelectItem>

                          {/* Union Territories */}
                          <SelectItem value="andaman-nicobar">Andaman and Nicobar Islands</SelectItem>
                          <SelectItem value="chandigarh">Chandigarh</SelectItem>
                          <SelectItem value="dadra-nagar-haveli-daman-diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="jammu-kashmir">Jammu and Kashmir</SelectItem>
                          <SelectItem value="ladakh">Ladakh</SelectItem>
                          <SelectItem value="lakshadweep">Lakshadweep</SelectItem>
                          <SelectItem value="puducherry">Puducherry</SelectItem>

                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        required
                        pattern="[0-9]{6}"
                        value={deliveryInfo.pincode}
                        onChange={(e) => handleInputChange(e, 'delivery')}
                        placeholder="400001"
                      />
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="neon-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-neon-white" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 hover:bg-white/5">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Online Payment</p>
                            <p className="text-sm text-muted-foreground">
                              Credit/Debit Card, UPI, Net Banking via Razorpay
                            </p>
                          </div>
                          <Shield className="w-5 h-5 text-neon-green" />
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 hover:bg-white/5">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              Pay when your order is delivered
                            </p>
                          </div>
                          <Truck className="w-5 h-5 text-neon-white" />
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="neon-card sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{state.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>₹{shippingFee.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-neon-green">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                      <span>Total</span>
                      <p color="white">₹{grandTotal.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="btn-neon w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      'Processing...'
                    ) : paymentMethod === 'razorpay' ? (
                      'Pay Now'
                    ) : (
                      'Place Order'
                    )}
                  </Button>

                  <div className="text-center text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Your payment information is secure and encrypted
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;