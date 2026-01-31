'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import LiveBidBoard from '@/components/LiveBidBoard';
import { acceptBid } from '@/actions/jobActions';
import { Job } from '@/types';

export default function BrokerJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);

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

  const handleAcceptBid = async (bidId: string) => {
    setIsAccepting(true);

    try {
      const result = await acceptBid(jobId, bidId);

      if (result.success) {
        toast.success('Bid accepted! Winner has been notified via SMS');
        // Refresh job
        const jobRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          setJob({
            id: jobSnap.id,
            ...jobSnap.data(),
          } as Job);
        }
      } else {
        toast.error(result.error || 'Failed to accept bid');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsAccepting(false);
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
            onClick={() => router.push('/broker/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isJobClosed = job.status === 'closed' || job.status === 'accepted';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => router.push('/broker/dashboard')}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          job.status === 'open'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : job.status === 'accepted'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                              : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {job.status.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                        <span>📍 {job.zipCode}</span>
                        <span>💰 Starting at ${job.startingPrice}</span>
                      </div>
                    </div>
                  </div>
                  {job.winnerId && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Winner</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ID: {job.winnerId.substring(0, 8)}...
                      </p>
                    </div>
                  )}
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

              {/* Full Address */}
              <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  📍 Full Address (Only you can see this)
                </h4>
                <p className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                  {job.privateAddress}
                </p>
                <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-2">
                  This will be shared with the winning fixer via SMS
                </p>
              </div>

              {/* Job Status Info */}
              {isJobClosed && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ✅ This job is {job.status}. No more bids can be accepted.
                  </p>
                </div>
              )}
            </div>

            {/* Live Bid Board */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Incoming Bids
              </h2>
              <LiveBidBoard
                jobId={jobId}
                showAcceptButton={!isJobClosed}
                onBidAccept={handleAcceptBid}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Job Summary
              </h3>

              <div className="space-y-4">
                {/* Job Stats */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting Price</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    ${job.startingPrice}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                    {job.status}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {!isJobClosed && (
                    <>
                      <button
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        disabled
                      >
                        Accept Top Bid
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Click on a bid above to accept
                      </p>
                    </>
                  )}

                  <button
                    onClick={() => router.push('/broker/dashboard')}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>

              {/* Helpful Tips */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  💡 Tips:
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Check all bids before deciding</li>
                  <li>• Consider quality, not just price</li>
                  <li>• Winner gets SMS with address</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
