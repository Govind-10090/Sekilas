import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <motion.main
      className="max-w-2xl mx-auto py-12 px-4"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-2">By using Sekilas News, you agree to comply with and be bound by the following terms and conditions:</p>
      <ul className="list-disc pl-6 mb-2">
        <li>Content is for informational purposes only and may not be accurate or up to date.</li>
        <li>We are not responsible for the content of external sites linked from our platform.</li>
        <li>Do not misuse the website or attempt to disrupt its operation.</li>
        <li>We reserve the right to update these terms at any time without notice.</li>
      </ul>
      <p>If you do not agree with any part of these terms, please do not use our website.</p>
    </motion.main>
  );
} 