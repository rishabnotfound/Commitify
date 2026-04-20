'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Dialog Container - for centering */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="w-full max-w-sm"
            >
              <div className="liquid-glass rounded-2xl p-5 relative">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center p-2.5 rounded-xl mb-3 ${
                  variant === 'danger' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    variant === 'danger' ? 'text-red-400' : 'text-yellow-400'
                  }`} />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>

                {/* Description */}
                <p className="text-white/50 text-sm mb-5 leading-relaxed">{description}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 rounded-xl glass text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                      variant === 'danger'
                        ? 'bg-red-500 text-white hover:bg-red-400'
                        : 'bg-yellow-500 text-black hover:bg-yellow-400'
                    }`}
                  >
                    {isLoading ? 'Wait...' : confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
