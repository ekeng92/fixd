# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (Already Done ✅)
The project dependencies are already installed. If you need to reinstall:
```bash
npm install
```

### Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database:
   - Click "Firestore Database" in the left menu
   - Click "Create database"
   - Start in production mode or test mode
   - Choose a location

4. Get your Firebase config:
   - Click the gear icon > Project settings
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Copy the configuration values

### Step 3: Configure Environment Variables

1. Create `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Step 4: Set Firestore Security Rules (Optional for Testing)

In Firebase Console > Firestore Database > Rules, use these rules for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // WARNING: Only for development!
    }
  }
}
```

**⚠️ Important:** Change these rules for production! See README.md for secure rules.

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Test Creating a Job

1. Navigate to [http://localhost:3000/jobs/new](http://localhost:3000/jobs/new)
2. Fill out the form:
   - Title: "Fix leaky faucet"
   - Description: "Kitchen faucet is dripping and needs repair"
   - Starting Price: 50
3. Click "Create Job"
4. Check Firebase Console to see the new job document!

## 🧪 Test the Server Action Programmatically

You can test the `createJob` function in any client component:

```typescript
'use client';

import { createJob } from '@/actions/jobActions';

export default function TestPage() {
  const handleTest = async () => {
    const result = await createJob({
      title: "Test Job",
      description: "This is a test job",
      startingPrice: 100,
    });
    
    console.log(result);
  };

  return <button onClick={handleTest}>Test Create Job</button>;
}
```

## 📊 View Your Data in Firebase

1. Go to Firebase Console
2. Click "Firestore Database"
3. You should see collections:
   - `jobs` - Contains all job documents
   - `bids` - Contains all bid documents (when you add bidding functionality)

## 🎯 What You Can Do Now

- ✅ Create jobs via the form
- ✅ Jobs are saved to Firestore
- ✅ TypeScript provides type safety
- ✅ Server Actions handle data mutations

## 📝 Next Development Steps

1. **Create a Job Listing Page**
   - Display all jobs from Firestore
   - Use `getAllJobs()` from `lib/queries.ts`

2. **Add Job Detail Page**
   - Show individual job details
   - Display bids for the job
   - Use `getJobById()` and `getBidsByJobId()`

3. **Implement Bidding**
   - Create a bid form component
   - Use `createBid()` from `actions/jobActions.ts`

4. **Add Authentication**
   - Install Firebase Auth
   - Protect routes
   - Associate jobs/bids with users

5. **Real-time Updates**
   - Use Firestore snapshots
   - Update UI when new bids arrive

## 🆘 Troubleshooting

### "Firebase not initialized"
- Make sure `.env.local` file exists
- Check that all Firebase environment variables are set
- Restart the dev server after adding `.env.local`

### "Permission denied" when creating jobs
- Update Firestore security rules (see Step 4)
- Make sure Firestore is enabled in Firebase Console

### TypeScript errors
- Run `npm install` to ensure all types are installed
- Check `tsconfig.json` is properly configured

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- See `README.md` for complete documentation
- See `SETUP_SUMMARY.md` for project structure overview

---

**You're all set! Happy coding! 🎉**
