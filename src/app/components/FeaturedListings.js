"use client";

import { useCachedFetch } from "./hooks/useCachedFetch";
import { useBookmarks } from "./hooks/useBookmarks";
import ListingCard from "./ListingCard";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FeaturedListings() {
  const { data: listings, isLoading, error } = useCachedFetch("/api/rent-posts?featured=true");
  const { bookmarks } = useBookmarks();
  const [bookmarkState, setBookmarkState] = useState({});

  const handleBookmarkToggle = (listingId, isBookmarked, bookmarkId) => {
    setBookmarkState(prev => ({
      ...prev,
      [listingId]: { isBookmarked, bookmarkId },
    }));
  };

  if (isLoading) {
    return (
      <section className="py-12 text-center">
        <h2 className="mb-8 text-3xl font-bold text-base-content dark:text-base-content">Featured Listings</h2>
        <div className="grid max-w-7xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
              <div className="mt-4 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 text-center">
        <h2 className="mb-8 text-3xl font-bold text-base-content dark:text-base-content">Featured Listings</h2>
        <div className="p-8 text-center text-error dark:text-error">
          <p>Failed to load listings. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="py-12 text-center">
        <h2 className="mb-8 text-3xl font-bold text-base-content dark:text-base-content">Featured Listings</h2>
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <p>No featured listings are available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="mb-8 text-3xl font-bold text-center text-base-content dark:text-base-content">Featured Listings</h2>
      <motion.div
        className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {listings.map(listing => {
          const bookmark = bookmarks.find(b => b.listingId === listing._id) || {};
          const isBookmarked = !!bookmark.id || bookmarkState[listing._id]?.isBookmarked || false;
          const bookmarkId = bookmark.id || bookmarkState[listing._id]?.bookmarkId;
          return (
            <ListingCard
              key={listing._id}
              id={listing._id}
              title={listing.title}
              price={listing.rentPrice}
              category={listing.category}
              image={listing.imageUrl}
              isBookmarked={isBookmarked}
              bookmarkId={bookmarkId}
              onBookmarkToggle={handleBookmarkToggle}
            />
          );
        })}
      </motion.div>
    </section>
  );
}