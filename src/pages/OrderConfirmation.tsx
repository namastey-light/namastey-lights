import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Phone, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NeonText from '@/components/ui/NeonText';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'Unknown';
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get order details from localStorage if available
    const savedOrderDetails = localStorage.getItem('lastOrderDetails');
    if (savedOrderDetails) {
      setOrderDetails(JSON.parse(savedOrderDetails));
      // Clear after retrieving
      localStorage.removeItem('lastOrderDetails');
    }
  }, []);

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-4" />
          <h1 className="font-orbitron font-bold text-4xl mb-4">
            <NeonText color="green">Order</NeonText>{' '}
            <NeonText color="white">Confirmed!</NeonText>
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We'll get started on your custom neon sign right away!
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="neon-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-neon-white" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span>{orderDetails?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold text-neon-white">
                  ₹{orderDetails?.totalAmount?.toLocaleString() || '0'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-neon-white" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-muted-foreground">Delivery Address:</p>
                <p className="font-medium">
                  {orderDetails?.shippingAddress || 'Address will be confirmed via call'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Estimated Delivery:</p>
                <p className="font-medium">7-14 business days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tracking:</p>
                <p className="text-sm">You'll receive tracking details via email/SMS</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="neon-card mb-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-neon-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-neon-white" />
                </div>
                <h3 className="font-medium mb-2">Confirmation Call</h3>
                <p className="text-sm text-muted-foreground">
                  We'll call you within 24 hours to confirm your order details and design specifications.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-neon-pink/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-neon-pink" />
                </div>
                <h3 className="font-medium mb-2">Production</h3>
                <p className="text-sm text-muted-foreground">
                  Once confirmed, we'll start crafting your custom neon sign with premium materials.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="font-medium mb-2">Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Your neon sign will be carefully packaged and delivered to your doorstep.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="neon-card mb-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neon-white" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm text-muted-foreground">+91 83848 84622</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neon-white" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm text-muted-foreground">believebrightcare@gmail.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="border-white/20 hover:bg-white/10">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild className="btn-neon">
            <Link to="/products">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;