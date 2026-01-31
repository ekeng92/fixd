'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import JobFeed from '@/components/JobFeed';

export default function BrokerDashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const brokerName = 'John Doe'; // Mock data

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
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Fix'D Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Welcome back, {brokerName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/broker/jobs/new"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Post New Job
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Active Jobs" value="3" icon="🔧" />
          <StatCard label="Total Bids" value="12" icon="💰" />
          <StatCard label="Jobs Completed" value="5" icon="✅" />
          <StatCard label="Average Bid Time" value="45 min" icon="⏱️" />
        </div>

        {/* Jobs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Your Active Jobs
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your job postings and accept the best bids
            </p>
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
