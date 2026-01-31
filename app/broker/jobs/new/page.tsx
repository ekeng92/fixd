'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createJob } from '@/actions/jobActions';
import { getVerifiedFixers } from '@/actions/userActions';
import { User } from '@/types';

export default function CreateJobPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    zipCode: '',
    privateAddress: '',
    startingPrice: '',
    budgetType: 'fixed' as 'fixed' | 'open',
    isPrivate: false,
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fixers, setFixers] = useState<User[]>([]);
  const [selectedFixers, setSelectedFixers] = useState<string[]>([]);

  // Load verified fixers for private job invitations
  useEffect(() => {
    async function loadFixers() {
      const verifiedFixers = await getVerifiedFixers();
      setFixers(verifiedFixers);
    }
    loadFixers();
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + photos.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    setPhotos([...photos, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.zipCode || !formData.privateAddress) {
        toast.error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Validate budget if fixed price selected
      if (formData.budgetType === 'fixed' && (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0)) {
        toast.error('Starting price must be greater than 0');
        setIsLoading(false);
        return;
      }

      // Validate private job has invited fixers
      if (formData.isPrivate && selectedFixers.length === 0) {
        toast.error('Please select at least one fixer for private job');
        setIsLoading(false);
        return;
      }

      // Mock photo URLs (in production, upload to Firebase Storage)
      const photoUrls = photoPreview.map((_, i) => `https://via.placeholder.com/400?text=Photo+${i + 1}`);

      // Determine starting price (null if open to offers)
      const startingPrice = formData.budgetType === 'open' ? null : parseFloat(formData.startingPrice);

      // Create job
      const result = await createJob('broker-123', {
        title: formData.title,
        description: formData.description,
        photos: photoUrls,
        zipCode: formData.zipCode,
        privateAddress: formData.privateAddress,
        startingPrice,
        isPrivate: formData.isPrivate,
        invitedFixers: formData.isPrivate ? selectedFixers : [],
      });

      if (result.success) {
        toast.success('Job posted successfully!');
        setTimeout(() => {
          router.push(`/broker/jobs/${result.jobId}`);
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to create job');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a job posting and get bids from qualified fixers
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Fix leaky kitchen faucet"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what needs to be fixed in detail..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photos (Max 5)
              </label>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">Click to upload photos</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">or drag and drop</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>

              {/* Photo Preview */}
              {photoPreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photoPreview.map((preview, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Zip Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="90210"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
            </div>

            {/* Budget Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Budget Preference *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, budgetType: 'fixed' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.budgetType === 'fixed'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-semibold text-gray-900 dark:text-white">Fixed Price</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Set a starting price
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, budgetType: 'open', startingPrice: '' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.budgetType === 'open'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-2xl mb-2">🤝</div>
                  <div className="font-semibold text-gray-900 dark:text-white">Open to Offers</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Let fixers suggest prices
                  </div>
                </button>
              </div>
            </div>

            {/* Starting Price (only if fixed budget) */}
            {formData.budgetType === 'fixed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Starting Price ($) *
                </label>
                <input
                  type="number"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  placeholder="100"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Fixers can bid at or below this price
                </p>
              </div>
            )}

            {/* Private Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Address (Hidden until bid accepted) *
              </label>
              <input
                type="text"
                value={formData.privateAddress}
                onChange={(e) => setFormData({ ...formData, privateAddress: e.target.value })}
                placeholder="123 Main St, Suite 4B, Los Angeles, CA 90210"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This address will only be shown to the fixer whose bid you accept
              </p>
            </div>

            {/* Private Job Option */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    🔒 Make this a private job
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Only selected fixers will see and bid on this job
                  </div>
                </div>
              </label>
            </div>

            {/* Fixer Selection (only if private) */}
            {formData.isPrivate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Fixers to Invite *
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-2">
                  {fixers.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No verified fixers available
                    </p>
                  ) : (
                    fixers.map((fixer) => (
                      <label
                        key={fixer.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFixers.includes(fixer.id!)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFixers([...selectedFixers, fixer.id!]);
                            } else {
                              setSelectedFixers(selectedFixers.filter((id) => id !== fixer.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {fixer.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {fixer.phoneNumber}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {selectedFixers.length > 0 && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {selectedFixers.length} fixer{selectedFixers.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Tips:</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Be specific about what needs to be done</li>
                <li>• Include relevant details and current photos</li>
                <li>• Choose "Open to Offers" if you're unsure about pricing</li>
                <li>• Use private jobs to invite trusted handymen you've worked with before</li>
                <li>• Verified fixers will be notified via SMS</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Posting Job...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
