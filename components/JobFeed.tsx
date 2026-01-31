'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Job } from '@/types';

interface JobFeedProps {
  showClosed?: boolean;
  limit?: number;
}

export default function JobFeed({ showClosed = false, limit }: JobFeedProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    try {
      const jobsCollection = collection(db, 'jobs');

      let q: Query;
      if (showClosed) {
        // Get all jobs
        q = query(jobsCollection);
      } else {
        // Get only open jobs
        q = query(jobsCollection, where('status', '==', 'open'));
      }

      // Set up real-time listener
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

        // Apply limit if specified
        if (limit) {
          setJobs(jobList.slice(0, limit));
        } else {
          setJobs(jobList);
        }

        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up job feed:', error);
      setIsLoading(false);
    }
  }, [showClosed, limit]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 h-40 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No jobs available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const [bidCount, setBidCount] = useState(0);

  useEffect(() => {
    try {
      const bidsCollection = collection(db, 'bids');
      const q = query(bidsCollection, where('jobId', '==', job.id));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setBidCount(snapshot.size);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error getting bid count:', error);
    }
  }, [job.id]);

  const createdDate = job.createdAt instanceof Date ? job.createdAt : job.createdAt.toDate();
  const timeAgo = getTimeAgo(createdDate);

  const statusColors = {
    open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {job.description.substring(0, 100)}...
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[job.status]}`}>
          {job.status}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Budget:</span>
            <p className="font-semibold text-gray-800 dark:text-white">${job.startingPrice}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Location:</span>
            <p className="font-semibold text-gray-800 dark:text-white">{job.zipCode}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Bids:</span>
            <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {bidCount}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
