import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <motion.main
      className="max-w-2xl mx-auto py-12 px-4"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="mb-2">Welcome to Sekilas News, your trusted source for the latest news and trending topics. Our mission is to provide accurate, timely, and relevant news to keep you informed about what matters most.</p>
      <p>We aggregate news from reputable sources and present it in a clean, easy-to-read format. Thank you for choosing Sekilas News as your news companion.</p>
    </motion.main>
  );
} 