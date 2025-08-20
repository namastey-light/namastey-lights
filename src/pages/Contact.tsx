import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

const Contact = () => {

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'believebrightcare@gmail.com',
      description: 'Send us an email anytime!',
      action: 'mailto:believebrightcare@gmail.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 83848 84622',
      description: 'Mon-Sat 9AM to 8PM',
      action: 'tel:+9183848 84622'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: '+91 83848 84622',
      description: 'Quick support on WhatsApp',
      action: 'https://wa.me/918384884622?text=Hello%20I%20want%20to%20know%20more'
    },

    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Badaun, Uttar pradesh',
      description: 'India',
      action: '#'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-orbitron font-bold text-4xl md:text-6xl mb-6 text-neon-white neon-text">
            Get in Touch
          </h1>
          <p className="subtitle-cursive text-xl max-w-2xl mx-auto">
            Have questions about our neon signs? Need a custom quote? We're here to help you create the perfect lighting solution.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Business Hours */}
          <div className="mb-8">
            <Card className="neon-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Clock className="w-5 h-5 text-neon-blue" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <span className="font-medium">Monday - Friday</span>
                    <p className="text-neon-blue">9:00 AM - 8:00 PM</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium">Saturday</span>
                    <p className="text-neon-blue">10:00 AM - 6:00 PM</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium">Sunday</span>
                    <p className="text-muted-foreground">Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Methods - Non Visit Us cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {contactInfo.filter(contact => contact.title !== 'Visit Us').map((contact, index) => {
              const Icon = contact.icon;
              return (
                <Card key={index} className="neon-card group hover:neon-glow transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 rounded-lg bg-neon-blue/20">
                        <Icon className="w-8 h-8 text-neon-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{contact.title}</h3>
                        <p className="text-neon-pink font-medium text-lg">{contact.details}</p>
                        <p className="text-sm text-muted-foreground mt-1">{contact.description}</p>
                      </div>

                      {contact.action !== '#' && (
                        <Button
                          className="btn-outline-neon w-full"
                          onClick={() => window.open(contact.action, '_blank')}
                        >
                          Contact
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Visit Us Card - Full Width */}
          {(() => {
            const visitUsContact = contactInfo.find(contact => contact.title === 'Visit Us');
            if (!visitUsContact) return null;
            const Icon = visitUsContact.icon;
            return (
              <div className="mb-16">
                <Card className="neon-card group hover:neon-glow transition-all duration-300 max-w-md mx-auto">
                  <CardContent className="p-1 text-center">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="p-6 rounded-lg bg-neon-blue/20">
                        <Icon className="w-12 h-12 text-neon-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-2xl mb-3">{visitUsContact.title}</h3>
                        <p className="text-neon-pink font-medium text-xl">{visitUsContact.details}</p>
                        <p className="text-muted-foreground mt-2">{visitUsContact.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

          {/* FAQ Section */}
          <div className="max-w-6xl mx-auto">
            <Card className="neon-card">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="subtitle-cursive text-xl text-neon-blue mb-2">How long does delivery take?</h4>
                    <p className="text-sm subtitle-cursive">
                      Standard delivery is 7-10 business days. Custom designs may take 10-14 days depending on complexity.
                    </p>
                  </div>

                  <div className="text-center">
                    <h4 className="subtitle-cursive text-xl text-neon-blue mb-2">Do you offer installation services?</h4>
                    <p className="text-sm subtitle-cursive">
                      Yes! We provide professional installation services in major cities. Contact us for availability in your area.
                    </p>
                  </div>

                  <div className="text-center">
                    <h4 className="subtitle-cursive text-xl text-neon-blue mb-2">What's the warranty on your neon?</h4>
                    <p className="text-sm subtitle-cursive">
                      All our neon signs come with a 12-month warranty covering manufacturing defects and LED failures.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;