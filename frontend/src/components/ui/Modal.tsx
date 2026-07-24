import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`relative z-10 w-full ${maxWidth} bg-white rounded-card shadow-modal max-h-[90vh] overflow-y-auto`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="sticky top-0 bg-white border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between rounded-t-card z-10">
              <h2 id="modal-title" className="text-lg font-display font-semibold text-[#0A0A0A]">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-btn hover:bg-[#FAFAFA] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-150 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
