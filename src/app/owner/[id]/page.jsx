"use client";

import { use, useEffect, useState } from "react";
import OwnerDetails from "@/app/components/OwnerDetails";
import OwnerPosts from "@/app/components/OwnerPosts";
import ReviewsSection from "@/app/components/ReviewsSection";

export default function OwnerProfile({ params: rawParams }) {
  // ✅ Unwrap params using React.use()
  const params = use(rawParams);
  const ownerId = params?.id;

  const [owner, setOwner] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch owner by ID
  useEffect(() => {
    if (!ownerId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/owner/${ownerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setOwner(null);
          setError(data.error);
        } else {
          setOwner(data); // direct owner object
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setOwner(null);
        setError("Failed to fetch owner");
        setLoading(false);
      });
  }, [ownerId]);

  // Fetch owner's posts using owner email
  useEffect(() => {
    if (!owner?.email) return;

    fetch(`/api/rent-posts?ownerEmail=${encodeURIComponent(owner.email)}`)
      .then((res) => res.json())
      .then((data) => setPosts(data || []))
      .catch((err) => {
        console.error(err);
        setPosts([]);
      });
  }, [owner?.email]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !owner) return <p className="text-center mt-10">Owner not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <OwnerDetails owner={owner} />
      <OwnerPosts posts={posts} />
      <ReviewsSection ownerId={owner._id} />
    </div>
  );
}
