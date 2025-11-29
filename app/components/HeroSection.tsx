import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-blue-600 to-purple-800 text-white p-6">
      <motion.h1 
        className="text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Sekilas
      </motion.h1>
      <motion.p 
        className="text-lg mb-6 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        A modern web experience with smooth animations and a sleek design.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button className="bg-white text-blue-600 hover:bg-gray-200 px-6 py-3 rounded-xl shadow-lg">
          Get Started
        </Button>
      </motion.div>
    </section>
  );
}
