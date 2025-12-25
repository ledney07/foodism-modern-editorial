import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import CancelSubscriptionModal from '../components/CancelSubscriptionModal';
import { Check, Sparkles, ArrowRight, Star, Map, Calendar, Lock } from 'lucide-react';

const PremiumPage = (): React.ReactElement => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const features = [
    {
      icon: <Map className="w-6 h-6" />,
      title: 'Curated Wine Maps',
      description: 'Exclusive access to detailed wine region guides and vineyard recommendations',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Early Event Access',
      description: 'Be first to know about exclusive tastings, pop-ups, and culinary events',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Premium Guides',
      description: 'In-depth restaurant reviews, chef interviews, and insider dining tips',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Exclusive Reservations',
      description: 'Priority booking for Toronto\'s most exclusive tables and private dining experiences',
    },
  ];

  const plans = [
    {
      name: 'Monthly',
      price: 9.99,
      annualPrice: 0,
      period: 'month',
      popular: false,
    },
    {
      name: 'Annual',
      price: 99.99,
      annualPrice: 8.33,
      period: 'year',
      popular: true,
      savings: 'Save 30%',
    },
  ];

  const selectedPlan = isAnnual ? plans[1] : plans[0];
  const displayPrice = isAnnual ? selectedPlan.annualPrice : selectedPlan.price;

  const handleConfirmCancel = (reason: string) => {
    // In a real application, you would send this to your backend API
    console.log('Cancellation reason:', reason);
    
    // Save cancellation to localStorage (for demo purposes)
    const cancellations = JSON.parse(localStorage.getItem('subscriptionCancellations') || '[]');
    cancellations.push({
      reason,
      date: new Date().toISOString(),
    });
    localStorage.setItem('subscriptionCancellations', JSON.stringify(cancellations));
    
    // Show confirmation
    alert('Your Premium membership has been cancelled. You will continue to have access until the end of your current billing period.');
    
    setShowCancelModal(false);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-white">
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Breadcrumb */}
        <section className="mb-8 pt-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Premium Access' }
            ]}
          />
        </section>

        {/* Hero Section */}
        <section className="mb-20 text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="p-4 bg-[#f9b233] rounded-full">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-black mb-6">
            Experience the<br />Golden Standard
          </h1>
          <p className="text-xl text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
            Unlock exclusive content, curated guides, and early access to Toronto's most exclusive culinary experiences.
          </p>
        </section>

        {/* Pricing Toggle */}
        <section className="mb-16 flex justify-center">
          <div className="flex items-center space-x-4 bg-neutral-100 p-2 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                !isAnnual
                  ? 'bg-[#f9b233] text-black'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all relative ${
                isAnnual
                  ? 'bg-[#f9b233] text-black'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Annual
              {selectedPlan.popular && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] px-2 py-1 rounded-full font-black">
                  SAVE 30%
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="mb-20 max-w-4xl mx-auto">
          <div className="bg-neutral-900 text-white rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#f9b233]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
                <div>
                  <h2 className="font-serif text-4xl md:text-5xl font-black mb-4">
                    Premium Membership
                  </h2>
                  <p className="text-neutral-400 text-lg font-light">
                    {isAnnual ? 'Billed annually' : 'Billed monthly'}
                  </p>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="flex items-baseline">
                    <span className="text-5xl md:text-7xl font-black">${displayPrice.toFixed(2)}</span>
                    <span className="text-2xl text-neutral-400 ml-2">/{selectedPlan.period}</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-neutral-400 mt-2">
                      ${plans[0].price}/month billed annually
                    </p>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#f9b233]/20 flex items-center justify-center flex-shrink-0 text-[#f9b233]">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-lg mb-2">{feature.title}</h3>
                      <p className="text-neutral-400 font-light text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
                <div className="text-sm text-neutral-400">
                  <p>✓ Cancel anytime</p>
                  <p>✓ 30-day money-back guarantee</p>
                </div>
                <button className="w-full md:w-auto bg-[#f9b233] text-black px-12 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#e5a022] transition-all shadow-2xl flex items-center justify-center group">
                  Get Premium Access
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Benefits */}
        <section className="mb-20">
          <h2 className="font-serif text-4xl font-black text-center mb-12">
            What's Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-neutral-50 rounded-2xl">
              <div className="w-16 h-16 bg-[#f9b233] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-black text-xl mb-4">Unlimited Access</h3>
              <p className="text-neutral-600 font-light">
                Access all premium articles, guides, and exclusive content without limits
              </p>
            </div>
            <div className="text-center p-8 bg-neutral-50 rounded-2xl">
              <div className="w-16 h-16 bg-[#f9b233] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-black text-xl mb-4">Member-Only Events</h3>
              <p className="text-neutral-600 font-light">
                Invitations to exclusive tastings, chef dinners, and culinary experiences
              </p>
            </div>
            <div className="text-center p-8 bg-neutral-50 rounded-2xl">
              <div className="w-16 h-16 bg-[#f9b233] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-black text-xl mb-4">Ad-Free Experience</h3>
              <p className="text-neutral-600 font-light">
                Enjoy all content without interruptions from advertisements
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl font-black text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your Premium membership at any time. Your access will continue until the end of your billing period.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and PayPal for Premium subscriptions.',
              },
              {
                q: 'Is there a free trial?',
                a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us within 30 days for a full refund.',
              },
              {
                q: 'Do I get access to past premium content?',
                a: 'Yes, as a Premium member, you get unlimited access to our entire archive of premium articles and guides.',
              },
            ].map((item, index) => (
              <div key={index} className="border-b border-neutral-200 pb-6">
                <h3 className="font-black text-lg mb-3">{item.q}</h3>
                <p className="text-neutral-600 font-light leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cancel Membership Link */}
        <section className="mt-20 text-center">
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-sm text-neutral-400 hover:text-[#f9b233] transition-colors underline underline-offset-4"
          >
            Cancel your Premium membership
          </button>
        </section>
      </div>
    </div>
  );
};

export default PremiumPage;

