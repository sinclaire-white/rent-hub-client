"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ListingCard({ id, title, price, category, image }) {
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
        <div className="justify-end mt-4 card-actions">
          <Link href={`/rent-posts/${id}`} className="btn btn-primary btn-sm">View Details</Link>
        </div>
      </div>
    </motion.div>
  );
}