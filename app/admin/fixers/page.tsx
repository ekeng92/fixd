'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getUnverifiedFixers, verifyFixer, unverifyFixer } from '@/actions/userActions';
import { User } from '@/types';

export default function AdminFixersPage() {
  const router = useRouter();
  const [fixers, setFixers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'verified'>('pending');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Mock admin check - in production, check against actual auth
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/login');
      return;
    }

    fetchFixers();
  }, []);

  const fetchFixers = async () => {
    setIsLoading(true);
    try {
      const unverified = await getUnverifiedFixers();
      setFixers(unverified);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching fixers:', error);
      toast.error('Failed to load fixers');
      setIsLoading(false);
    }
  };

  const handleVerify = async (userId: string, fixerName: string) => {
    setIsUpdating(userId);

    try {
      const result = await verifyFixer(userId);

      if (result.success) {
        toast.success(`${fixerName} has been verified!`);
        setFixers((prev) => prev.filter((f) => f.id !== userId));
      } else {
        toast.error(result.error || 'Failed to verify fixer');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleUnverify = async (userId: string, fixerName: string) => {
    setIsUpdating(userId);

    try {
      const result = await unverifyFixer(userId);

      if (result.success) {
        toast.success(`${fixerName} has been unverified`);
        fetchFixers();
      } else {
        toast.error(result.error || 'Failed to unverify fixer');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

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
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Manage fixer verification
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Warning */}
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            🔐 <strong>Admin Access:</strong> This page is for administrators only. Do not share access credentials.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <StatCard label="Pending Verification" value={fixers.length.toString()} icon="⏳" />
          <StatCard label="Total Fixers" value="15" icon="🔧" />
          <StatCard label="Active Jobs" value="8" icon="📝" />
        </div>

        {/* Fixers List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Fixer Verification Requests
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Review and approve new handymen to start receiving job notifications
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-2xl">⚙️</div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading fixers...</p>
            </div>
          ) : fixers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                ✅ No pending verification requests
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                All new fixers have been verified or there are none yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-white">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-white">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-white">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {fixers.map((fixer) => (
                    <tr key={fixer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{fixer.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{fixer.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {fixer.phoneNumber}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            fixer.isVerified
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          }`}
                        >
                          {fixer.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {!fixer.isVerified && (
                            <button
                              onClick={() => handleVerify(fixer.id || '', fixer.name)}
                              disabled={isUpdating === fixer.id}
                              className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              {isUpdating === fixer.id ? 'Verifying...' : 'Verify'}
                            </button>
                          )}
                          {fixer.isVerified && (
                            <button
                              onClick={() => handleUnverify(fixer.id || '', fixer.name)}
                              disabled={isUpdating === fixer.id}
                              className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              {isUpdating === fixer.id ? 'Removing...' : 'Unverify'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
            📋 How Verification Works
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li>• Verified fixers receive SMS notifications for new jobs in their area</li>
            <li>• Verification ensures fixers meet quality standards</li>
            <li>• Unverified fixers cannot bid on jobs</li>
            <li>• You can unverify fixers at any time</li>
          </ul>
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
