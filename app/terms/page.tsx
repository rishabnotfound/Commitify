'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-white/40 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          {/* Risk Warning */}
          <div className="liquid-glass rounded-xl p-4 border border-yellow-500/20 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-yellow-400 font-medium mb-1">Important Risk Disclosure</h3>
                <p className="text-white/60 text-sm">
                  Using this service to generate backdated commits may violate GitHub&apos;s Terms of Service.
                  Your GitHub account could be suspended or terminated. You accept full responsibility for any consequences.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-white/70 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Commitify (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
                If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
              <p>
                Commitify allows users to generate Git commits with custom dates on their GitHub repositories.
                This is provided for educational and experimental purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Risks & Warnings</h2>
              <p className="mb-3">By using this Service, you acknowledge and accept the following risks:</p>
              <ul className="list-disc list-inside space-y-2 text-white/60">
                <li>Generating fake or misleading commit history may violate GitHub&apos;s Terms of Service</li>
                <li>Your GitHub account may be flagged, suspended, or permanently banned</li>
                <li>Misrepresenting your contribution history could harm your professional reputation</li>
                <li>Employers and collaborators may view fabricated commits as deceptive</li>
                <li>Actions taken through this Service are irreversible once pushed to GitHub</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Disclaimer of Liability</h2>
              <p className="mb-3">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/60">
                <li>We are not responsible for any consequences arising from your use of the Service</li>
                <li>We are not liable for any GitHub account suspensions, bans, or restrictions</li>
                <li>We are not liable for any damage to your reputation or career prospects</li>
                <li>We are not liable for any direct, indirect, incidental, or consequential damages</li>
                <li>You use this Service entirely at your own risk</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. User Responsibilities</h2>
              <p className="mb-3">You agree that:</p>
              <ul className="list-disc list-inside space-y-2 text-white/60">
                <li>You are solely responsible for your use of the Service</li>
                <li>You will not use the Service for fraudulent purposes</li>
                <li>You will not misrepresent commits as genuine work for employment or academic purposes</li>
                <li>You understand and accept all risks associated with modifying Git history</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Commitify and its creators from any claims,
                damages, losses, or expenses (including legal fees) arising from your use of the Service or
                violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Data & Privacy</h2>
              <p>
                We store your GitHub username, email, and encrypted access token to provide the Service.
                We do not sell or share your data. You can delete your data by disconnecting your GitHub account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Modifications</h2>
              <p>
                We reserve the right to modify these Terms at any time. Continued use of the Service after
                changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Governing Law</h2>
              <p>
                These Terms shall be governed by applicable laws. Any disputes shall be resolved through
                appropriate legal channels in the jurisdiction where the Service operator resides.
              </p>
            </section>

            <section className="pt-4 border-t border-white/10">
              <p className="text-white/40">
                By using Commitify, you confirm that you have read, understood, and agree to these Terms of Service.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
