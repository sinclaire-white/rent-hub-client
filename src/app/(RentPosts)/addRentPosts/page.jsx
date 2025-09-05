"use client";
import React, { useState } from "react";

const initialForm = {
  type: "",
  title: "",
  description: "",
  location: "",
  ownerName: "",
  email: "",
  contactNumber: "",
  rentPrice: "",
  availableFrom: "",
  availableTo: "",
  imageUrl: "",
  latitude: "",
  longitude: "",
};

const AddRentPostsPage = () => {
  const [form, setForm] = useState(initialForm);
  const [mapPosition, setMapPosition] = useState({ lat: 23.685, lng: 90.3563 }); // Bangladesh center

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Get location from device GPS
  const handleGetLocationFromDevice = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapPosition({ lat, lng });
          setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
        },
        (error) => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Handle form submit (demo only)
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Rent post added! (Demo only)");
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col py-12">
      <h1 className="text-center text-4xl font-bold text-gray-900 mb-10 tracking-wide font-sans">
        Add Rent Post
      </h1>
      <form onSubmit={handleSubmit} className="w-full px-2 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <input
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Event Hall, Apartment"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Grand Event Hall"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe the property..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Comilla, Bangladesh"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name
              </label>
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rent Price (৳/month)
              </label>
              <input
                name="rentPrice"
                type="number"
                value={form.rentPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available From
              </label>
              <input
                name="availableFrom"
                type="date"
                value={form.availableFrom}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available To
              </label>
              <input
                name="availableTo"
                type="date"
                value={form.availableTo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste image URL here"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (GPS Only)
              </label>
              <div className="w-full h-64 md:h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-gray-300 relative flex items-center justify-center">
                <button
                  type="button"
                  className="bg-green-600 text-white px-6 py-3 rounded-xl shadow text-lg font-semibold hover:bg-green-700 transition z-30"
                  onClick={handleGetLocationFromDevice}
                >
                  Use My Location (GPS)
                </button>
                {/* Show map and pin only if GPS is set */}
                {form.latitude && form.longitude && (
                  <>
                    <iframe
                      id="google-map-iframe"
                      title="Google Map"
                      src={`https://maps.google.com/maps?q=${form.latitude},${form.longitude}&z=16&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{
                        border: 0,
                        borderRadius: "0.75rem",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div
                      className="absolute z-20"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -100%)",
                        pointerEvents: "none",
                      }}
                    >
                      {/* Pin-point SVG icon */}
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 2C10.477 2 6 6.477 6 12c0 7.732 8.06 16.01 8.41 16.34a1 1 0 0 0 1.18 0C17.94 28.01 26 19.732 26 12c0-5.523-4.477-10-10-10zm0 13.5A3.5 3.5 0 1 1 16 8a3.5 3.5 0 0 1 0 7.5z"
                          fill="#2563eb"
                        />
                        <circle cx="16" cy="12" r="3.5" fill="#fff" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {form.latitude && form.longitude
                  ? `Latitude: ${form.latitude.toFixed(
                      5
                    )}, Longitude: ${form.longitude.toFixed(5)}`
                  : "Please use GPS to select your location."}
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-blue-700 transition"
            >
              Add Rent Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRentPostsPage;
