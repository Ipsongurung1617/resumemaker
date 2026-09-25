'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PaymentModal from '@/components/ui/PaymentModal';

const FAQ = [
  {
    q: 'Is ResuMind AI really free to try?',
    a: 'Yes! You can create up to 3 resumes with 2 templates and clean PDF export for free — no credit card required. Upgrade to Pro when you want AI bullet optimization and full career description structuring.',
  },
  {
    q: 'How does the AI optimize bullet points?',
    a: 'It analyzes your raw achievements and rewrites them using strong action verbs, quantifiable metrics, and ATS keywords tailored to your industry without robotic fluff.',
  },
  {
    q: 'How does the Step-by-Step Guided Builder work?',
    a: 'It guides you section by section through your Header, Experience, Education, Skills, and Summary with a real-time side-by-side preview that highlights the exact section you are editing.',
  },
  {
    q: 'What payment methods do you support?',
    a: 'We support all major Credit & Debit cards (via Stripe), PayPal, Apple Pay, Google Pay, and Direct Bank Transfers.',
  },
  {
    q: 'Are the resume templates compatible with Applicant Tracking Systems (ATS)?',
    a: 'Yes, 100%. All templates are designed with clean hierarchical headings, standard font families, and parseable structures that pass ATS screeners seamlessly.',
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const user = session?.user as { plan?: string } | undefined;
  const isPro = user?.plan === 'pro';
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleUpgradeClick() {
    if (isPro) {
      toast.success("You're already on the Pro plan! 🎉");
      return;
    }
    setPaymentModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Nav back */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-900 text-xs transition-colors">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-zinc-500 font-semibold text-xs uppercase tracking-widest mb-2">Transparent Plans</p>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-3">Simple, Transparent Pricing</h1>
          <p className="text-zinc-500 max-w-lg mx-auto text-xs leading-relaxed">
            Start for free. Upgrade to Pro when you need automated bullet rewriting, full description structuring, and job description tailoring.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free */}
          <div className="card">
            <h2 className="font-bold text-zinc-900 text-xl mb-1">Free</h2>
            <p className="text-zinc-500 text-xs mb-4">Perfect for getting started</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-black text-zinc-900">$0</span>
              <span className="text-zinc-500 mb-1 text-xs">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                '3 full resume versions',
                '2 ATS templates (Modern & Classic)',
                'Pixel-perfect PDF export',
                'Step-by-step guided editor',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-xs text-zinc-700">
                  <span className="text-emerald-600 font-bold text-sm">✓</span> {f}
                </li>
              ))}
              {['AI bullet rewriter', 'Instant full description generator', 'Job description tailoring', 'Minimal two-column template'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="text-zinc-300 font-bold text-sm">✗</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="btn-secondary w-full text-center block text-xs py-2.5">
              Continue with Free
            </Link>
          </div>

          {/* Pro */}
          <div className="card border-2 border-zinc-900 shadow-xl relative bg-white">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-3 py-0.5 rounded text-[11px] font-bold shadow">
              Recommended for Job Seekers
            </div>
            <h2 className="font-bold text-zinc-900 text-xl mb-1">Pro</h2>
            <p className="text-zinc-500 text-xs mb-4">Automate your entire application workflow</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-black text-zinc-900">$9</span>
              <span className="text-zinc-500 mb-1 text-xs">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited resume versions',
                'All 3 ATS templates (incl. Minimal)',
                '✨ AI bullet point rewriter',
                '⚡ Full career description AI structuring',
                '🎯 Target job description matcher',
                'Priority PDF rendering engine',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-xs text-zinc-800">
                  <span className="text-emerald-600 font-bold text-sm">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgradeClick}
              disabled={isPro}
              className="btn-primary w-full flex items-center justify-center gap-2 text-xs py-2.5"
            >
              {isPro ? '✓ You Are on Pro' : 'Choose Payment Method & Upgrade →'}
            </button>

            {/* Guarantee */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-400">
              <span>🛡️</span>
              <span>100% Risk-Free — Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Banner */}
        <div className="text-center mb-14 p-6 bg-white border border-zinc-200 rounded-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Supported Payment Methods (Select in Checkout)
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-zinc-700 font-semibold flex-wrap">
            <span>💳 Visa / Mastercard</span>
            <span>🅿️ PayPal</span>
            <span>📱 Apple Pay / Google Pay</span>
            <span>🏦 Wire Transfer</span>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-bold text-zinc-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, idx) => (
              <div key={idx} className="border border-zinc-200 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-50 transition-colors"
                >
                  <span className="font-semibold text-zinc-900 text-xs">{item.q}</span>
                  <span className="text-zinc-400 ml-3 text-sm">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Selection Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Upgrade to Pro Plan"
        subtitle="Choose your billing cycle and preferred payment method to activate Pro features."
      />
    </div>
  );
}
