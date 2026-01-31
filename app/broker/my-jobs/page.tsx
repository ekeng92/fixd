'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Job } from '@/types';
import { updateJobStatus, cancelJob } from '@/actions/jobActions';
import toast from 'react-hot-toast';

export default function MyJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user (you'll need to implement this based on your auth)
  useEffect(() => {
    // TODO: Get from your auth context
    // For now, using a placeholder
    setCurrentUserId('current-user-id');
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    setIsLoading(true);

    try {
      const jobsCollection = collection(db, 'jobs');
      const q = query(jobsCollection, where('brokerId', '==', currentUserId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const jobList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];

        // Sort by newest first
        jobList.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
          const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
          return dateB.getTime() - dateA.getTime();
        });

        setJobs(jobList);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading jobs:', error);
      setIsLoading(false);
    }
  }, [currentUserId]);

  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    const result = await updateJobStatus(jobId, newStatus);
    if (result.success) {
      toast.success('Job status updated');
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  const handleCancelJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to cancel this job?')) return;

    const result = await cancelJob(jobId);
    if (result.success) {
      toast.success('Job cancelled');
    } else {
      toast.error(result.error || 'Failed to cancel job');
    }
  };

  const getStatusBadge = (status: Job['status']) => {
    const styles = {
      open: 'bg-green-100 text-green-700 border-green-300',
      accepted: 'bg-blue-100 text-blue-700 border-blue-300',
      in_progress: 'bg-purple-100 text-purple-700 border-purple-300',
      completed: 'bg-gray-100 text-gray-700 border-gray-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-40 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Jobs
          </h1>
          <p className="text-gray-600">Manage all your posted jobs</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-gray-500 text-sm mb-1">Total Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-gray-500 text-sm mb-1">Open</p>
            <p className="text-3xl font-bold text-green-600">
              {jobs.filter((j) => j.status === 'open').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-gray-500 text-sm mb-1">In Progress</p>
            <p className="text-3xl font-bold text-purple-600">
              {jobs.filter((j) => j.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-gray-500 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-600">
              {jobs.filter((j) => j.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md">
            <p className="text-gray-500 text-lg mb-4">You haven't posted any jobs yet</p>
            <button
              onClick={() => router.push('/broker/jobs/new')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      <p className="text-gray-600">{job.description}</p>
                    </div>
                    <div className="ml-4 text-right">
                      {job.startingPrice ? (
                        <div className="px-4 py-2 bg-gradient-to-br from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl shadow-md">
                          ${job.startingPrice}
                        </div>
                      ) : (
                        <div className="px-4 py-2 bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm font-bold rounded-2xl shadow-md">
                          Open to Offers
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="font-medium">{job.zipCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span className="font-medium">
                        {new Date(job.createdAt instanceof Date ? job.createdAt : job.createdAt.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    {job.isPrivate && (
                      <div className="flex items-center gap-2">
                        <span>🔒</span>
                        <span className="font-medium">Private Job</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => router.push(`/broker/jobs/${job.id}`)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    >
                      View Details
                    </button>

                    {job.status === 'open' && (
                      <button
                        onClick={() => router.push(`/broker/jobs/${job.id}/edit`)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                      >
                        Edit
                      </button>
                    )}

                    {job.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusChange(job.id, 'in_progress')}
                        className="px-6 py-3 bg-purple-100 text-purple-700 font-semibold rounded-xl hover:bg-purple-200 transition-all"
                      >
                        Mark In Progress
                      </button>
                    )}

                    {job.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(job.id, 'completed')}
                        className="px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-all"
                      >
                        Mark Completed
                      </button>
                    )}

                    {(job.status === 'open' || job.status === 'accepted') && (
                      <button
                        onClick={() => handleCancelJob(job.id)}
                        className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-all"
                      >
                        Cancel Job
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
