import NeonText from '@/components/ui/NeonText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShippingInfo = () => {
  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <NeonText color="pink">Shipping</NeonText>{' '}
            <NeonText color="blue">Information</NeonText>
          </h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about delivery of your neon signs
          </p>
        </div>

        <div className="space-y-8">
          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Shipping Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At Namastey lights, we ensure your custom neon signs reach you safely and on time. We offer various 
                shipping options to meet your delivery needs across India and internationally.
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Domestic Shipping (India)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Delivery Areas:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Badaun</strong> Next-day delivery available</li>
                <li><strong>Major Cities:</strong> Delhi, Bangalore, Chennai, Kolkata, Hyderabad (2-3 days)</li>
                <li><strong>Other Cities:</strong> 4-7 business days</li>
                <li><strong>Remote Areas:</strong> 7-10 business days (additional charges may apply)</li>
              </ul>
              
              <h4 className="font-semibold mt-6">Shipping Charges:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Standard Delivery:</strong> ₹299 (Free for orders above ₹5,000)</li>
                <li><strong>Express Delivery:</strong> ₹599 (Major cities only)</li>
                <li><strong>Large/Heavy Items:</strong> Calculated based on dimensions and weight</li>
                <li><strong>Cash on Delivery:</strong> Additional ₹50 service charge</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>International Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We ship to select international destinations:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Available Countries:</strong> UAE, USA, UK, Canada, Australia, Singapore</li>
                <li><strong>Delivery Time:</strong> 15-20 business days</li>
                <li><strong>Shipping Cost:</strong> Calculated based on destination and product size</li>
                <li><strong>Customs & Duties:</strong> Customer responsibility</li>
                <li><strong>Documentation:</strong> Commercial invoice and customs declaration included</li>
              </ul>
              <p className="mt-4">
                <strong>Note:</strong> International shipping availability depends on current regulations and may vary.
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Production & Processing Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Custom Neon Signs:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Simple Designs:</strong> 7-10 business days</li>
                <li><strong>Complex Designs:</strong> 10-14 business days</li>
                <li><strong>Large Signs (&gt;100cm):</strong> 14-21 business days</li>
                <li><strong>Rush Orders:</strong> 3-5 business days (additional charges apply)</li>
              </ul>
              
              <h4 className="font-semibold mt-6">Ready-Made Products:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>In Stock Items:</strong> Same day processing</li>
                <li><strong>Out of Stock:</strong> 3-5 business days to restock</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Packaging & Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We take special care in packaging your neon signs:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Protective Materials:</strong> Bubble wrap, foam padding, and rigid boxes</li>
                <li><strong>Fragile Handling:</strong> All packages marked as "Fragile" and "This Side Up"</li>
                <li><strong>Weather Protection:</strong> Waterproof packaging for monsoon season</li>
                <li><strong>Insurance:</strong> All shipments insured against damage or loss</li>
                <li><strong>Tracking:</strong> Real-time tracking information provided</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Stay updated on your order status:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Order Confirmation:</strong> Immediate email with order details</li>
                <li><strong>Production Update:</strong> Email when manufacturing begins</li>
                <li><strong>Dispatch Notification:</strong> Tracking number sent when shipped</li>
                <li><strong>Delivery Confirmation:</strong> SMS/Email when delivered</li>
                <li><strong>Live Tracking:</strong> Track your package in real-time on our website</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Delivery Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Before Delivery:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Delivery partner will call 1-2 hours before arrival</li>
                <li>Ensure someone is available to receive the package</li>
                <li>Keep a valid ID proof ready for verification</li>
              </ul>
              
              <h4 className="font-semibold mt-4">During Delivery:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Inspect the package before accepting delivery</li>
                <li>Check for any visible damage to packaging</li>
                <li>Sign the delivery receipt only after inspection</li>
                <li>Report any issues immediately to our customer service</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Delivery Attempts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our delivery process includes multiple attempts:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>First Attempt:</strong> Delivery to provided address</li>
                <li><strong>Second Attempt:</strong> Next business day if first attempt fails</li>
                <li><strong>Third Attempt:</strong> Customer must arrange pickup or reschedule</li>
                <li><strong>Failed Delivery:</strong> Package returned to NeonCraft after 3 attempts</li>
                <li><strong>Redelivery Charges:</strong> ₹199 for failed delivery due to customer unavailability</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Special Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Large/Heavy Items:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Advance appointment scheduled for delivery</li>
                <li>Two-person delivery team for items over 50kg</li>
                <li>Ground floor delivery included; stairs delivery extra charge</li>
                <li>Assembly service available at additional cost</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Shipping Restrictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Please note the following restrictions:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>No delivery to PO Box addresses</li>
                <li>Limited delivery to remote/hilly areas</li>
                <li>Some pin codes may not be serviceable</li>
                <li>Large items may require special courier arrangements</li>
                <li>International shipping restricted for certain electronic components</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Customer Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                For shipping-related queries or support:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> believebrightcare@gmail.com</p>
                <p><strong>Phone:</strong> +91 83848 84622</p>
                <p><strong>WhatsApp:</strong> +91 83848 84622</p>
                <p><strong>Business Hours:</strong> Monday - Saturday, 10:00 AM - 7:00 PM IST</p>
                <p><strong>Emergency Support:</strong> Available for delivery issues</p>
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

export default ShippingInfo;