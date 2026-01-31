# QUICK START GUIDE - Start Building Today
## Get Your Beta Working in 1 Week

---

## 🎯 WEEK 1 SPRINT PLAN

### DAY 1: Authentication Foundation (4-6 hours)
**Goal:** Users can create accounts and log in with email/password

#### Morning: Setup (1-2 hours)
```bash
# 1. Enable Email/Password in Firebase Console
# Go to: Firebase Console → Authentication → Sign-in method
# Enable: Email/Password

# 2. Install any missing dependencies (if needed)
npm install

# 3. Verify .env.local has all Firebase keys
```

#### Afternoon: Build Auth (3-4 hours)
**Tasks:**
1. Update `/app/login/page.tsx`
   - Replace phone input with email/password fields
   - Update submit handler to use Firebase Auth
   
2. Update `/app/register/page.tsx`
   - Add email and password fields
   - Create user with Firebase Auth
   
3. Update `/lib/AuthContext.tsx`
   - Add `signInWithEmailAndPassword`
   - Add `createUserWithEmailAndPassword`
   - Update session management

4. Test the flow:
   - Sign up new user
   - Log in
   - Check session persists
   - Log out

**Deliverable:** Working login/signup

---

### DAY 2: Job Posting (6-8 hours)

#### Morning: Firebase Storage Setup (2 hours)
```javascript
// lib/storage.ts - Create this file
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadJobPhotos(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  
  for (const file of files) {
    const filename = `jobs/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }
  
  return urls;
}
```

#### Afternoon: Connect Job Form (4-6 hours)
1. Update `/app/broker/jobs/new/page.tsx`
   - Get current user from `useAuth()`
   - Upload photos before creating job
   - Call `createJob()` with real user ID
   - Handle loading states and errors

2. Test:
   - Post a job
   - Check it appears in Firestore
   - Verify photos uploaded to Storage

**Deliverable:** Can create real jobs

---

### DAY 3: Job Management (4-5 hours)

#### Update My Jobs Dashboard
1. `/app/broker/my-jobs/page.tsx`
   - Get current user ID
   - Load jobs from Firestore
   - Wire up status update buttons
   - Test real-time updates

2. `/app/broker/jobs/[id]/page.tsx`
   - Load job details
   - Display job info
   - Show bid section (prepare for Day 4)

**Deliverable:** Can view and manage jobs

---

### DAY 4: Job Browsing for Fixers (4-5 hours)

#### Fixer Job Feed
1. `/app/fixer/jobs/page.tsx`
   - Remove mock data
   - Connect to Firestore
   - Show only 'open' jobs
   - Real-time updates

2. `/app/fixer/jobs/[id]/page.tsx`
   - Load job details
   - Show bid submission form
   - Prepare for bid submission

**Deliverable:** Fixers can browse jobs

---

### DAY 5: Bidding System (6-8 hours)

#### Morning: Submit Bids (3-4 hours)
1. Update `/app/fixer/jobs/[id]/page.tsx`
   - Get current user (fixer)
   - Call `submitBid()` action
   - Show success/error messages
   - Update bid list in real-time

2. Update `/components/LiveBidBoard.tsx`
   - Connect to real Firestore bids
   - Show bids in real-time
   - Highlight own bids

#### Afternoon: Accept Bids (3-4 hours)
1. Update `/app/broker/jobs/[id]/page.tsx`
   - Add "Accept" button on each bid
   - Call `acceptBid()` action
   - Update UI when bid accepted
   - Show winner notification

**Deliverable:** Complete bid cycle works

---

### DAY 6: My Bids & Admin (5-6 hours)

#### Morning: Fixer Bids Dashboard (2-3 hours)
Create `/app/fixer/my-bids/page.tsx`
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MyBidsPage() {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'bids'),
      where('fixerId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bidList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBids(bidList);
    });

    return () => unsubscribe();
  }, [user]);

  // Render bids...
}
```

#### Afternoon: Admin Verification (3 hours)
1. Update `/app/admin/fixers/page.tsx`
   - Load unverified fixers
   - Call `verifyFixer()` action
   - Update UI when verified

**Deliverable:** Complete user flows

---

### DAY 7: Notifications & Polish (5-6 hours)

#### Morning: Email Setup (2-3 hours)
```bash
# Sign up for Resend (free tier)
# https://resend.com

npm install resend
```

