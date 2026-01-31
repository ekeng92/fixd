'use client';

import { useState, FormEvent } from 'react';
import { createJob } from '@/actions/jobActions';
import { JobInput } from '@/types';

export default function CreateJobForm() {
  const [formData, setFormData] = useState<JobInput>({
    title: '',
    description: '',
    startingPrice: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await createJob(formData);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Job created successfully! ID: ${result.jobId}`,
        });
        // Reset form
        setFormData({
          title: '',
          description: '',
          startingPrice: 0,
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to create job',
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
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Job Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
            placeholder="e.g., Fix leaky faucet"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
            placeholder="Describe the job in detail..."
          />
        </div>

        <div>
          <label htmlFor="startingPrice" className="block text-sm font-medium mb-2">
            Starting Price ($)
          </label>
          <input
            id="startingPrice"
            type="number"
            required
            min="1"
            step="0.01"
            value={formData.startingPrice || ''}
            onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
            placeholder="0.00"
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
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating Job...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
}
