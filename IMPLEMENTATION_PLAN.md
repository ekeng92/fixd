# Fix'D Marketplace - Complete Implementation Plan
## Production-Ready MVP Roadmap

**Goal:** Transform the existing Next.js foundation into a live reverse auction marketplace for home repairs, ready to handle $5,000 of pending work with 2 active fixers.

---

## 🎯 Project Overview

### Current State
✅ Next.js 14+ with App Router  
✅ TypeScript + Tailwind CSS  
✅ Firebase/Firestore setup  
✅ Basic Job/Bid types  
✅ Simple createJob/createBid actions  

### Target State
🎯 Mobile-first PWA marketplace  
🎯 SMS-based authentication (Twilio)  
🎯 Real-time bidding with live updates  
🎯 Photo upload for jobs  
🎯 Role-based access (Broker vs Fixer)  
🎯 Automated SMS notifications  
🎯 Private address protection  

---

## 📊 Implementation Phases

### **PHASE 1: Foundation & Dependencies** ⏱️ 30 min
*Priority: CRITICAL - Must complete first*

#### Tasks:
1. **Install Required Packages**
   ```bash
   npm install twilio firebase-admin iron-session
   npm install -D @types/node
   ```

2. **Environment Configuration**
   - Create `.env.local` with:
     - Twilio credentials (Account SID, Auth Token, Phone Number, Verify Service SID)
     - Firebase Admin SDK credentials
     - Session secret key

3. **Update Database Schema**
   - File: `types/index.ts`
   - Add: `User`, `UserRole` types
   - Update: `Job` interface (add photos, zipCode, privateAddress, brokerId, winnerId)
   - Update: `JobStatus` to include 'closed'

**Testing Checkpoint:** Environment variables load correctly, types compile without errors

---

### **PHASE 2: Authentication System** ⏱️ 2-3 hours
*Priority: HIGH - Blocking for all user flows*

#### Tasks:
1. **Twilio Integration**
   - File: `lib/twilio.ts`
   - Functions: `sendVerificationCode()`, `verifyCode()`
   - Test with your phone number first

2. **Session Management**
   - File: `lib/auth.ts`
   - Use `iron-session` for secure HTTP-only cookies
   - Functions: `getSession()`, `setSession()`, `destroySession()`

3. **Auth API Routes**
   - File: `app/api/auth/send-code/route.ts`
   - File: `app/api/auth/verify-code/route.ts`
   - Handle phone number → SMS → code verification

4. **Login UI**
   - File: `app/login/page.tsx`
   - Phone input with country code
   - Magic code verification
   - Clean, mobile-first design

5. **Auth Context**
   - File: `lib/AuthContext.tsx`
   - Provide current user across app
   - Handle loading states

6. **Middleware Protection**
   - File: `middleware.ts`
   - Protect `/broker/*` and `/fixer/*` routes
   - Redirect unauthenticated users to `/login`

**Testing Checkpoint:** Can send SMS, verify code, create session, access protected routes

---

### **PHASE 3: User & Role Management** ⏱️ 1-2 hours
*Priority: HIGH - Required for role-based features*

#### Tasks:
1. **User Server Actions**
   - File: `actions/userActions.ts`
   - Functions:
     - `createUser(phoneNumber, role, name)`
     - `getUserByPhone(phoneNumber)`
     - `verifyFixer(userId)` - Admin only

2. **User Registration Flow**
   - File: `app/register/page.tsx`
   - After code verification, collect: name, role (broker/fixer)
   - Create user in Firestore `users` collection

3. **Admin Panel (Simple)**
   - File: `app/admin/fixers/page.tsx`
   - List all fixers with verification status
   - Button to verify/unverify
   - Protected with simple password (env var)

**Testing Checkpoint:** Can register as broker/fixer, admin can verify fixers

---

### **PHASE 4: Photo Upload System** ⏱️ 1-2 hours
*Priority: MEDIUM - Needed before job creation*

