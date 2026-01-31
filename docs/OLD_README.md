# FIXD - Silent Auction Marketplace for Handymen

A Next.js 14+ application using the App Router, Tailwind CSS, and Firebase (Firestore) for connecting homeowners with skilled handymen through a silent auction platform.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Server Actions:** Next.js Server Actions for data mutations

## 📁 Project Structure

```
fixd/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── lib/                   # Utility libraries
│   └── firebase.js        # Firebase initialization
├── types/                 # TypeScript type definitions
│   └── index.ts          # Job and Bid interfaces
├── actions/               # Server Actions
│   └── jobActions.ts     # Job and Bid creation actions
├── .env.local.example    # Environment variables template
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase configuration

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Data Model

### Job Document

```typescript
interface Job {
  id: string;                    // Auto-generated document ID
  title: string;                 // Job title
  description: string;           // Job description
  startingPrice: number;         // Starting price for bids
  status: 'open' | 'accepted' | 'completed';  // Job status
  createdAt: Timestamp | Date;   // Creation timestamp
}
```

**Firestore Collection:** `jobs`

### Bid Document

```typescript
interface Bid {
  id?: string;                   // Auto-generated document ID
  jobId: string;                 // Reference to job document
  fixerId: string;               // Fixer's user ID
  fixerName: string;             // Fixer's display name
  amount: number;                // Bid amount
  message: string;               // Bid message/proposal
  createdAt: Timestamp | Date;   // Creation timestamp
}
```

**Firestore Collection:** `bids`

## 🔧 Server Actions

### Creating a Job

```typescript
import { createJob } from '@/actions/jobActions';

const result = await createJob({
  title: "Fix leaky faucet",
  description: "Kitchen faucet is dripping and needs repair",
  startingPrice: 50,
  status: 'open' // optional, defaults to 'open'
});

if (result.success) {
  console.log('Job created with ID:', result.jobId);
} else {
  console.error('Error:', result.error);
}
```

### Creating a Bid

```typescript
import { createBid } from '@/actions/jobActions';

const result = await createBid({
  jobId: "job-document-id",
  fixerId: "fixer-user-id",
  fixerName: "John the Plumber",
  amount: 45,
  message: "I can fix this today. 10+ years experience."
});

if (result.success) {
  console.log('Bid created with ID:', result.bidId);
} else {
  console.error('Error:', result.error);
}
```

## 🎨 Usage Example

Here's a simple example of creating a job posting form:

```typescript
'use client';

import { useState } from 'react';
import { createJob } from '@/actions/jobActions';
import { JobInput } from '@/types';

export default function CreateJobForm() {
  const [formData, setFormData] = useState<JobInput>({
    title: '',
    description: '',
    startingPrice: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createJob(formData);
    
    if (result.success) {
      alert(`Job created! ID: ${result.jobId}`);
      // Reset form or redirect
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Job Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Starting Price"
        value={formData.startingPrice}
        onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Create Job
      </button>
    </form>
  );
}
```

## 🔒 Firestore Security Rules

Remember to set up proper security rules in your Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Jobs collection
    match /jobs/{jobId} {
      allow read: if true;  // Anyone can read jobs
      allow create: if request.auth != null;  // Authenticated users can create
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Bids collection
    match /bids/{bidId} {
      allow read: if true;  // Anyone can read bids
      allow create: if request.auth != null;  // Authenticated users can create
      allow update: if request.auth != null && request.auth.uid == resource.data.fixerId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.fixerId;
    }
  }
}
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Next Steps

1. **Add Authentication:** Implement Firebase Authentication for user management
2. **Build UI Components:** Create job listing, job detail, and bidding components
3. **Add Real-time Updates:** Use Firestore snapshots for real-time bid updates
4. **Implement Search & Filters:** Add job search and filtering functionality
5. **Add User Profiles:** Create profiles for homeowners and fixers
6. **Notification System:** Implement notifications for new bids and job updates

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
