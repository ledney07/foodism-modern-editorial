import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

type CancelSubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const CANCEL_REASONS = [
  'Too expensive',
  'Not enough value',
  'Found a better alternative',
  'Temporary financial situation',
  'Not using the features',
  'Technical issues',
  'Content not relevant',
  'Other'
];

const CancelSubscriptionModal = ({ isOpen, onClose, onConfirm }: CancelSubscriptionModalProps): React.ReactElement => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedReason) {
      return;
    }

    const reason = selectedReason === 'Other' ? otherReason : selectedReason;
    
    if (selectedReason === 'Other' && !otherReason.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onConfirm(reason);
    setIsSubmitting(false);
    
    // Reset form
    setSelectedReason('');
    setOtherReason('');
  };

  const handleClose = () => {
    setSelectedReason('');
    setOtherReason('');
    onClose();
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-6" onClick={handleClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 md:p-12 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-[#f9b233] transition-colors group"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-neutral-600 group-hover:text-black transition-colors" />
        </button>

        <div className="mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-black mb-3">
            Cancel Subscription?
          </h2>
          <p className="text-neutral-600 text-base leading-relaxed">
            We're sorry to see you go. Please let us know why you're canceling your subscription so we can improve.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <label className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-4">
            Reason for Cancellation *
          </label>
          
          <div className="space-y-3">
            {CANCEL_REASONS.map((reason) => (
              <label
                key={reason}
                className="flex items-start space-x-3 p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-[#f9b233] transition-colors group"
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mt-1 w-5 h-5 text-[#f9b233] border-neutral-300 focus:ring-[#f9b233] cursor-pointer"
                />
                <span className="flex-1 text-base font-medium text-neutral-700 group-hover:text-neutral-900">
                  {reason}
                </span>
              </label>
            ))}
          </div>

          {selectedReason === 'Other' && (
            <div className="mt-4">
              <label htmlFor="otherReason" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-2">
                Please specify
              </label>
              <textarea
                id="otherReason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Tell us more about why you're canceling..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg text-base font-medium resize-none"
                required
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border-2 border-neutral-300 rounded-lg text-sm font-black uppercase tracking-widest hover:border-neutral-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Keep Subscription
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason || (selectedReason === 'Other' && !otherReason.trim()) || isSubmitting}
            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Cancel Subscription'}
          </button>
        </div>

        <p className="text-xs text-neutral-400 text-center mt-6">
          Your subscription will remain active until the end of your current billing period.
        </p>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;