#### Tasks:
1. **Firebase Storage Setup**
   - Update: `lib/firebase.js`
   - Initialize Firebase Storage

2. **Upload Utilities**
   - File: `lib/storage.ts`
   - Functions:
     - `uploadJobPhoto(file, jobId)` - Returns URL
     - `deleteJobPhoto(url)`
   - Client-side compression (max 500KB)

3. **Update CreateJobForm**
   - File: `components/CreateJobForm.tsx`
   - Add multi-photo upload (max 5)
   - Preview thumbnails
   - Drag-and-drop support

**Testing Checkpoint:** Can upload photos, see previews, get Firebase Storage URLs

---

### **PHASE 5: Enhanced Job Management** ⏱️ 2-3 hours
*Priority: HIGH - Core broker functionality*

#### Tasks:
1. **Update Job Types & Actions**
   - Update: `types/index.ts` (already done in Phase 1)
   - Update: `actions/jobActions.ts`
   - New function: `createJobWithNotifications()`
     - Save job to Firestore
     - Query all verified fixers
     - Send SMS to each (defer to Phase 6)

2. **Broker Dashboard**
   - File: `app/broker/dashboard/page.tsx`
   - Show all jobs created by current broker
   - Filter by status (open/accepted/closed)
   - Real-time updates via `onSnapshot`

3. **Job Feed Component**
   - File: `components/JobFeed.tsx`
   - Display job cards with:
     - Title, description, starting price
     - Number of bids (real-time)
     - Status badge
     - Click to view details

4. **Job Detail Page**
   - File: `app/broker/jobs/[id]/page.tsx`
   - Full job details + photos
   - List of all bids (sorted by amount or time)
   - Accept/Reject buttons per bid

5. **Accept Bid Functionality**
   - Update: `actions/jobActions.ts`
   - Function: `acceptBid(jobId, bidId)`
     - Update job status to 'accepted'
     - Set winnerId
     - Send SMS notifications (defer to Phase 6)

**Testing Checkpoint:** Broker can create jobs, view dashboard, see bids, accept bid

---

### **PHASE 6: Real-Time Bidding Interface** ⏱️ 3-4 hours
*Priority: CRITICAL - Core fixer functionality*

#### Tasks:
1. **Fixer Jobs List**
   - File: `app/fixer/jobs/page.tsx`
   - Show all open jobs (exclude accepted/closed)
   - Real-time updates
   - Click to view detail

2. **Live Bid Board**
   - File: `components/LiveBidBoard.tsx`
   - Use Firebase `onSnapshot` for real-time bid updates
   - Display all bids for a job (sorted by amount, ascending)
   - Show: Fixer name, amount, message, timestamp
   - **Pulsating "LIVE" badge** when new bid arrives
   - Highlight current user's bid

3. **Fixer Job Detail Page**
   - File: `app/fixer/jobs/[id]/page.tsx`
   - Job details (title, description, photos, zipCode)
   - **Hide privateAddress** until accepted
   - Embed `<LiveBidBoard />`
   - Embed `<CreateBidForm />`

4. **Update CreateBidForm**
   - File: `components/CreateBidForm.tsx`
   - Auto-populate fixerId, fixerName from auth context
   - Fields: amount, message
   - Show current lowest bid (or starting price)
   - Allow bidding HIGHER with justification
   - Submit via `submitBid()` action

5. **Submit Bid Action**
   - Update: `actions/jobActions.ts`
   - Function: `submitBid(jobId, amount, message)`
   - Validate fixer is verified
   - Save to Firestore `bids` collection
   - Real-time updates happen automatically

**Testing Checkpoint:** Fixer sees jobs, can bid, sees real-time updates, "LIVE" badge animates

---

### **PHASE 7: SMS Notifications (Twilio)** ⏱️ 2-3 hours
*Priority: HIGH - Critical for user engagement*

