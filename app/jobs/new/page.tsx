import CreateJobForm from '@/components/CreateJobForm';

export default function NewJobPage() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Post a New Job</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a job posting and let skilled handymen bid on it
          </p>
        </div>

        <CreateJobForm />

        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">💡 Tips for posting a job:</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• Be specific about what needs to be done</li>
            <li>• Include relevant details like location, timing, and materials needed</li>
            <li>• Set a fair starting price based on the complexity of the work</li>
            <li>• Respond promptly to bids from handymen</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
