import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

/**
 * BottomSheet
 * 
 * A reusable touch-first bottom sheet using framer-motion.
 * Supports drag-to-close, safe scrolling, and subtle glassmorphic headers.
 */
export default function BottomSheet({ isOpen, onClose, title, children }) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(e, info) => {
              // Close if dragged down sufficiently
              if (info.offset.y > 100 || info.velocity.y > 400) {
                onClose();
              }
            }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] sm:max-w-xl sm:mx-auto sm:mb-4 border border-slate-200/50"
            style={{ 
              borderTopLeftRadius: '24px', 
              borderTopRightRadius: '24px',
              // On desktop/tablet, fully round it like a floating panel
              borderBottomLeftRadius: window.innerWidth >= 640 ? '24px' : '0px',
              borderBottomRightRadius: window.innerWidth >= 640 ? '24px' : '0px',
            }}
          >
            {/* Handle & Header */}
            <div className="shrink-0 pt-3 pb-2 px-4 flex flex-col items-center sticky top-0 bg-white/95 backdrop-blur-md rounded-t-[24px] z-10 border-b border-slate-100">
              {/* Drag Pill */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-3 cursor-grab active:cursor-grabbing" />
              
              <div className="w-full flex items-center justify-between mb-1">
                <div className="flex-1 min-w-0 pr-4">
                  {title && (
                    <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-800 truncate">
                      {title}
                    </h2>
                  )}
                </div>
                {onClose && (
                  <button 
                    onClick={onClose}
                    className="shrink-0 p-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-full transition-colors text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
