'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import JobFeed from '@/components/JobFeed';

export default function FixerJobsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'plumbing' | 'electrical' | 'carpentry'>('all');
  const fixerName = 'Mike Johnson'; // Mock data

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out');
      router.push('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Available Jobs
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Welcome, {fixerName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-2xl">📱</div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                How It Works
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Browse available jobs, view details and competing bids, and submit your bid with a custom message.
                If the homeowner accepts your bid, you'll receive an SMS with the full address and job details.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <StatCard label="Your Active Bids" value="5" icon="📝" />
          <StatCard label="Jobs Won" value="3" icon="🏆" />
          <StatCard label="Success Rate" value="85%" icon="⭐" />
        </div>

        {/* Jobs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Open Jobs Near You
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Real-time updates - new jobs appear instantly
                </p>
              </div>
              <Link
                href="/fixer/my-bids"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                My Bids
              </Link>
            </div>
          </div>

          <JobFeed showClosed={false} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
      </div>
    </div>
  );
}
