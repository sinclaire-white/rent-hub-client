
"use client";

import { useState, useEffect } from "react";

const cache = {};
const CACHE_TTL = 5 * 60 * 1000;

export function useCachedFetch(url) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (cache[url] && Date.now() - cache[url].timestamp < CACHE_TTL) {
        setData(cache[url].data);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        if (!Array.isArray(result)) throw new Error("Data is not an array");
        cache[url] = { data: result, timestamp: Date.now() };
        setData(result);
        setIsLoading(false);
      } catch (err) {
        console.error(`Fetch error for ${url}:`, err);
        setError(err.message);
        setData([]);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
}