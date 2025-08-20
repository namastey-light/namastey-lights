import NeonText from '@/components/ui/NeonText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <NeonText color="pink">Return</NeonText>{' '}
            <NeonText color="blue">Policy</NeonText>
          </h1>
          <p className="text-muted-foreground text-lg">
            Your satisfaction is our priority at Namastey lights
          </p>
        </div>

        <div className="space-y-8">
          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Return Policy Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At Namastey lights, we want you to be completely satisfied with your purchase. Due to the custom nature 
                of our neon signs, returns are subject to specific conditions outlined below.
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Custom Neon Signs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Custom neon signs are generally non-returnable</strong> due to their personalized nature. However, 
                we will accept returns in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Manufacturing Defects:</strong> If the product has defects in materials or workmanship</li>
                <li><strong>Shipping Damage:</strong> If the product arrives damaged due to shipping</li>
                <li><strong>Incorrect Order:</strong> If we made an error in your custom specifications</li>
              </ul>
              <p className="mt-4">
                <strong>Note:</strong> Returns are not accepted for changes of mind, incorrect design specifications 
                provided by the customer, or minor color variations that may occur in the manufacturing process.
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Ready-Made Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Ready-made neon signs can be returned within <strong>7 days</strong> of delivery under the following conditions:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Product must be in original, unused condition</li>
                <li>All original packaging and accessories must be included</li>
                <li>No damage to the product or packaging</li>
                <li>Return shipping costs will be borne by the customer unless the return is due to our error</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Return Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                To initiate a return, please follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Contact our customer service team within 7 days of delivery</li>
                <li>Provide your order number and reason for return</li>
                <li>Wait for return authorization and instructions</li>
                <li>Carefully package the item in original packaging</li>
                <li>Ship the item using the provided return label (if applicable)</li>
                <li>Track your return shipment</li>
              </ol>
              <p className="mt-4">
                <strong>Important:</strong> Do not return items without prior authorization. Unauthorized returns may be refused.
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Refund Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Once we receive and inspect your returned item:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Inspection will be completed within 2-3 business days</li>
                <li>Approved refunds will be processed within 7-10 business days</li>
                <li>Refunds will be issued to the original payment method</li>
                <li>Original shipping charges are non-refundable (unless return is due to our error)</li>
                <li>You will receive an email confirmation once the refund is processed</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Exchanges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We offer exchanges for ready-made products under the following conditions:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Exchange must be requested within 7 days of delivery</li>
                <li>Item must be in original condition with all packaging</li>
                <li>Exchanges are subject to product availability</li>
                <li>Price differences (if any) will be adjusted in the final transaction</li>
                <li>Custom products cannot be exchanged</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Warranty Claims</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                For warranty-related issues:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Contact us with proof of purchase and description of the issue</li>
                <li>We may request photos or videos of the defect</li>
                <li>Warranty claims are evaluated on a case-by-case basis</li>
                <li>Repair, replacement, or refund will be provided based on the warranty terms</li>
                <li>Return shipping for warranty claims is covered by NeonCraft</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Non-Returnable Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Custom neon signs with personalized text or designs (unless defective)</li>
                <li>Items damaged by customer misuse or improper installation</li>
                <li>Products returned after the 7-day return window</li>
                <li>Items without original packaging or accessories</li>
                <li>Products with signs of wear, damage, or alteration</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>International Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                For international customers:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Return shipping costs are the responsibility of the customer</li>
                <li>Customers are responsible for any customs duties or taxes</li>
                <li>Processing time may be longer due to customs clearance</li>
                <li>Please contact us before initiating an international return</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Customer Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you have questions about returns or need assistance, please contact our customer service team:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> believebrightcare@gmail.com</p>
                <p><strong>Phone:</strong> +91 83848 84622</p>
                <p><strong>Business Hours:</strong> Monday - Saturday, 10:00 AM - 7:00 PM IST</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
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

export default ReturnPolicy;