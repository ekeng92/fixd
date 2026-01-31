'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createUser } from '@/actions/userActions';
import type { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams?.get('phone') || '';

  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('fixer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!name.trim()) {
        setError('Name is required');
        setIsLoading(false);
        return;
      }

      // Create user
      const result = await createUser({
        uid: `user_${Date.now()}`,
        phoneNumber,
        role,
        name,
      });

      if (!result.success) {
        setError(result.error || 'Failed to register');
        setIsLoading(false);
        return;
      }

      toast.success('Account created successfully!');

      // Create session (mock - would need real session setup)
      setTimeout(() => {
        if (role === 'broker') {
          router.push('/broker/dashboard');
        } else {
          router.push('/fixer/jobs');
        }
      }, 500);

      setIsLoading(false);
    } catch (err) {
      setError('Error registering. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600 text-sm">Phone: {phoneNumber}</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a...
              </label>
              <div className="space-y-2">
                {/* Broker Option */}
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all" style={{
                  borderColor: role === 'broker' ? '#2563eb' : '#e5e7eb',
                  backgroundColor: role === 'broker' ? '#eff6ff' : '#ffffff',
                }}>
                  <input
                    type="radio"
                    name="role"
                    value="broker"
                    checked={role === 'broker'}
                    onChange={() => setRole('broker')}
                    className="w-4 h-4"
                    disabled={isLoading}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">Homeowner / Property Manager</p>
                    <p className="text-sm text-gray-600">Post jobs and hire fixers</p>
                  </div>
                </label>

                {/* Fixer Option */}
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all" style={{
                  borderColor: role === 'fixer' ? '#2563eb' : '#e5e7eb',
                  backgroundColor: role === 'fixer' ? '#eff6ff' : '#ffffff',
                }}>
                  <input
                    type="radio"
                    name="role"
                    value="fixer"
                    checked={role === 'fixer'}
                    onChange={() => setRole('fixer')}
                    className="w-4 h-4"
                    disabled={isLoading}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">Handyman / Tradesperson</p>
                    <p className="text-sm text-gray-600">Bid on jobs and earn</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Fixer Note */}
            {role === 'fixer' && (
              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                ℹ️ Fixers must be verified by an admin to receive job notifications.
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !name}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
