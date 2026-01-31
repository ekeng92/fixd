# MASTER IMPLEMENTATION PLAN - Fix'D Beta v1.0
## Local Development with Email/Password Authentication

**Last Updated:** January 30, 2026  
**Status:** Planning Phase  
**Goal:** Transform mock app into functional local development beta

---

## 📋 TABLE OF CONTENTS
1. [Current State Analysis](#current-state-analysis)
2. [User Journey Analysis](#user-journey-analysis)
3. [Core Features Required](#core-features-required)
4. [Implementation Phases](#implementation-phases)
5. [Technical Architecture](#technical-architecture)
6. [Priority Matrix](#priority-matrix)

---

## 🔍 CURRENT STATE ANALYSIS

### What Works:
✅ Beautiful UI/UX design with modern gradients  
✅ Firebase integration structure in place  
✅ Type definitions for Job, Bid, User  
✅ Server actions scaffolded (createJob, submitBid, etc.)  
✅ Routing structure for broker/fixer flows  
✅ Real-time listeners ready (Firestore snapshots)  

### What Doesn't Work:
❌ No authentication (buttons don't work)  
❌ All data is mocked/hardcoded  
❌ Forms don't save to database  
❌ No real user sessions  
❌ Can't actually post jobs  
❌ Can't submit or accept bids  
❌ No job detail pages functional  
❌ SMS notifications stubbed out  
❌ Photo upload not implemented  

---

## 👥 USER JOURNEY ANALYSIS

### PERSONA 1: JOB POSTER (Broker/Homeowner)
**Name:** Sarah - Busy homeowner with a leaky faucet

#### Journey Map:
1. **Discovery** → Hears about Fix'D, visits website
2. **Sign Up** → Creates account with email/password
3. **Post Job** → 
   - Fills out job form (title, description, photos)
   - Chooses budget type (fixed or open to offers)
   - Optionally makes it private and invites specific handymen
   - Submits job
4. **Wait for Bids** → 
   - Receives notifications (email for now, SMS later)
   - Views incoming bids in real-time
   - Sees handyman profiles and their offers
5. **Compare Bids** →
   - Reviews bid amounts and messages
   - Checks handyman ratings/reviews
   - Sees who's available soonest
6. **Accept Bid** →
   - Selects winning bid
   - Winner gets full address
   - Other bidders notified
7. **Job Progress** →
   - Updates job status (in_progress → completed)
   - Can message handyman
   - Leaves review when done
8. **Completion** →
   - Marks job complete
   - Pays handyman (future: in-app payment)
   - Leaves rating/review

#### Pain Points to Solve:
- "I don't know what a fair price is" → Open to offers feature
- "I only trust certain handymen" → Private job invites
- "I need this done ASAP" → Real-time bidding
- "What if they don't show up?" → Ratings/reviews

### PERSONA 2: HANDYMAN (Fixer)
**Name:** Mike - Professional handyman looking for jobs

#### Journey Map:
1. **Discovery** → Referred by another handyman
2. **Sign Up** →
   - Creates account with email/password
   - Provides credentials/certifications
   - Waits for admin verification
3. **Get Verified** →
   - Admin reviews application
   - Approves or rejects
   - Mike gets email notification
4. **Browse Jobs** →
   - Sees list of available jobs
   - Filters by category, location, budget
   - Views job details and photos
5. **Submit Bid** →
   - Sees current bids (reverse auction)
   - Decides on competitive price
   - Adds personalized message
   - Submits bid
6. **Wait for Response** →
   - Gets email if bid accepted
   - Receives full address
   - Contacts homeowner
7. **Do the Work** →
   - Completes job
   - Homeowner marks complete
   - Gets paid (future)
8. **Build Reputation** →
   - Receives ratings/reviews
   - Improves profile
   - Gets more job invites

#### Pain Points to Solve:
- "I'm wasting time bidding on jobs I won't win" → Show competitive bids
- "I need steady work" → Job notifications
- "How do I stand out?" → Profile, ratings, custom messages
- "Payment uncertainty" → Future escrow system

---

## 🎯 CORE FEATURES REQUIRED

### PHASE 1: AUTHENTICATION & USER MANAGEMENT (P0 - Critical)
**Goal:** Users can create accounts and log in

#### 1.1 Email/Password Authentication
- [ ] Replace phone auth with email/password
- [ ] Firebase Auth setup for email/password
- [ ] Sign up form (email, password, name, role)
- [ ] Login form (email, password)
- [ ] Password reset flow
- [ ] Email verification (optional for beta)
- [ ] Session persistence
- [ ] Protected routes (redirects if not logged in)
- [ ] User context hook (`useAuth()`)

**Files to Modify:**
- `/app/login/page.tsx` - Replace SMS flow with email/password
- `/app/register/page.tsx` - Email/password signup
- `/lib/AuthContext.tsx` - Update auth methods
- `/api/auth/*` - New email auth endpoints
- `/middleware.ts` - Route protection

**Time Estimate:** 4-6 hours

---

### PHASE 2: JOB POSTING FLOW (P0 - Critical)
**Goal:** Brokers can post real jobs to Firebase

#### 2.1 Job Creation
- [ ] Connect form to createJob action
- [ ] Get current user from auth context
- [ ] Validate form inputs
- [ ] Handle photo uploads to Firebase Storage
- [ ] Save job to Firestore
- [ ] Redirect to job detail page
- [ ] Show success toast

#### 2.2 Job Management Dashboard
- [ ] Connect `/broker/my-jobs` to real data
- [ ] Load user's jobs from Firestore
- [ ] Real-time updates via snapshots
- [ ] Status update buttons working
- [ ] Edit job functionality
- [ ] Delete/cancel job functionality

#### 2.3 Job Detail View (Broker Side)
- [ ] `/broker/jobs/[id]` shows real job data
- [ ] Display all bids in real-time
- [ ] Accept bid button functional
- [ ] Show winner notification
- [ ] Update job status from detail page

**Files to Modify:**
- `/app/broker/jobs/new/page.tsx` - Connect to auth & actions
- `/app/broker/my-jobs/page.tsx` - Real data
- `/app/broker/jobs/[id]/page.tsx` - Accept bids
- `/actions/jobActions.ts` - Already mostly done
- `/lib/firebase.js` - Firebase Storage setup

**Time Estimate:** 6-8 hours

---

### PHASE 3: BIDDING FLOW (P0 - Critical)
**Goal:** Fixers can submit bids and win jobs

#### 3.1 Job Browsing
- [ ] `/fixer/jobs` shows real jobs from Firestore
- [ ] Filter by status (open only)
- [ ] Search/filter by category, location
- [ ] Real-time updates (new jobs appear)

#### 3.2 Job Detail View (Fixer Side)
- [ ] `/fixer/jobs/[id]` shows job details
- [ ] Display all competing bids (reverse auction)
- [ ] Submit bid form functional
- [ ] Save bid to Firestore
- [ ] Show own bids highlighted

#### 3.3 Bid Management
- [ ] `/fixer/my-bids` page
- [ ] Shows all submitted bids
- [ ] Status: pending, accepted, rejected
- [ ] Edit/cancel pending bids
- [ ] Notifications when bid accepted

**Files to Modify:**
- `/app/fixer/jobs/page.tsx` - Real data feed
- `/app/fixer/jobs/[id]/page.tsx` - Submit bids
- Create `/app/fixer/my-bids/page.tsx` - New page
- `/components/LiveBidBoard.tsx` - Connect to real bids
- `/actions/jobActions.ts` - submitBid already exists

**Time Estimate:** 6-8 hours

---

### PHASE 4: ADMIN VERIFICATION (P1 - High Priority)
**Goal:** Admin can verify fixers before they see jobs

#### 4.1 Admin Dashboard
- [ ] `/admin/fixers` shows unverified fixers
- [ ] Approve/reject buttons
- [ ] View fixer details
- [ ] Email notification on verification
- [ ] Protected route (admin only)

#### 4.2 Fixer Onboarding
- [ ] After signup, fixer sees "pending verification" message
- [ ] Can't bid until verified
- [ ] Email when approved

**Files to Modify:**
- `/app/admin/fixers/page.tsx` - Already exists, needs connection
- `/actions/userActions.ts` - verifyFixer already exists
- Create email notification templates

**Time Estimate:** 3-4 hours

---

### PHASE 5: NOTIFICATIONS (P1 - High Priority)
**Goal:** Users get notified of important events

#### 5.1 Email Notifications (Instead of SMS for Beta)
- [ ] New job posted → notify verified fixers
- [ ] Bid submitted → notify job poster
- [ ] Bid accepted → notify winner
- [ ] Bid rejected → notify other bidders
- [ ] Fixer verified → notify fixer
- [ ] Use Resend or SendGrid for emails

#### 5.2 In-App Notifications
- [ ] Notification bell icon in header
- [ ] Notification list
- [ ] Mark as read
- [ ] Notification badge count

**Files to Create:**
- `/lib/email.ts` - Email service wrapper
- `/lib/notifications.ts` - Update with email instead of SMS
- `/components/NotificationBell.tsx` - New component

**Time Estimate:** 4-5 hours

---

### PHASE 6: PHOTO UPLOAD (P1 - High Priority)
**Goal:** Users can upload job photos

#### 6.1 Firebase Storage Integration
- [ ] Setup Firebase Storage
- [ ] Upload multiple photos
- [ ] Resize/optimize images
- [ ] Generate thumbnail
- [ ] Delete photos
- [ ] Display in job cards and details

**Files to Modify:**
- `/app/broker/jobs/new/page.tsx` - Upload photos
- Create `/lib/storage.ts` - Storage helpers

**Time Estimate:** 3-4 hours

---

### PHASE 7: ENHANCED JOB FEATURES (P2 - Medium Priority)
**Goal:** Improve job posting and management

#### 7.1 Job Editing
- [ ] Create `/broker/jobs/[id]/edit` page
- [ ] Load existing job data
- [ ] Update job in Firestore
- [ ] Only allow if status is 'open'

#### 7.2 Job Search & Filters
- [ ] Search jobs by keyword
- [ ] Filter by category
- [ ] Filter by budget range
- [ ] Filter by location/zip code
- [ ] Sort by date, budget, bids

#### 7.3 Job Categories
- [ ] Predefined categories (Plumbing, Electrical, etc.)
- [ ] Category icons
- [ ] Filter by category

**Time Estimate:** 4-5 hours

---

### PHASE 8: USER PROFILES & RATINGS (P2 - Medium Priority)
**Goal:** Build trust through profiles and reviews

#### 8.1 Fixer Profiles
- [ ] Profile page `/fixer/profile/[id]`
- [ ] Bio, skills, experience
- [ ] Portfolio photos
- [ ] Ratings & reviews
- [ ] Jobs completed count
- [ ] Response time stats

#### 8.2 Rating System
- [ ] Broker can rate fixer after job completion
- [ ] 5-star rating
- [ ] Written review
- [ ] Display on fixer profile
- [ ] Average rating calculation

#### 8.3 Broker Profiles (Simple)
- [ ] Basic info for transparency
- [ ] Jobs posted count
- [ ] Average budget

**Files to Create:**
- `/app/fixer/profile/[id]/page.tsx`
- `/app/broker/profile/page.tsx`
- `/components/RatingStars.tsx`
- `/components/ReviewCard.tsx`

**Time Estimate:** 6-7 hours

---

### PHASE 9: MESSAGING (P2 - Medium Priority)
**Goal:** Broker and fixer can communicate

#### 9.1 Basic Chat
- [ ] Chat interface on job detail page
- [ ] Real-time messages (Firestore)
- [ ] Only between job poster and bidder
- [ ] After bid accepted, full chat unlocked
- [ ] Simple text messages only

**Files to Create:**
- `/components/JobChat.tsx`
- `/actions/messageActions.ts`
- New messages collection in Firestore

**Time Estimate:** 5-6 hours

---

### PHASE 10: PAYMENT INTEGRATION (P3 - Low Priority / Future)
**Goal:** Handle payments through platform

#### 10.1 Stripe Integration
- [ ] Stripe account setup
- [ ] Payment escrow when bid accepted
- [ ] Release payment when job completed
- [ ] Platform fee calculation
- [ ] Payment history

**Note:** Complex feature, defer to post-beta

**Time Estimate:** 10-12 hours

---

## 🏗️ TECHNICAL ARCHITECTURE

### Authentication Flow
```
User enters email/password
    ↓
Firebase Auth validates
    ↓
Create/get user doc in Firestore
    ↓
Set iron-session cookie
    ↓
Redirect to dashboard
```

### Job Posting Flow
```
Broker fills form
    ↓
Upload photos to Storage → Get URLs
    ↓
Create job doc in Firestore
    ↓
Trigger email notifications to fixers
    ↓
Redirect to job detail page
```

### Bidding Flow
```
Fixer views job
    ↓
Submits bid with amount & message
    ↓
Bid saved to Firestore
    ↓
Email notification to broker
    ↓
Real-time bid board updates
```

### Bid Acceptance Flow
```
Broker accepts bid
    ↓
Update job status → 'accepted'
    ↓
Set winnerId field
    ↓
Email winner with full address
    ↓
Email other bidders (job filled)
```

---

## 🗄️ DATABASE SCHEMA UPDATES NEEDED

### Users Collection (Already exists)
```javascript
{
  id: auto,
  uid: string, // Firebase Auth UID
  email: string, // NEW - instead of phoneNumber
  role: 'broker' | 'fixer',
  name: string,
  isVerified: boolean,
  createdAt: timestamp,
  
  // NEW FIELDS for profiles
  bio?: string,
  skills?: string[],
  avatar?: string,
  rating?: number,
  reviewCount?: number,
}
```

### Jobs Collection (Existing + updates)
```javascript
{
  id: auto,
  brokerId: string,
  brokerName: string,
  title: string,
  description: string,
  category: string,
  photos: string[], // Firebase Storage URLs
  zipCode: string,
  privateAddress: string,
  startingPrice: number | null,
  isPrivate: boolean,
  invitedFixers: string[],
  status: 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled',
  winnerId?: string,
  winningBidAmount?: number,
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

### Bids Collection (Already exists)
```javascript
{
  id: auto,
  jobId: string,
  fixerId: string,
  fixerName: string,
  fixerRating?: number, // NEW
  amount: number,
  message: string,
  status: 'pending' | 'accepted' | 'rejected', // NEW
  createdAt: timestamp,
}
```

### NEW: Reviews Collection
```javascript
{
  id: auto,
  jobId: string,
  brokerId: string,
  fixerId: string,
  rating: number, // 1-5
  review: string,
  createdAt: timestamp,
}
```

### NEW: Messages Collection
```javascript
{
  id: auto,
  jobId: string,
  senderId: string,
  senderName: string,
  message: string,
  createdAt: timestamp,
}
```

### NEW: Notifications Collection
```javascript
{
  id: auto,
  userId: string,
  type: 'new_job' | 'new_bid' | 'bid_accepted' | 'bid_rejected' | 'verified',
  title: string,
  message: string,
  link: string,
  read: boolean,
  createdAt: timestamp,
}
```

---

## 📊 PRIORITY MATRIX

### Must Have (P0) - Week 1
```
┌─────────────────────────────────────┐
│ 1. Email/Password Auth              │ 4-6h
│ 2. Job Posting (with Storage)       │ 6-8h
│ 3. Job Browsing & Detail            │ 4-5h
│ 4. Submit Bids                       │ 4-5h
│ 5. Accept Bids                       │ 3-4h
│ 6. My Jobs Dashboard                 │ 3-4h
│ 7. My Bids Dashboard                 │ 3-4h
├─────────────────────────────────────┤
│ TOTAL: 27-36 hours (~1 week)        │
└─────────────────────────────────────┘
```

### Should Have (P1) - Week 2
```
┌─────────────────────────────────────┐
│ 8. Admin Verification                │ 3-4h
│ 9. Email Notifications               │ 4-5h
│ 10. Job Editing                      │ 2-3h
│ 11. Search & Filters                 │ 3-4h
├─────────────────────────────────────┤
│ TOTAL: 12-16 hours (~2-3 days)      │
└─────────────────────────────────────┘
```

### Nice to Have (P2) - Week 3
```
┌─────────────────────────────────────┐
│ 12. User Profiles                    │ 4-5h
│ 13. Rating System                    │ 3-4h
│ 14. Basic Messaging                  │ 5-6h
│ 15. In-app Notifications             │ 3-4h
├─────────────────────────────────────┤
│ TOTAL: 15-19 hours (~2-3 days)      │
└─────────────────────────────────────┘
```

### Future Enhancements (P3)
- Payment integration (Stripe)
- SMS notifications (Twilio)
- Advanced search with map
- Mobile app
- Analytics dashboard
- Automated matching

---

## 📝 IMPLEMENTATION CHECKLIST

### Pre-Development Setup
- [ ] Set up Firebase project (already done)
- [ ] Enable Email/Password authentication in Firebase Console
- [ ] Set up Firebase Storage
- [ ] Create `.env.local` with all required vars
- [ ] Set up email service (Resend/SendGrid)

### Phase 1: Core Auth (Day 1-2)
- [ ] Replace phone auth with email/password
- [ ] Update login page
- [ ] Update register page
- [ ] Update AuthContext
- [ ] Add route protection middleware
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Test protected routes

### Phase 2: Job Posting (Day 3-4)
- [ ] Firebase Storage setup
- [ ] Photo upload component
- [ ] Connect job creation form
- [ ] Test job creation
- [ ] Job detail page for brokers
- [ ] My jobs dashboard with real data
- [ ] Test job status updates
- [ ] Test job editing

### Phase 3: Bidding (Day 5-6)
- [ ] Job feed for fixers
- [ ] Job detail page for fixers
- [ ] Submit bid functionality
- [ ] Test bid submission
- [ ] Accept bid functionality
- [ ] Test bid acceptance
- [ ] My bids dashboard
- [ ] Test bid status updates

### Phase 4: Admin & Notifications (Day 7-8)
- [ ] Admin dashboard
- [ ] Fixer verification flow
- [ ] Email notification setup
- [ ] Test all notification types
- [ ] In-app notification bell
- [ ] Test notification delivery

### Phase 5: Polish & Testing (Day 9-10)
- [ ] Search and filters
- [ ] User profiles
- [ ] Rating system
- [ ] Messaging
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Comprehensive testing

---

## 🚀 DEVELOPMENT WORKFLOW

### Daily Routine
1. **Morning:** Pick highest priority incomplete task
2. **Develop:** Build feature with tests
3. **Test:** Manually test in browser
4. **Commit:** Git commit with clear message
5. **Deploy:** Push to main (auto-deploy to Vercel/local)
6. **Document:** Update this plan with progress

### Git Workflow
```bash
# Feature branch
git checkout -b feature/email-auth

# Make changes, commit often
git add .
git commit -m "feat: add email/password authentication"

# Push and merge
git push origin feature/email-auth
# Create PR, review, merge
```

### Testing Checklist
- [ ] Broker signup → job post → accept bid → complete
- [ ] Fixer signup → wait verification → browse jobs → submit bid → get accepted
- [ ] Admin approve fixer
- [ ] Email notifications sent
- [ ] Real-time updates work
- [ ] Mobile responsive
- [ ] Error handling

---

## 💡 DESIGN DECISIONS

### Why Email/Password instead of Phone SMS?
- **Simplicity:** No Twilio setup needed for beta
- **Cost:** Free during development
- **Familiarity:** Users understand email auth
- **Can add SMS later:** Easy migration path

### Why Not Use Firebase Auth UI?
- **Custom Design:** Beautiful UI already built
- **Control:** Full control over flow
- **Learning:** Understand the auth process

### Database Structure Choices
- **Denormalization:** Store brokerName in jobs for faster display
- **Real-time:** Use Firestore snapshots for live updates
- **Subcollections vs Top-level:** Top-level for easier querying

### Photo Storage Strategy
- **Firebase Storage:** Built-in, secure, CDN
- **Resize on upload:** Better performance
- **Max 5 photos:** Prevent abuse

---

## 📈 SUCCESS METRICS

### Beta Testing Goals
- 10 brokers post jobs
- 20 fixers submit bids
- 5 jobs completed end-to-end
- < 2 second page load time
- 0 critical bugs
- > 80% user satisfaction

### Performance Targets
- Auth flow: < 1 second
- Job posting: < 3 seconds
- Bid submission: < 1 second
- Real-time updates: < 500ms

---

## 🔧 TECHNICAL STACK SUMMARY

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

### Backend
- Firebase Firestore
- Firebase Storage
- Firebase Auth (Email/Password)
- Next.js Server Actions

### Notifications
- Email (Resend or SendGrid)
- Future: Twilio SMS

### Deployment
- Local development for now
- Ready for Vercel when needed

---

## 📚 RESOURCES NEEDED

### Environment Variables
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

# Session
SESSION_SECRET=

# Email
RESEND_API_KEY=
# or
SENDGRID_API_KEY=
```

### Documentation
- Firebase Auth: https://firebase.google.com/docs/auth
- Firebase Storage: https://firebase.google.com/docs/storage
- Resend: https://resend.com/docs
- Next.js Auth: https://nextjs.org/docs/authentication

---

## 🎯 NEXT STEPS

### Immediate Actions (Today)
1. Review this plan with team/stakeholders
2. Set up email service (Resend recommended - easy setup)
3. Enable Email/Password auth in Firebase Console
4. Start Phase 1: Replace phone auth with email/password

### This Week
- Complete Phase 1, 2, 3 (core functionality)
- Daily testing and bug fixes
- Update this document with progress

### Next Week
- Complete Phase 4, 5 (admin, notifications)
- Begin user testing
- Gather feedback

---

## ✅ COMPLETION CRITERIA

### Ready for Beta When:
- ✅ Brokers can sign up and post jobs
- ✅ Fixers can sign up and submit bids
- ✅ Admin can verify fixers
- ✅ Bids can be accepted
- ✅ Job statuses update correctly
- ✅ Email notifications work
- ✅ Photos upload successfully
- ✅ No critical bugs
- ✅ Mobile responsive
- ✅ Basic error handling

### Ready for Production When:
- ✅ All beta criteria met
- ✅ Payment integration complete
- ✅ SMS notifications working
- ✅ Comprehensive testing
- ✅ Security audit
- ✅ Terms of service & privacy policy
- ✅ Customer support system
- ✅ Analytics & monitoring

---

**END OF MASTER PLAN**

*This document will be updated as features are implemented and requirements evolve.*
