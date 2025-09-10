"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Swal from "sweetalert2";
import Image from "next/image";
import { motion } from "framer-motion";

// Skeleton component for a single post card
const SkeletonPostCard = () => (
  <div className="shadow-xl card bg-base-100 dark:bg-base-200 animate-pulse">
    <div className="w-full h-36 rounded-t-xl bg-base-300"></div>
    <div className="flex flex-row gap-1 px-3 pt-2">
      <div className="w-1/4 h-5 rounded-lg bg-base-300"></div>
      <div className="w-1/4 h-5 rounded-lg bg-base-300"></div>
    </div>
    <div className="flex flex-col gap-1 p-3">
      <div className="w-1/2 h-4 bg-base-300 rounded-md"></div>
      <div className="flex items-center gap-2 mb-0">
        <div className="w-3/4 h-6 bg-base-300 rounded-md"></div>
        <div className="w-1/4 h-5 bg-base-300 rounded-lg"></div>
      </div>
      <div className="w-full h-4 bg-base-300 rounded-md"></div>
      <div className="w-full h-4 bg-base-300 rounded-md"></div>
    </div>
  </div>
);

const BookmarkIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-7 h-7 drop-shadow-sm text-primary"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 3.75A2.25 2.25 0 0120 6v14.25a.75.75 0 01-1.22.59l-6.28-5.02a.75.75 0 00-.92 0l-6.28 5.02A.75.75 0 014 20.25V6a2.25 2.25 0 012.25-2.25h11z"
    />
  </svg>
);

