'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export type PaymentMethodType = 'card' | 'paypal' | 'apple_google_pay' | 'bank_transfer';
export type BillingCycle = 'monthly' | 'yearly';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
}

const PAYMENT_METHODS: { id: PaymentMethodType; label: string; icon: string; description: string }[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, Amex via Stripe Checkout',
  },
  {
    id: 'paypal',
    label: 'PayPal Express',
    icon: '🅿️',
    description: 'Safe and instant 1-click checkout',
  },
  {
    id: 'apple_google_pay',
    label: 'Apple Pay / Google Pay',
    icon: '📱',
    description: 'Biometric payment on supported devices',
  },
  {
    id: 'bank_transfer',
    label: 'Direct Bank Transfer / Wire',
    icon: '🏦',
    description: 'ACH, SEPA, or direct electronic bank wire',
  },
];

export default function PaymentModal({
  open,
  onClose,
  onSuccess,
  title = 'Select Payment Method & Plan',
  subtitle = 'Choose your preferred billing cycle and payment method to unlock full access.',
  confirmLabel,
}: PaymentModalProps) {
  const { data: session, update } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<BillingCycle>('monthly');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const price = selectedPlan === 'monthly' ? '$9 / mo' : '$65 / year ($5.40/mo)';

  async function handleConfirm() {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/user/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'pro',
          paymentMethod: selectedMethod,
          billingCycle: selectedPlan,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        toast.success(`Pro activated via ${PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}!`);
        if (update) {
          await update({ plan: 'pro' });
        }
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(json.message || 'Payment method setup failed. Please try again.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4 pt-1">
        <p className="text-xs text-zinc-500 leading-relaxed">{subtitle}</p>

        {/* 1. Plan Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            1. Select Billing Cycle
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedPlan('monthly')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-zinc-900 text-xs">Monthly</span>
                {selectedPlan === 'monthly' && <span className="text-zinc-900 text-xs font-bold">✓</span>}
              </div>
              <div className="text-base font-black text-zinc-900">$9 <span className="text-[11px] font-normal text-zinc-500">/ mo</span></div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Billed monthly, cancel anytime</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan('yearly')}
              className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                selectedPlan === 'yearly'
                  ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
              }`}
            >
              <span className="absolute -top-2 right-2 bg-zinc-900 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                Save 40%
              </span>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-zinc-900 text-xs">Annual</span>
                {selectedPlan === 'yearly' && <span className="text-zinc-900 text-xs font-bold">✓</span>}
              </div>
              <div className="text-base font-black text-zinc-900">$65 <span className="text-[11px] font-normal text-zinc-500">/ yr</span></div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Equivalent to $5.40/mo</div>
            </button>
          </div>
        </div>

        {/* 2. Payment Method Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            2. Choose Payment Option
          </label>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-zinc-900 bg-zinc-50/80 shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div className="text-xl">{method.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">{method.label}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300'
                      }`}>
                        {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500">{method.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informational note */}
        <div className="p-3 bg-zinc-100 rounded-lg text-[11px] text-zinc-600 flex items-start gap-2">
          <span>ℹ️</span>
          <span>
            Payment method preference selection mode. Selecting an option registers your choice and unlocks high-resolution download privileges immediately.
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex-1 py-2 text-xs"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size={14} color="white" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmLabel || `Confirm & Activate (${price})`}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
