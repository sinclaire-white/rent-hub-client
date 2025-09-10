
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react'; // Import some icons

export default function ViewAllListings() {
  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Icon for visual appeal */}
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Search className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h2 className="text-3xl font-bold md:text-4xl text-base-content">
            Haven't Found Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Perfect Listing</span> Yet?
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Explore our vast collection of thousands of unique listings. From everyday essentials to extraordinary experiences, find exactly what you're looking for.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/rent-posts" className="btn btn-primary btn-lg group">
              Explore All Listings
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/how-it-works" className="btn btn-outline btn-lg">
              How It Works
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}