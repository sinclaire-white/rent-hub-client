"use client";

import Link from "next/link";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function ListingCard({ id, title, price, category, image, isBookmarked, bookmarkId, onBookmarkToggle }) {
  const { data: session } = useSession();

  const handleBookmark = async () => {
    if (!session) {
      Swal.fire({
        icon: "error",
        title: "Please Log In",
        text: "You need to be logged in to bookmark listings.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      if (isBookmarked) {
        const res = await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookmarkId }),
        });
        if (res.ok) {
          onBookmarkToggle(id, false, null);
          Swal.fire({
            icon: "success",
            title: "Bookmark Removed",
            text: `${title} has been removed from your favorites.`,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: id }),
        });
        if (res.ok) {
          const { bookmarkId } = await res.json();
          onBookmarkToggle(id, true, bookmarkId);
          Swal.fire({
            icon: "success",
            title: "Bookmarked!",
            text: `${title} has been added to your favorites.`,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update bookmark.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
      className="transition-shadow shadow-xl card bg-base-100 dark:bg-base-200 hover:shadow-2xl"
    >
      <figure>
        <img src={image || "/placeholder.jpg"} alt={title} className="object-cover w-full h-48" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-base-content dark:text-base-content">{title}</h2>
        <p className="text-sm text-base-content/70 dark:text-base-content/70">{category}</p>
        <p className="font-bold text-base-content dark:text-base-content">
          ৳{typeof price === "number" ? price.toLocaleString() : Number(price)?.toLocaleString() || "0"}/day
        </p>
        <div className="justify-between mt-4 card-actions">
          <Link href={`/rent-posts/${id}`} className="btn btn-primary btn-sm">View Details</Link>
          <button onClick={handleBookmark} className="btn btn-ghost btn-sm">
            <svg
              className={`w-5 h-5 ${isBookmarked ? "text-yellow-500 fill-yellow-500" : "text-base-content dark:text-base-content"}`}
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}