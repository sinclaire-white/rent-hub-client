'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Tab = ({ text, href, selected, setSelected }) => {
  return (
    <Link href={href}>
      <button
        onClick={() => setSelected(text)}
        className={`${
          selected
            ? 'text-white'
            : 'text-gray-500 hover:text-primary dark:hover:text-primary'
        } relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-in-out`}
        aria-label={`Navigate to ${text}`}
      >
        <span className="relative z-10">{text}</span>
        {selected && (
          <motion.span
            layoutId="tab"
            transition={{ type: 'spring', stiffness: 600, damping: 25, duration: 0.25 }}
            className="absolute inset-0 z-0 rounded-full bg-primary"
          ></motion.span>
        )}
      </button>
    </Link>
  );
};

export default Tab;