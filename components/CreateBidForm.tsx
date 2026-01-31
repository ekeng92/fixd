'use client';

import { useState, FormEvent } from 'react';
import { createBid } from '@/actions/jobActions';

interface CreateBidFormProps {
  jobId: string;
  jobTitle: string;
  currentPrice: number;
}

export default function CreateBidForm({ jobId, jobTitle, currentPrice }: CreateBidFormProps) {
  const [formData, setFormData] = useState({
    fixerId: '', // In a real app, this would come from auth
    fixerName: '',
    amount: currentPrice,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await createBid({
        jobId,
        ...formData,
      });

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Bid submitted successfully! Your bid: $${formData.amount}`,
        });
        // Reset message field
        setFormData({ ...formData, message: '' });
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to submit bid',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Submit Your Bid</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Job: <span className="font-semibold">{jobTitle}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fixerName" className="block text-sm font-medium mb-2">
            Your Name
          </label>
          <input
            id="fixerName"
            type="text"
            required
            value={formData.fixerName}
            onChange={(e) => setFormData({ ...formData, fixerName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="fixerId" className="block text-sm font-medium mb-2">
            Fixer ID
          </label>
          <input
            id="fixerId"
            type="text"
            required
            value={formData.fixerId}
            onChange={(e) => setFormData({ ...formData, fixerId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            placeholder="fixer123"
          />
          <p className="text-xs text-gray-500 mt-1">
            In production, this would come from authentication
          </p>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Your Bid Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            required
            min="1"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
          />
          <p className="text-xs text-gray-500 mt-1">
            Current price: ${currentPrice}
          </p>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message / Proposal
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            placeholder="Explain why you're the best person for this job..."
          />
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting Bid...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
}
