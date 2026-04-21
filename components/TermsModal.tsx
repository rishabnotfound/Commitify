'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import Link from 'next/link';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  isLoading?: boolean;
}

export function TermsModal({ isOpen, onClose, onAccept, isLoading }: TermsModalProps) {
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
            className="fixed inset-0 bg-black/80 z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md liquid-glass rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Terms of Service</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">

                {/* Terms summary */}
                <div className="text-sm text-white/60 space-y-2">
                  <p>By clicking &quot;I Agree&quot;, you acknowledge that:</p>
                  <ul className="list-disc list-inside space-y-1 text-white/50">
                    <li>You use this service at your own risk</li>
                    <li>You are responsible for any consequences</li>
                    <li>We are not liable for account actions by GitHub</li>
                  </ul>
                </div>

                {/* Link to full terms */}
                <Link
                  href="/terms"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-sm text-neon-green-400 hover:text-neon-green-300 transition-colors"
                >
                  <span>Read full Terms of Service</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onAccept}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-neon-green-500 text-black font-medium text-sm hover:bg-neon-green-400 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'I Agree'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
