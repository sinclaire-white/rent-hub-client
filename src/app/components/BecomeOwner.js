'use client';

import Link from 'next/link';

export default function BecomeOwnerSection() {
  return (
    <section className="py-12 bg-primary text-primary-content text-center">
      <h2 className="text-3xl font-bold mb-4">Start Earning Today!</h2>
      <p className="mb-6 max-w-2xl mx-auto">
        Join thousands of owners renting out their assets – from cars to rice fields. Pay a small fee to list your items and start earning!
      </p>
      <Link href="/become-owner" className="btn btn-secondary">Become an Owner</Link>
    </section>
  );
}