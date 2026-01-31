'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import LiveBidBoard from '@/components/LiveBidBoard';
import { submitBid } from '@/actions/jobActions';
import { Job } from '@/types';

export default function FixerJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock fixer data
  const fixerId = 'fixer-123';
  const fixerName = 'Mike Johnson';

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!jobId) return;

        const jobRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
          setJob({
            id: jobSnap.id,
            ...jobSnap.data(),
          } as Job);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!bidAmount || !bidMessage) {
        toast.error('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }

      const amount = parseFloat(bidAmount);
      if (amount <= 0) {
        toast.error('Bid amount must be greater than 0');
        setIsSubmitting(false);
        return;
      }

      const result = await submitBid({
        jobId,
        fixerId,
        fixerName,
        amount,
        message: bidMessage,
      });

      if (result.success) {
        toast.success('Bid submitted!');
        setBidAmount('');
        setBidMessage('');
      } else {
        toast.error(result.error || 'Failed to submit bid');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">⚙️</div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Job not found</p>
          <button
            onClick={() => router.push('/fixer/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold">
                    {job.status}
                  </span>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <span>📍 {job.zipCode}</span>
                    <span>💰 Starting at ${job.startingPrice}</span>
                  </div>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Job Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {/* Photos */}
              {job.photos && job.photos.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Photos
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {job.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`Job photo ${i + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Address Notice */}
              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  🔒 <strong>Full address will be shown only after your bid is accepted</strong>
                </p>
              </div>
            </div>

            {/* Live Bid Board */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Competing Bids
              </h2>
              <LiveBidBoard jobId={jobId} showAcceptButton={false} />
            </div>
          </div>

          {/* Bid Submission Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Submit Your Bid
              </h3>

              <form onSubmit={handleSubmitBid} className="space-y-4">
                {/* Current Lowest Bid */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                    Starting Price
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    ${job.startingPrice}
                  </p>
                </div>

                {/* Bid Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    💡 You can bid higher with a great proposal!
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    placeholder="Why are you the best fit for this job? What's your experience? Timeline?"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Bid Info */}
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-xs text-green-800 dark:text-green-200">
                    ✅ Homeowner will see your proposal and all competing bids
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !bidAmount || !bidMessage}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting Bid...' : 'Submit Bid'}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Can't edit after submission
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