const RentPostsList = ({ posts, isLoggedIn }) => {
  const [bookmarked, setBookmarked] = useState({});
  const [bookmarkLoading, setBookmarkLoading] = useState(null);

  useEffect(() => {
    async function fetchBookmarks() {
      if (!isLoggedIn) return;
      try {
        const res = await fetch("/api/users", { method: "GET" });
        if (res.ok) {
          const user = await res.json();
          if (user && Array.isArray(user.bookmarks)) {
            const map = {};
            user.bookmarks.forEach((id) => { map[id] = true; });
            setBookmarked(map);
          }
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    }
    fetchBookmarks();
  }, [isLoggedIn]);

  const handleBookmarkToggle = async (postId) => {
    const action = bookmarked[postId] ? "remove" : "add";
    setBookmarkLoading(postId);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action }),
      });
      setBookmarkLoading(null);
      if (res.ok) {
        setBookmarked((prev) => ({ ...prev, [postId]: !prev[postId] }));
        Swal.fire({
          icon: "success",
          title: action === "add" ? "Bookmarked!" : "Bookmark removed!",
          text: action === "add" ? "Added to bookmarks." : "Removed from bookmarks.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({ icon: "error", title: "Failed!", text: "Could not update bookmark." });
      }
    } catch (err) {
      setBookmarkLoading(null);
      Swal.fire({ icon: "error", title: "Error!", text: "Could not update bookmark." });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post) => {
        const avgRating = Array.isArray(post.ratings) && post.ratings.length > 0
          ? post.ratings.reduce((a, b) => a + b, 0) / post.ratings.length
          : 0;
        
        const isAvailable = new Date(post.availableFrom) <= new Date() && new Date(post.availableTo) >= new Date();

        return (
          <motion.div
            key={post._id}
            className="group relative flex flex-col bg-base-100 text-base-content rounded-xl shadow-lg hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden"
            variants={itemVariants}
          >
            {isLoggedIn && (
              <div className="absolute top-4 right-4 z-30">
                <button
                  type="button"
                  aria-label="Toggle bookmark"
                  className="bg-base-100/70 rounded-full p-1 shadow-lg group-hover:bg-primary/10 transition relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkToggle(post._id);
                  }}
                  disabled={bookmarkLoading === post._id}
                >
                  <BookmarkIcon filled={!!bookmarked[post._id]} />
                  {bookmarkLoading === post._id && (
                    <span className="absolute inset-0 flex items-center justify-center bg-base-100/70 rounded-full">
                      <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            )}
            <div className="flex flex-col flex-grow">
              <Link href={`/rent-posts/${post._id}`} className="no-underline text-inherit">
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={225}
                    className="w-full h-36 object-cover rounded-t-xl"
                    unoptimized
                  />
                )}
                <div className="flex flex-col gap-2 p-4 flex-grow">
                  <div className="flex flex-row gap-2 flex-wrap">
                    <span className="badge badge-sm badge-outline badge-primary">
                      {post.category}
                    </span>
                  </div>
                  <div className="text-sm text-base-content font-medium truncate opacity-70">
                    {post.location}
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-0">
                    <h2 className="text-lg font-bold text-base-content leading-tight truncate">
                      {post.title}
                    </h2>
                    {avgRating > 0 && (
                      <div className="flex items-center gap-1 bg-base-200 px-1.5 py-0.5 rounded-lg">
                        <span className="font-semibold text-base-content text-xs">Rating: {avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {/* <p className="text-xs text-base-content mb-1 leading-snug line-clamp-2 opacity-80">
                    {post.description}
                  </p> */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`badge badge-outline ${
                        isAvailable ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {isAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-base-content mt-2">
                    ৳
                    {typeof post.rentPrice === "number"
                      ? post.rentPrice.toLocaleString()
                      : Number(post.rentPrice)
                      ? Number(post.rentPrice).toLocaleString()
                      : "0"}
                    <span className="text-xs font-medium text-base-content">
                      {['Vehicles', 'Tools & Equipment', 'Events & Venues'].includes(post.category) ? '/day' : '/month'}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex justify-end p-4 pt-0">
              <Link href={`/rent-posts/${post._id}`} className="w-full">
                <button
                  className="px-6 py-2 rounded-md border border-primary relative before:absolute overflow-hidden before:translate-x-[-200px] hover:before:translate-x-0 before:z-[-1] before:transition before:duration-300 hover:text-white before:w-full before:h-full before:bg-primary before:top-0 before:left-0"
                >
                  View Detail
                </button>
              </Link>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const RentPostsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category') || 'All';
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // Fetch posts based on category
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const categoryQuery = categoryParam !== 'All' ? `?category=${encodeURIComponent(categoryParam)}` : '';
      const res = await fetch(`/api/rent-posts${categoryQuery}`);
      if (!res.ok) {
        setPosts([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, [categoryParam]);

  // Fetch all categories for the filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/rent-category");
        if (res.ok) {
          const data = await res.json();
          const catNames = ["All", ...data.map((cat) => cat.name)];
          setCategories(catNames.filter(Boolean));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories(["All"]);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const newSearchParams = new URLSearchParams();
    if (newCategory !== 'All') {
      newSearchParams.set('category', newCategory);
    }
    router.push(`/rent-posts?${newSearchParams.toString()}`);
  };

  return (
    <div className="min-h-screen w-11/12 mx-auto bg-base-100 text-base-content flex flex-col py-12">
      <h1 className="text-center mb-8 text-4xl font-bold text-base-content tracking-wide font-sans">
        {categoryParam === 'All' ? 'All Rent Posts' : `${decodeURIComponent(categoryParam)} Rentals`}
      </h1>
      <div className="w-full flex justify-start mb-8 ml-8">
        <div className="w-full max-w-xs">
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-base-content">
            Filter by Category
          </label>
          <select
            id="category"
            value={categoryParam}
            onChange={handleCategoryChange}
            className="select select-bordered w-full text-base"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Suspense fallback={
        <div className="w-full flex justify-center items-center py-20">
          <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></span>
        </div>
      }>
        {loading ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-3">
            {Array.from({ length: 8 }).map((_, index) => <SkeletonPostCard key={index} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="w-full flex justify-center items-center py-20">
            <span className="text-lg text-base-content font-semibold">No post to show for this category.</span>
          </div>
        ) : (
          <RentPostsList posts={posts} isLoggedIn={isLoggedIn} />
        )}
      </Suspense>
    </div>
  );
};

export default RentPostsPage;
