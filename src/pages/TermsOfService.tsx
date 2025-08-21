import NeonText from '@/components/ui/NeonText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-8 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <NeonText color="pink">Terms of</NeonText>{' '}
            <NeonText color="white">Service</NeonText>
          </h1>
          <p className="subtitle-cursive text-lg">
            Please read these terms carefully before using our services
          </p>
        </div>

        <div className="space-y-8">
          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using Namastey lights website and services, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Services Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Namastey lights specializes in creating custom neon signs and LED lights with premium quality materials. 
                Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Custom neon sign design and manufacturing</li>
                <li>Ready-made neon sign products</li>
                <li>Design consultation and customization tools</li>
                <li>Installation guidance and support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Order Process and Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                When placing an order for custom neon signs:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>You must provide accurate design specifications, text, colors, and size requirements</li>
                <li>Custom designs are final once production begins</li>
                <li>We reserve the right to contact you for clarification on design details</li>
                <li>Production time is 7-14 business days for custom orders</li>
                <li>You will receive a preview of your design before production starts</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Pricing and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All prices are displayed in Indian Rupees (INR) and include applicable taxes:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Prices may vary based on size, complexity, and customization options</li>
                <li>Payment is required before production begins</li>
                <li>We accept online payments and Cash on Delivery (COD)</li>
                <li>Additional charges may apply for rush orders or special requirements</li>
                <li>Prices are subject to change without prior notice</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Delivery and Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Delivery terms and conditions:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Delivery time varies by location and product complexity</li>
                <li>Shipping charges are calculated based on delivery location and product size</li>
                <li>We provide tracking information once your order is shipped</li>
                <li>Delivery address changes are not possible once the order is dispatched</li>
                <li>Signature confirmation may be required for high-value items</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Product Quality and Warranty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We stand behind the quality of our neon signs:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>All products come with a 1-year warranty against manufacturing defects</li>
                <li>LED strips have a 12-month warranty for optimal performance</li>
                <li>Warranty does not cover damage from misuse, accidents, or normal wear</li>
                <li>Installation must follow our provided guidelines to maintain warranty</li>
                <li>We reserve the right to inspect products for warranty claims</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Regarding intellectual property rights:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>You retain rights to your custom text and basic design concepts</li>
                <li>We retain rights to our manufacturing processes and techniques</li>
                <li>You are responsible for ensuring your designs don't infringe on others' rights</li>
                <li>We may refuse orders that contain copyrighted or trademarked content without permission</li>
                <li>Namastey lights reserves the right to showcase completed projects for marketing purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our liability is limited as follows:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Maximum liability is limited to the purchase price of the product</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Force majeure events are beyond our control and may affect delivery</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Cancellation and Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Order cancellation and modification policies:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Orders can be cancelled within 24 hours of placement by contact Us</li>
                <li>Once production begins, cancellation is not possible</li>
                <li>Design modifications may incur additional charges</li>
                <li>Ready-made products can be cancelled before shipping</li>
                <li>Refunds will be processed within 7-10 business days</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                These terms are governed by the laws of India. Any disputes will be resolved in the courts of 
                Badaun, Uttar pradesh, India.
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> believebrightcare@gmail.com</p>
                <p><strong>Phone:</strong> +91 83848 84622</p>
                <p><strong>Address:</strong> Badaun, Uttar pradesh, India</p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: August 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;