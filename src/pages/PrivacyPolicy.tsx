import NeonText from '@/components/ui/NeonText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-8 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            <NeonText color="pink">Privacy</NeonText>{' '}
            <NeonText color="blue">Policy</NeonText>
          </h1>
          <p className="text-muted-foreground text-lg">
            Your privacy is important to us at Namastey lights
          </p>
        </div>

        <div className="space-y-8">
          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At Namastey lights, we collect information to provide better services to our customers. We collect the following types of information:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address when you place an order</li>
                <li><strong>Custom Design Information:</strong> Text, font preferences, color choices, and size specifications for your neon signs</li>
                <li><strong>Payment Information:</strong> Billing details processed securely through our payment partners</li>
                <li><strong>Technical Information:</strong> IP address, browser type, and device information for website optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Processing and fulfilling your custom neon sign orders</li>
                <li>Communicating with you about your order status and delivery updates</li>
                <li>Providing customer support and addressing your inquiries</li>
                <li>Improving our website, products, and services</li>
                <li>Sending promotional emails (only with your consent)</li>
                <li>Complying with legal obligations and protecting our rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>With our manufacturing partners to create your custom neon signs</li>
                <li>With shipping companies to deliver your orders</li>
                <li>With payment processors to handle transactions securely</li>
                <li>When required by law or to protect our legal rights</li>
                <li>With your explicit consent for specific purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>Secure servers and databases</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information by authorized personnel only</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of promotional communications</li>
                <li>Request data portability</li>
              </ul>
              <p>
                To exercise these rights, please contact us at believebrightcare@gmail.com or +91 83848 84622.
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our website uses cookies to enhance your browsing experience and provide personalized content. 
                You can control cookie settings through your browser preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: August 2025
              </p>
            </CardContent>
          </Card>

          <Card className="neon-card">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> believebrightcare@gmail.com</p>
                <p><strong>Phone:</strong> +91 83848 84622</p>
                <p><strong>Address:</strong>  Badaun, Uttar pradesh, India</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;