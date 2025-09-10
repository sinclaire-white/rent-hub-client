// app/components/Categories.jsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// A simple skeleton component to show while data is loading
const SkeletonCard = () => (
  <div className="shadow-xl card bg-base-100 dark:bg-base-200 animate-pulse">
    <div className="text-center card-body">
      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-base-300"></div>
      <div className="w-24 h-4 mx-auto bg-base-300 rounded-md"></div>
    </div>
  </div>
);

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch categories from the dedicated API route
    fetch('/api/rent-category')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setCategories([]);
        setIsLoading(false);
      });
  }, []);

  // Number of skeleton cards to show
  const skeletonCount = 4;

  return (
    <section className="py-12">
      <h2 className="mb-8 text-3xl font-bold text-center text-base-content dark:text-base-content">
        Explore Categories
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : categories.map((cat, index) => (
              <motion.div
                key={cat._id || cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/rent-posts?category=${encodeURIComponent(cat.name)}`}>
                  <article className="hover:animate-background group rounded-xl bg-gradient-to-r from-primary via-accent to-secondary p-0.5 shadow-xl transition-all hover:bg-[length:400%_400%] hover:shadow-2xl hover:[animation-duration:_4s]">
                    <div className="flex flex-col items-center justify-center h-full rounded-[10px] bg-base-100 p-4 sm:p-6 text-center">
                      {cat.imageUrl && (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 mx-auto mb-2 rounded-full transition-transform group-hover:scale-110"
                        />
                      )}
                      <h3 className="justify-center card-title text-base-content dark:text-base-content">
                        {cat.name}
                      </h3>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}