#### Tasks:
1. **SMS Templates**
   - File: `lib/smsTemplates.ts`
   - Functions:
     - `newJobMessage(job, link)` - "New Job: {title} in {zipCode}. Budget ${startingPrice}. Tap: {link}"
     - `bidAcceptedMessage(job, link)` - "Congrats! You won {title}. Address: {privateAddress}. Details: {link}"
     - `bidRejectedMessage(job)` - "Job {title} has been closed. Keep bidding on new jobs!"

2. **SMS API Route**
   - File: `app/api/notifications/send-sms/route.ts`
   - Accept: phoneNumber, message
   - Use Twilio client to send SMS
   - Error handling + logging

3. **Notification Utilities**
   - File: `lib/notifications.ts`
   - Functions:
     - `notifyFixersOfNewJob(jobId)`
     - `notifyBidAcceptance(jobId, winnerBidId)`
   - Call SMS API route

4. **Integrate Notifications**
   - Update: `actions/jobActions.ts`
   - In `createJobWithNotifications()`: Call `notifyFixersOfNewJob()`
   - In `acceptBid()`: Call `notifyBidAcceptance()`

5. **Deep Linking**
   - Ensure SMS links like `https://fixd.app/fixer/jobs/{jobId}` work
   - Handle auth redirect if not logged in

**Testing Checkpoint:** SMS sent on job creation, SMS sent on bid acceptance/rejection

---

### **PHASE 8: PWA & Mobile Optimization** ⏱️ 1-2 hours
*Priority: MEDIUM - Important for fixer UX*

#### Tasks:
1. **PWA Manifest**
   - File: `public/manifest.json`
   - App name, icons, theme colors
   - Add to `app/layout.tsx` metadata

2. **Service Worker (Optional for MVP)**
   - File: `public/sw.js`
   - Basic offline caching (optional, can skip for speed)

3. **Mobile-First CSS**
   - Update: `app/globals.css`
   - Large touch targets (min 48px)
   - Bottom navigation for fixers
   - Sticky headers
   - Smooth transitions

4. **Responsive Components**
   - Review all components
   - Test on mobile viewport (375px width)
   - Ensure forms are easy to fill on phone

**Testing Checkpoint:** App installs as PWA, works smoothly on mobile devices

---

### **PHASE 9: Polish & Production Prep** ⏱️ 2-3 hours
*Priority: MEDIUM - Needed before launch*

#### Tasks:
1. **Error Handling**
   - Add error boundaries
   - Toast notifications for success/error
   - Graceful fallbacks

2. **Loading States**
   - Skeleton loaders for job feed
   - Spinner on form submission
   - Optimistic UI updates

3. **Security Hardening**
   - Firestore security rules
   - Validate user roles server-side
   - Rate limit SMS sending

4. **Testing Critical Flows**
   - End-to-end: Broker creates job → Fixer receives SMS → Fixer bids → Broker accepts → Winner receives address
   - Test with 2 real fixers
   - Verify private address only shows after acceptance

5. **Deployment**
   - Deploy to Vercel
   - Set production environment variables
   - Test SMS in production

**Testing Checkpoint:** All critical flows work end-to-end in production

---

## 🗂️ File Structure (After Implementation)

