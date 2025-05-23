"use client"
import { useState, useEffect, useRef } from "react"
import { FileText, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function TermsOfServiceModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      // Restore scrolling when modal is closed
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Close when clicking outside the modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
        role="dialog"
        aria-modal="true"
        onClick={handleOutsideClick}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden p-0"
        >
          <div className="flex items-center justify-center py-4 px-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Terms of Service</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: May 22, 2025</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 rounded-full p-1"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="h-[60vh] overflow-y-auto p-6">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Terms</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  By accessing EarnBug, you agree to these Terms of Service. Please read them carefully.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Account & Eligibility</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You must be 13+ to use our services. You're responsible for your account security and all activity under your account.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Content</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You retain rights to your content. By uploading, you grant us license to use and distribute it. You must have necessary rights to share any content.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Prohibited Actions</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Don't misuse our services for illegal activities, harassment, spam, or content that violates others' rights.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">5. AI Content</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  AI-generated content may not be perfect. You're responsible for reviewing and verifying it before use.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">6. Legal</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Service provided "as is" without warranties. We may terminate accounts at our discretion. We can update these terms with 30 days notice.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">7. Contact</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Questions? Contact earnbug78@gmail.com
                </p>
              </section>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex justify-end">
            <Button onClick={onClose} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              I Understand
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
