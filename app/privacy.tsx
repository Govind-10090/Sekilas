import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <motion.main
      className="max-w-2xl mx-auto py-12 px-4"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-2">Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use Sekilas News.</p>
      <ul className="list-disc pl-6 mb-2">
        <li>We do not collect personal information unless you provide it voluntarily.</li>
        <li>We use cookies to enhance your browsing experience.</li>
        <li>We do not sell or share your data with third parties.</li>
        <li>We may update this policy from time to time. Please review it periodically.</li>
      </ul>
      <p>If you have any questions about our privacy practices, please contact us.</p>
    </motion.main>
  );
} 