```
fixd/
├── app/
│   ├── login/page.tsx                    # Phone + magic code login
│   ├── register/page.tsx                 # User registration (role selection)
│   ├── broker/
│   │   ├── dashboard/page.tsx            # Broker job feed
│   │   └── jobs/[id]/page.tsx           # Broker job detail + bid management
│   ├── fixer/
│   │   ├── jobs/
│   │   │   ├── page.tsx                 # Fixer job list
│   │   │   └── [id]/page.tsx            # Fixer bidding interface
│   ├── admin/
│   │   └── fixers/page.tsx              # Admin fixer verification
│   └── api/
│       ├── auth/
│       │   ├── send-code/route.ts
│       │   └── verify-code/route.ts
│       └── notifications/
│           └── send-sms/route.ts
├── components/
│   ├── CreateJobForm.tsx                # Enhanced with photo upload
│   ├── CreateBidForm.tsx                # Enhanced with auto-fill
│   ├── JobFeed.tsx                      # Real-time job list
│   ├── JobCard.tsx                      # Individual job card
│   └── LiveBidBoard.tsx                 # Real-time bid display with LIVE badge
├── lib/
│   ├── firebase.js                      # Updated with Storage
│   ├── twilio.ts                        # SMS utilities
│   ├── auth.ts                          # Session management
│   ├── storage.ts                       # Photo upload
│   ├── notifications.ts                 # SMS notifications
│   ├── smsTemplates.ts                  # SMS message builders
│   └── AuthContext.tsx                  # Auth state management
├── actions/
│   ├── jobActions.ts                    # Updated with notifications
│   └── userActions.ts                   # User CRUD operations
├── types/
│   └── index.ts                         # Updated with User, enhanced Job/Bid
├── middleware.ts                        # Route protection
└── public/
    └── manifest.json                    # PWA manifest
```

---

## 📋 Dependencies to Install

```bash
# Core dependencies
npm install twilio firebase-admin iron-session

# Utility libraries
npm install react-hot-toast # For notifications
npm install date-fns # For date formatting

# Dev dependencies
npm install -D @types/node
```

---

## 🔑 Environment Variables Needed

Create `.env.local`:
```env
# Firebase (existing)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin SDK (server-side)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...

# Twilio
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
TWILIO_VERIFY_SERVICE_SID=... # For Verify API

# Session
SESSION_SECRET=... # Generate with: openssl rand -base64 32

# Admin (simple password protection)
ADMIN_PASSWORD=your_secure_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Production: https://fixd.app
```

---

## ⚡ Quick Start Implementation Order

**Week 1: Core Infrastructure**
1. Phase 1: Foundation (30 min)
2. Phase 2: Authentication (3 hours)
3. Phase 3: User Management (2 hours)
4. Phase 4: Photo Upload (2 hours)

**Week 2: Core Features**
5. Phase 5: Job Management (3 hours)
6. Phase 6: Real-Time Bidding (4 hours)
7. Phase 7: SMS Notifications (3 hours)

**Week 3: Polish & Launch**
8. Phase 8: PWA Optimization (2 hours)
9. Phase 9: Testing & Deployment (3 hours)

**Total Estimated Time: 20-25 hours**

---

## 🎯 Critical Success Criteria

Before launching to your 2 fixers:

✅ Broker can create job with photos  
✅ SMS sent to all verified fixers instantly  
✅ Fixer can click SMS link and login easily  
✅ Fixer sees job details (zipCode visible, address hidden)  
✅ Fixer can submit bid with higher amount + justification  
✅ Real-time updates work (no refresh needed)  
✅ Broker sees all bids in real-time  
✅ Broker can accept bid  
✅ Winner receives SMS with full address  
✅ Losers receive "job closed" SMS  
✅ Private address only visible to winner  

---

## 🚨 Key Decisions to Make

1. **SMS Costs:** Twilio charges ~$0.0075/SMS. 100 SMS = $0.75. Start with trial credits?
2. **Photo Storage:** Firebase Storage free tier = 5GB. Compress images to <500KB each?
3. **Admin Access:** Simple password in env var or full admin auth?
4. **Session Duration:** Keep fixers logged in for 30 days or require re-auth?
5. **Bid Limits:** Allow fixers to bid multiple times on same job (update bid) or only once?
6. **Job Expiry:** Auto-close jobs after 24 hours if no bids accepted?

---

## 📞 Next Steps

1. **Review this plan** - Any changes needed?
2. **Set up Twilio account** - Get credentials
3. **Set up Firebase Admin** - Download service account key
4. **Start with Phase 1** - I can help implement each phase step-by-step

**Ready to start building?** Let me know which phase you'd like to tackle first, or if you want me to start implementing Phase 1 immediately!
