'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerProps {
  children: React.ReactNode;
  className?: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
          zIndex: -1,
        }}
        animate={{
          x: ['100%', '-100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default Shimmer;
