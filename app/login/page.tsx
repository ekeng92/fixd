'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Format phone number
      let formatted = phoneNumber.replace(/\D/g, '');
      if (!formatted.startsWith('1')) {
        formatted = '1' + formatted;
      }
      const fullNumber = '+' + formatted;

      // Validate
      if (!/^\+\d{10,15}$/.test(fullNumber)) {
        setError('Please enter a valid phone number');
        setIsLoading(false);
        return;
      }

      // Send code
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send code');
        setIsLoading(false);
        return;
      }

      setPhoneNumber(fullNumber);
      setStep('code');
      toast.success('Code sent! Check your SMS.');
      setIsLoading(false);
    } catch (err) {
      setError('Error sending code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (code.length !== 6) {
        setError('Code must be 6 digits');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to verify code');
        setIsLoading(false);
        return;
      }

      if (data.isNewUser) {
        // First time user - go to registration
        router.push(`/register?phone=${encodeURIComponent(phoneNumber)}`);
      } else {
        // Existing user - redirect to dashboard
        const role = data.user.role;
        router.push(role === 'broker' ? '/broker/dashboard' : '/fixer/jobs');
      }

      setIsLoading(false);
    } catch (err) {
      setError('Error verifying code. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Fix'D</h1>
            <p className="text-gray-600">Connect with trusted handymen</p>
          </div>

          {/* Phone Step */}
          {step === 'phone' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">We'll send you a 6-digit code via SMS</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !phoneNumber}
                className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          )}

          {/* Code Step */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <p className="text-sm text-gray-600 mb-3">Code sent to {phoneNumber}</p>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setCode('');
                  setError('');
                }}
                className="w-full px-4 py-2 text-blue-600 font-semibold hover:text-blue-700"
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
