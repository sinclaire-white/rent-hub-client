
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OwnerButton from "./ui/OwnerButton";
import { motion } from "framer-motion"; // For animations

export default function BecomeOwnerSection() {
  const { data: session } = useSession();
  const router = useRouter();

  const handlePrimaryClick = () => {
    if (!session) router.push("/login");
    else router.push("/become-owner");
  };

  const handleSecondaryClick = () => {
    router.push("/contact");
  };

  return (
    <section className="relative py-16 px-4 bg-base-100 dark:bg-base-200 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-[url('/path-to-subtle-pattern.png')] opacity-10"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Heading with Animation */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 text-base-content tracking-tight"
        >
          Start Earning <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Today!</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 max-w-3xl mx-auto text-lg text-base-content/80 leading-relaxed"
        >
          Join thousands of owners renting out their assets—from cars to camera gear. Pay a small fee to list your items and start earning passive income!
        </motion.p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <OwnerButton
              onClick={handlePrimaryClick}
              className="bg-primary text-primary-content font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-primary-focus transition-all duration-300 transform hover:-translate-y-1"
            >
              Become an Owner
            </OwnerButton>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <OwnerButton
              onClick={handleSecondaryClick}
              className="bg-secondary text-secondary-content font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg hover:bg-secondary-focus transition-all duration-300 transform hover:-translate-y-1"
            >
              Learn More
            </OwnerButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}