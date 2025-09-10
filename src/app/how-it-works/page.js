'use client';

import { Search, Calendar, CreditCard, Star } from 'lucide-react';

const steps = [
  {
    icon: <Search size={32} />,
    title: 'Search & Discover',
    description: 'Browse thousands of rental options across all categories'
  },
  {
    icon: <Calendar size={32} />,
    title: 'Book & Reserve',
    description: 'Select your dates and make a reservation instantly'
  },
  {
    icon: <CreditCard size={32} />,
    title: 'Secure Payment',
    description: 'Pay securely with our encrypted payment system'
  },
  {
    icon: <Star size={32} />,
    title: 'Enjoy & Review',
    description: 'Enjoy your rental experience and share your feedback'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">How RentHub Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Renting has never been easier. Follow these simple steps to find your perfect rental
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              {step.icon}
            </div>
            <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              {index + 1}
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}