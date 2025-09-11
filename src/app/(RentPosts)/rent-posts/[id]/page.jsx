"use client";
import React, { useState, useEffect, use } from "react"; // ✅ use removed unnecessary 'use'
import { FaStar, FaUser } from "react-icons/fa";
import AIInsights from "./AIInsights";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Skeleton component for the detail page
const SkeletonDetailPage = () => (
  <div className="min-h-screen w-full bg-base-100 text-base-content flex flex-col my-10 animate-pulse">
    <main className="w-full mx-auto px-2 sm:px-6 py-8 flex flex-col md:flex-row gap-10">
      <div className="md:w-7/12 w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full aspect-video rounded-2xl shadow-lg overflow-hidden flex items-center justify-center bg-base-300 h-96"></div>
      </div>
      <div className="md:w-5/12 w-full flex flex-col gap-5 justify-center">
        <div className="w-full h-10 rounded-md bg-base-300"></div>
        <div className="w-full h-24 rounded-md bg-base-300"></div>
        <div className="bg-base-200 rounded-xl p-4 mb-2">
          <div className="w-1/2 h-6 rounded-md bg-base-300 mb-2"></div>
          <div className="w-full h-4 rounded-md bg-base-300 my-1"></div>
          <div className="w-full h-4 rounded-md bg-base-300 my-1"></div>
          <div className="w-full h-4 rounded-md bg-base-300 my-1"></div>
        </div>
      </div>
    </main>
    <section className="w-full mx-auto px-2 sm:px-6 mt-8 flex flex-col items-center">
      <div className="mb-2 w-1/4 h-6 rounded-md bg-base-300 self-start"></div>
      <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-base-300"></div>
    </section>
  </div>
);

// Helper function to format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Fetch post details including ownerId if missing
async function getRentPost(id) {
  const res = await fetch(`/api/rent-posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const post = await res.json();
  if (post && post._id) post.id = post._id;

  // ✅ Fetch owner using email if ownerId missing
  if (!post.ownerId && post.email) {
    const ownerRes = await fetch(`/api/users?email=${encodeURIComponent(post.email)}`, { cache: "no-store" });
    if (ownerRes.ok) {
      const ownerData = await ownerRes.json();
      if (ownerData?._id) post.ownerId = ownerData._id;
      if (ownerData?.firstName) post.ownerName = `${ownerData.firstName} ${ownerData.lastName || ""}`;
    }
  }

  return post;
}

const DetailPage = ({ params: rawParams }) => {
  const params = rawParams;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getRentPost(params.id);
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [params.id]);

  const handleBookNow = (e) => {
    e.preventDefault();
    if (!post) return;
    if (!session) {
      const callbackUrl = `/checkout/${post.id}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else {
      router.push(`/checkout/${post.id}`);
    }
  };

  if (loading) return <SkeletonDetailPage />;
  if (!post) return notFound();

  const avgRating =
    Array.isArray(post.ratings) && post.ratings.length > 0
      ? post.ratings.reduce((a, b) => a + b, 0) / post.ratings.length
      : 0;
  const roundedRating = Math.round(avgRating * 10) / 10;

  return (
    <div className="min-h-screen w-full bg-base-100 text-base-content flex flex-col my-10">
      <main className="w-full mx-auto px-2 sm:px-6 py-8 flex flex-col md:flex-row gap-10">
        <div className="md:w-7/12 w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full aspect-video rounded-2xl shadow-lg overflow-hidden flex items-center justify-center bg-base-200">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={800}
                height={480}
                className="w-full h-full object-contain rounded-2xl"
                style={{ maxHeight: '480px', background: 'white' }}
              />
            )}
          </div>
        </div>
        <div className="md:w-5/12 w-full flex flex-col gap-5 justify-center">
          <div className="flex items-center gap-4 mb-1">
            <h1 className="text-3xl font-bold text-base-content leading-tight">{post.title}</h1>
            {avgRating > 0 && (
              <div className="flex items-center gap-1 bg-base-200 px-3 py-1 rounded-lg">
                <span>Rating: </span>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.round(avgRating) ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="text-base-content mb-2 text-base leading-relaxed">{post.description}</p>

          <div className="bg-base-200 rounded-xl p-4 mb-2">
            <div className="font-semibold text-base-content mb-2">Information</div>
            <div className="flex justify-between py-1 text-sm">
              <span>Price</span>
              <span className="font-bold text-base-content">
                ৳{typeof post.rentPrice === "number"
                  ? post.rentPrice.toLocaleString()
                  : Number(post.rentPrice)
                  ? Number(post.rentPrice).toLocaleString()
                  : "0"}
                {['Vehicles', 'Tools & Equipment', 'Events & Venues'].includes(post.category) ? '/day' : '/month'}
              </span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Availability</span>
              <span className="font-bold text-blue-700">
                {formatDate(post.availableFrom)} - {formatDate(post.availableTo)}
              </span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Location</span>
              <span className="font-bold text-base-content">{post.location}</span>
            </div>
          </div>

          <div className="bg-base-200 rounded-xl p-4 mb-2">
            <div className="font-semibold text-base-content mb-2">Contact</div>
            <div className="flex justify-between py-1 text-sm">
              <span>Owner</span>
              {post.ownerId ? (
                <Link
                  href={`/owner/${post.ownerId}`}
                  className="font-bold text-gray-900 hover:text-blue-600 hover:underline transition"
                >
                  {post.ownerName || post.owner}
                </Link>
              ) : (
                <span className="font-bold text-base-content">{post.ownerName}</span>
              )}
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Email</span>
              <span className="font-bold text-base-content">{post.email}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Contact</span>
              <span className="font-bold text-base-content">{post.contactNumber}</span>
            </div>
          </div>

          {Array.isArray(post.reviews) && post.reviews.length > 0 && (
            <div className="bg-base-200 rounded-xl p-4 mb-2">
              <div className="font-semibold text-base-content mb-2 text-lg">Reviews</div>
              <div className="space-y-4">
                {post.reviews.map((review, idx) => (
                  <div key={idx} className="flex flex-col gap-2 bg-base-100 rounded-lg p-4 shadow">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-blue-500" />
                      <span className="font-bold text-base-content text-md">{review.name}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-lg" />
                        ))}
                      </div>
                    </div>
                    <div className="text-base-content text-sm italic mt-1 pl-7">{review.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <AIInsights post={post} />

      <section className="w-full mx-auto px-2 sm:px-6 mt-8 flex flex-col items-center">
        <div className="mb-2 text-lg font-semibold text-base-content self-start">Location Map</div>
        <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-base-200">
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            className="w-full h-full border-0 rounded-2xl"
            style={{ minHeight: "256px" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${post.latitude},${post.longitude}&z=15&output=embed`}
          ></iframe>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            className="bg-blue-600 text-white px-5 font-semibold py-3 rounded-xl text-lg hover:bg-blue-700 transition"
            onClick={handleBookNow}
          >
            Book Now
          </button>
          <button className="bg-base-200 px-5 text-base-content font-semibold py-3 rounded-xl text-lg hover:bg-base-300 transition">
            Contact Host
          </button>
        </div>
      </section>
    </div>
  );
};

export default DetailPage;