Create `/lib/email.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: 'Fix\'D <noreply@yourapp.com>',
    to,
    subject,
    html,
  });
}

export async function notifyNewJob(job: Job, fixerEmail: string) {
  await sendEmail(
    fixerEmail,
    'New Job Available',
    `<p>A new job has been posted: ${job.title}</p>
     <a href="http://localhost:3000/fixer/jobs/${job.id}">View Job</a>`
  );
}
```

#### Afternoon: Wire Up Notifications (2-3 hours)
1. Update `/lib/notifications.ts`
   - Replace SMS with email
   - Send on job creation
   - Send on bid acceptance

2. Test all notification triggers

**Deliverable:** Email notifications working

---

## 🎯 END OF WEEK 1 CHECKLIST

### You Should Have:
- ✅ Email/password authentication
- ✅ Job posting with photo upload
- ✅ Job management dashboard
- ✅ Job browsing for fixers
- ✅ Bid submission
- ✅ Bid acceptance
- ✅ My bids dashboard
- ✅ Admin fixer verification
- ✅ Email notifications

### Test the Complete Flow:
1. **As Broker:**
   - Sign up → Post job with photos → Wait for bids → Accept bid → Mark complete

2. **As Fixer:**
   - Sign up → Wait for verification → Browse jobs → Submit bid → Get accepted → Complete job

3. **As Admin:**
   - Verify pending fixers

---

## 📝 CODE SNIPPETS TO USE

### Get Current User (Use Everywhere)
```typescript
import { useAuth } from '@/lib/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  // Use user.id, user.email, user.role, etc.
}
```

### Load Data from Firestore
```typescript
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

useEffect(() => {
  const q = query(
    collection(db, 'jobs'),
    where('brokerId', '==', userId)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setJobs(data);
  });

  return () => unsubscribe();
}, [userId]);
```

### Call Server Action
```typescript
import { createJob } from '@/actions/jobActions';

const handleSubmit = async () => {
  const result = await createJob(user.id, jobData);
  
  if (result.success) {
    toast.success('Job created!');
    router.push(`/broker/jobs/${result.jobId}`);
  } else {
    toast.error(result.error);
  }
};
```

---

## 🚨 COMMON PITFALLS TO AVOID

1. **Forgetting to check auth:** Always check `isAuthenticated` before showing protected content
2. **Not unsubscribing:** Always return cleanup function from useEffect
3. **Hardcoded user IDs:** Never use placeholder IDs in production code
4. **Missing error handling:** Always handle async errors with try/catch
5. **No loading states:** Show loading spinners during async operations

---

## 🔧 DEBUGGING TIPS

### Firebase Rules for Development
```javascript
// Firestore rules - DEVELOPMENT ONLY
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Open for development
    }
  }
}

// Storage rules - DEVELOPMENT ONLY
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Open for development
    }
  }
}
```

⚠️ **IMPORTANT:** Lock these down before production!

### Check Firebase Console
- Firestore → Data tab → See your data
- Storage → Files tab → See uploaded photos
- Authentication → Users tab → See registered users

### Console Logs
```typescript
console.log('User:', user);
console.log('Job data:', job);
console.log('Bids:', bids);
```

---

## 💪 MOTIVATION

### You're Building:
- A real, functional marketplace
- Something people actually need
- A platform that solves real problems
- Skills you can use anywhere

### After Week 1:
- You'll have a working beta
- Users can post jobs and bid
- Real data flowing through the system
- Foundation for future features

### Keep Going:
- One feature at a time
- Test as you build
- Don't worry about perfection
- Ship it and iterate

---

## 📞 QUICK REFERENCE

### Key Files to Edit:
1. `/app/login/page.tsx` - Auth
2. `/app/register/page.tsx` - Registration
3. `/lib/AuthContext.tsx` - Auth state
4. `/app/broker/jobs/new/page.tsx` - Post jobs
5. `/app/broker/my-jobs/page.tsx` - Manage jobs
6. `/app/fixer/jobs/page.tsx` - Browse jobs
7. `/app/fixer/jobs/[id]/page.tsx` - Submit bids
8. `/lib/email.ts` - Notifications

### Commands You'll Use:
```bash
npm run dev              # Start dev server
git add .                # Stage changes
git commit -m "message"  # Commit
```

---

**START NOW → PICK DAY 1 MORNING TASK → GO!**

You've got this! 🚀
