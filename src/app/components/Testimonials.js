
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

// Skeleton component for loading state
const SkeletonTestimonial = () => (
  <div className="carousel-item">
    <div className="w-80 h-[150px] animate-pulse rounded-2xl bg-base-300"></div>
  </div>
);

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch top reviews from the backend
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews'); // Assuming this now fetches top reviews
        if (!res.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);


    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-base-300" />); // Use a muted color for empty stars
    }
    return stars;
  };

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content">
        What People Are Saying
      </h2>
      <div className="carousel carousel-center max-w-full p-4 space-x-4">
        {isLoading ? (
          // Show 3 skeleton cards while loading
          Array.from({ length: 3 }).map((_, index) => <SkeletonTestimonial key={index} />)
        ) : testimonials.length > 0 ? (
          testimonials.map((t, index) => (
            <motion.div
              key={t._id}
              className="carousel-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="card w-72 md:w-80 shadow-xl rounded-2xl bg-base-100">
                <div className="card-body p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="card-title text-base-content text-lg md:text-xl">{t.userName || "Anonymous"}</h3>
                    <div className="flex text-lg">{renderStars(t.rating)}</div>
                  </div>
                  <p className="text-base-content/80 text-sm italic">{`"${t.comment}"`}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="w-full text-center text-base-content/70 p-4">
            No reviews have been submitted yet.
          </div>
        )}
      </div>
    </section>
  );
}