'use client';

import { useState } from 'react';

export default function JobPortal() {
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Fix Kitchen Sink Leak',
      description: 'Leaky faucet under kitchen sink needs repair or replacement. Water dripping constantly.',
      budget: 150,
      status: 'open',
      bids: 3,
      location: 'Beverly Hills, CA',
      zipCode: '90210',
      posted: '2h ago',
      category: 'Plumbing',
    },
    {
      id: 2,
      title: 'Drywall Repair & Painting',
      description: 'Large hole in living room wall (approx 12x8 inches) needs patching, sanding, and painting to match existing wall color.',
      budget: 300,
      status: 'open',
      bids: 1,
      location: 'West Hollywood, CA',
      zipCode: '90211',
      posted: '5h ago',
      category: 'Carpentry',
    },
    {
      id: 3,
      title: 'Install Ceiling Fan',
      description: 'Need to install a new ceiling fan in bedroom. Fan already purchased, just need installation and wiring.',
      budget: 200,
      status: 'open',
      bids: 5,
      location: 'Santa Monica, CA',
      zipCode: '90401',
      posted: '1d ago',
      category: 'Electrical',
    },
  ]);

  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    budget: '',
    category: 'General',
  });

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (newJob.title && newJob.description && newJob.budget) {
      const job = {
        id: jobs.length + 1,
        title: newJob.title,
        description: newJob.description,
        budget: parseInt(newJob.budget),
        status: 'open' as const,
        bids: 0,
        location: 'Los Angeles, CA',
        zipCode: '90001',
        posted: 'just now',
        category: newJob.category,
      };
      setJobs([job, ...jobs]);
      setNewJob({ title: '', description: '', budget: '', category: 'General' });
      setActiveTab('browse');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Navigation - Modern Glass Effect */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Gradient */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Fix'D</span>
            </div>

            {/* Navigation Links - Pill Style */}
            <div className="hidden md:flex items-center gap-3 bg-gray-100 rounded-full p-1.5">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  activeTab === 'browse'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Browse Jobs
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  activeTab === 'create'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Post a Job
              </button>
            </div>

            {/* Right Side Actions - Modern Buttons */}
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Better Spacing */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Mobile Tab Switcher - Colorful */}
        <div className="md:hidden flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all shadow-md ${
              activeTab === 'browse'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105'
                : 'bg-white text-gray-700 hover:shadow-lg'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all shadow-md ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105'
                : 'bg-white text-gray-700 hover:shadow-lg'
            }`}
          >
            Post Job
          </button>
        </div>

        {/* Browse Jobs View */}
        {activeTab === 'browse' && (
          <div>
            {/* Page Header - More Spacing */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                Available Jobs
              </h1>
              <p className="text-lg text-gray-600">
                {jobs.length} active {jobs.length === 1 ? 'job' : 'jobs'} ready for bids
              </p>
            </div>

            {/* Stats Cards - Vibrant with Gradients */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-2">Total Jobs</p>
                    <p className="text-5xl font-bold">{jobs.length}</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-4xl">📋</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-2">Total Bids</p>
                    <p className="text-5xl font-bold">
                      {jobs.reduce((sum, job) => sum + job.bids, 0)}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-4xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-2">Avg Budget</p>
                    <p className="text-5xl font-bold">
                      ${Math.round(jobs.reduce((sum, job) => sum + job.budget, 0) / jobs.length)}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-4xl">📊</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Grid - Modern Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group border border-gray-100 hover:scale-105"
                >
                  {/* Card Header with Gradient Accent */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-bold rounded-full mb-3">
                          {job.category}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                          {job.title}
                        </h3>
                      </div>
                      <span className="ml-4 px-4 py-2 bg-gradient-to-br from-green-400 to-emerald-500 text-white text-lg font-bold rounded-2xl shadow-md">
                        ${job.budget}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {job.description}
                    </p>

                    {/* Meta Info - Better Spacing */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📍</span>
                        <span className="font-medium">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🕐</span>
                        <span className="font-medium">{job.posted}</span>
                      </div>
                    </div>

                    {/* Footer - Modern Style */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-base font-bold text-gray-900">
                          {job.bids} {job.bids === 1 ? 'bid' : 'bids'}
                        </span>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Job View - Modern Form */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Form Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Post a New Job</h2>
                <p className="text-blue-100 text-lg">
                  Fill out the details below and get competitive bids from skilled professionals
                </p>
              </div>

              <div className="p-10">
                <form onSubmit={handlePostJob} className="space-y-8">
                  {/* Job Title */}
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-3">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Fix leaky kitchen faucet"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-lg"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-3">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newJob.category}
                      onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-lg"
                    >
                      <option value="General">General Repair</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Carpentry">Carpentry</option>
                      <option value="Painting">Painting</option>
                      <option value="HVAC">HVAC</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-3">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Describe what needs to be done in detail..."
                      rows={6}
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none text-lg leading-relaxed"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-3">
                      Budget <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-4 text-gray-500 font-bold text-xl">$</span>
                      <input
                        type="number"
                        placeholder="100"
                        value={newJob.budget}
                        onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-lg"
                      />
                    </div>
                  </div>

                  {/* Info Box - Colorful */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
                    <p className="text-base text-blue-900 leading-relaxed">
                      <strong className="text-lg">💡 Pro Tip:</strong> Jobs with clear descriptions and fair budgets get 3x more bids on average!
                    </p>
                  </div>

                  {/* Buttons - Modern Gradient */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab('browse')}
                      className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all text-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all text-lg"
                    >
                      Post Job
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
