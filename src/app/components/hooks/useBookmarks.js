"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const cache = {};
const CACHE_TTL = 5 * 60 * 1000;

export function useBookmarks() {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!session) {
      setBookmarks([]);
      return;
    }

    const fetchBookmarks = async () => {
      const cacheKey = `bookmarks_${session.user.id}`;
      if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
        setBookmarks(cache[cacheKey].data);
        return;
      }

      try {
        const res = await fetch("/api/bookmarks");
        if (!res.ok) throw new Error("Failed to fetch bookmarks");
        const result = await res.json();
        cache[cacheKey] = { data: result, timestamp: Date.now() };
        setBookmarks(result);
      } catch (err) {
        console.error("Bookmark fetch error:", err);
        setBookmarks([]);
      }
    };

    fetchBookmarks();
  }, [session]);

  return { bookmarks };
}