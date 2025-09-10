// app/become-owner/page.jsx
"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { HiUser, HiMail, HiPhone, HiHome, HiLocationMarker, HiMailOpen } from "react-icons/hi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SplitText from "../components/ui/SplitText";

export default function BecomeOwnerPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
  });
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from the API to pre-fill the form
    if (status === "authenticated") {
      const fetchUserData = async () => {
        try {
          const res = await fetch("/api/users");
          const data = await res.json();
          if (res.ok) {
            setForm({
              ...form,
              email: data.email || "",
              name: data.name || "",
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
              postcode: data.postcode || ""
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setIsPageLoading(false);
        }
      };
      fetchUserData();
    } else if (status === "unauthenticated") {
      setIsPageLoading(false);
    }
  }, [status]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const { email, name, phone } = form;
    if (!email || !name || !phone) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      // Check user role first
      const roleRes = await fetch("/api/users/check-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const roleData = await roleRes.json();

      if (roleData.role === "owner") {
        Swal.fire({
          icon: "info",
          title: "Already an Owner",
          text: "You are already an owner! Redirecting to your dashboard.",
        }).then(() => window.location.href = "/dashboard");
        return;
      }

      // Initiate payment
      const res = await fetch("/api/payment/init-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Payment initiation failed:", data);
        Swal.fire("Error", "Something went wrong with payment. Try again!", "error");
      }

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  if (isPageLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 px-4 py-6 text-base-content sm:px-6">
      <div className="bg-base-200 shadow-2xl rounded-3xl p-6 md:p-10 w-full max-w-xl text-center transform transition-all duration-500 ">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
          <SplitText
            text="Become an owner"
            className="font-extrabold"
            splitType="words"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            delay={100}
            duration={0.8}
          />
        </h1>
        <p className="mb-6 text-base-content/80 text-lg">
          Please fill out the form below to apply to be a verified owner and start renting out your items.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="relative col-span-1 md:col-span-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50 pointer-events-none">
              <HiUser size={20} />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border pl-10 md:pl-12 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary transition bg-base-100 text-base-content"
              required
            />
          </div>
          <div className="relative col-span-1 md:col-span-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50 pointer-events-none">
              <HiMail size={20} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border pl-10 md:pl-12 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary transition bg-base-100 text-base-content"
              required
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50 pointer-events-none">
              <HiPhone size={20} />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border pl-10 md:pl-12 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary transition bg-base-100 text-base-content"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50 pointer-events-none">
              <HiHome size={20} />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="border pl-10 md:pl-12 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary transition bg-base-100 text-base-content"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50 pointer-events-none">
              <HiLocationMarker size={20} />
            </div>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border pl-10 md:pl-12 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary transition bg-base-100 text-base-content"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50 pointer-events-none">
              <HiMailOpen size={20} />
            </div>
            <input
              type="text"
              name="postcode"
              placeholder="Postcode"
              value={form.postcode}
              onChange={handleChange}
              className="border pl-10 md:pl-12 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary transition bg-base-100 text-base-content"
            />
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-4 btn btn-primary w-full rounded-2xl shadow-lg font-semibold cursor-pointer transition-all border-b-[4px] border-primary-focus hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Redirecting...
            </span>
          ) : (
            "Pay 500৳ to Become an Owner"
          )}
        </button>
        <Link href={"/"} passHref>
          <button
            class="group/button relative mt-3 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-base-200/30 px-6 py-2 text-base font-semibold text-base-content transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-base-content/50 border border-base-content/20"
          >
            <span class="">Go Back</span>
            <div
              class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
            >
              <div class="relative h-full w-10 bg-base-content/20"></div>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}