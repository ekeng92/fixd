# FEATURE MAP - Visual Overview
## What Needs to Be Built

---

## 🗺️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                         FIX'D PLATFORM                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
          ┌──────▼──────┐                 ┌──────▼──────┐
          │   BROKER    │                 │    FIXER    │
          │ (Job Poster)│                 │  (Handyman) │
          └─────────────┘                 └─────────────┘
```

---

## 👤 USER ROLES & JOURNEYS

### BROKER (Homeowner) Journey

```
SIGN UP → VERIFY EMAIL → POST JOB → RECEIVE BIDS → ACCEPT BID → JOB COMPLETE
   │          │             │            │              │            │
   ▼          ▼             ▼            ▼              ▼            ▼
Email/Pwd  Welcome    Upload Photos  View Live    Send Address  Rate Fixer
Register   Email      Set Budget     Bid Board    Full Details  Leave Review
Choose                Choose Type    Compare                    Mark Done
Role                  Private?       Offers
```

### FIXER (Handyman) Journey

```
SIGN UP → VERIFY EMAIL → ADMIN APPROVAL → BROWSE JOBS → SUBMIT BID → WIN JOB → COMPLETE
   │          │               │               │            │          │          │
   ▼          ▼               ▼               ▼            ▼          ▼          ▼
Email/Pwd  Welcome      Wait for       Filter by     Enter Amt   Get Address  Get Rated
Register   Email        Admin          Category      + Message   Start Work   Get Paid
Fixer                   Notification   Location                  Update       Build
Role                    Email          Budget                    Status       Profile
```

### ADMIN Journey

```
LOGIN → VIEW FIXERS → VERIFY → SEND NOTIFICATION
  │         │          │            │
  ▼         ▼          ▼            ▼
Admin    Pending    Approve/    Fixer Gets
Email    List       Reject      Email
         Review                 Can Now
         Details                Bid
```

---

## 📱 PAGE STRUCTURE

```
/
├── page.tsx ..................... Landing page (public job browse)
├── login/
│   └── page.tsx ................. Email/password login
├── register/
│   └── page.tsx ................. Signup with role selection
│
├── broker/
│   ├── dashboard/
│   │   └── page.tsx ............. Overview, stats, recent jobs
│   ├── jobs/
│   │   ├── new/
│   │   │   └── page.tsx ......... ✅ POST NEW JOB
│   │   ├── [id]/
│   │   │   ├── page.tsx ......... ⭐ VIEW JOB + ACCEPT BIDS
│   │   │   └── edit/
│   │   │       └── page.tsx ..... Edit job details
│   │   └── my-jobs/
│   │       └── page.tsx ......... ✅ MANAGE ALL JOBS
│   └── profile/
│       └── page.tsx ............. Broker settings
│
├── fixer/
│   ├── jobs/
│   │   ├── page.tsx ............. ✅ BROWSE AVAILABLE JOBS
│   │   └── [id]/
│   │       └── page.tsx ......... ⭐ VIEW JOB + SUBMIT BID
│   ├── my-bids/
│   │   └── page.tsx ............. ✅ SEE ALL MY BIDS
│   └── profile/
│       └── [id]/
│           └── page.tsx ......... Fixer public profile
│
└── admin/
    └── fixers/
        └── page.tsx ............. ✅ VERIFY FIXERS

✅ = Already exists, needs connection to real data
⭐ = Critical functionality
```

---

## 🔥 CRITICAL FEATURES BREAKDOWN

### 1️⃣ AUTHENTICATION SYSTEM
**Status:** Needs email/password implementation

```
┌────────────────────────────────────────┐
│         AUTHENTICATION FLOW            │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────┐      ┌──────────┐      │
│  │  SIGNUP  │      │  LOGIN   │      │
│  └────┬─────┘      └────┬─────┘      │
│       │                 │             │
│       ▼                 ▼             │
│   Firebase Auth    Firebase Auth      │
│   Create User      Sign In            │
│       │                 │             │
│       ▼                 ▼             │
│   Create Doc       Get Doc            │
│   in Firestore     from Firestore     │
│       │                 │             │
│       ▼                 ▼             │
│   Set Session      Set Session        │
│   Cookie           Cookie             │
│       │                 │             │
│       └────────┬────────┘             │
│                ▼                      │
│           Redirect to                 │
│         Role Dashboard                │
│    (broker or fixer)                  │
└────────────────────────────────────────┘
```

**Files to Update:**
- `/app/login/page.tsx`
- `/app/register/page.tsx`
- `/lib/AuthContext.tsx`
- `/lib/firebase.js` (add auth import)

---

### 2️⃣ JOB POSTING SYSTEM
**Status:** Form exists, needs Firebase connection

```
┌──────────────────────────────────────────────────┐
│              JOB POSTING FLOW                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  User fills form:                                │
│  • Title, Description                            │
│  • Photos (up to 5)                              │
│  • Location (zip code)                           │
│  • Address (hidden until accepted)               │
│  • Budget Type:                                  │
│    ○ Fixed Price ($150)                          │
│    ○ Open to Offers (no price)                   │
│  • Privacy:                                      │
│    ○ Public (all fixers)                         │
│    ○ Private (select specific fixers)            │
│                                                  │
│  ┌─────────┐                                     │
│  │ SUBMIT  │                                     │
│  └────┬────┘                                     │
│       │                                          │
│       ▼                                          │
│  Upload Photos → Firebase Storage                │
│       │                                          │
│       ▼                                          │
│  Get Photo URLs                                  │
│       │                                          │
│       ▼                                          │
│  Create Job Doc → Firestore                     │
│       │                                          │
│       ▼                                          │
│  Send Emails → Notify Fixers                    │
│       │                                          │
│       ▼                                          │
│  Redirect → Job Detail Page                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

**What Happens:**
1. Broker fills form
2. Photos upload to Storage
3. Job saved to Firestore
4. Email notifications sent
5. Job appears in feeds

---

### 3️⃣ BIDDING SYSTEM
**Status:** Needs full implementation

```
┌──────────────────────────────────────────────────┐
│               BIDDING FLOW                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  FIXER SIDE:                                     │
│  ┌──────────────┐                                │
│  │ Browse Jobs  │                                │
│  └──────┬───────┘                                │
│         │                                        │
│         ▼                                        │
│  ┌──────────────┐                                │
│  │ View Details │                                │
│  │ • Job info   │                                │
│  │ • Photos     │                                │
│  │ • Current    │                                │
│  │   bids (!)   │ ← Reverse auction!             │
│  └──────┬───────┘                                │
│         │                                        │
│         ▼                                        │
│  ┌──────────────┐                                │
│  │ Submit Bid   │                                │
│  │ • Amount     │                                │
│  │ • Message    │                                │
│  └──────┬───────┘                                │
│         │                                        │
│         ▼                                        │
│  Save to Firestore                               │
│         │                                        │
│         ▼                                        │
│  Email Broker                                    │
│                                                  │
│  ─────────────────────────────────────           │
│                                                  │
│  BROKER SIDE:                                    │
│  ┌──────────────┐                                │
│  │ View Bids    │                                │
│  │ (Real-time)  │ ← Updates live!                │
│  └──────┬───────┘                                │
│         │                                        │
│         ▼                                        │
│  Compare offers:                                 │
│  • Price                                         │
│  • Fixer rating                                  │
│  • Message                                       │
│  • Time submitted                                │
│         │                                        │
│         ▼                                        │
│  ┌──────────────┐                                │
│  │ Accept Bid   │                                │
│  └──────┬───────┘                                │
│         │                                        │
│         ▼                                        │
│  Update job:                                     │
│  • status = 'accepted'                           │
│  • winnerId = fixerId                            │
│  • winningBidAmount = amount                     │
│         │                                        │
│         ▼                                        │
│  Send Emails:                                    │
│  • Winner → Full address                         │
│  • Others → Job filled                           │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Key Insight:** Fixers can see other bids (reverse auction)!

---

### 4️⃣ ADMIN VERIFICATION
**Status:** Page exists, needs connection

```
┌────────────────────────────────┐
│    ADMIN VERIFICATION          │
├────────────────────────────────┤
│                                │
│  Admin logs in                 │
│       │                        │
│       ▼                        │
│  See list of                   │
│  unverified fixers             │
│       │                        │
│       ▼                        │
│  Review details:               │
│  • Name                        │
│  • Email                       │
│  • Sign up date                │
│       │                        │
│       ▼                        │
│  ┌──────┐  ┌──────┐           │
│  │Approve│ │Reject│           │
│  └───┬──┘  └──┬───┘           │
│      │        │                │
│      ▼        ▼                │
│  Update     Delete             │
│  isVerified  user              │
│  = true                        │
│      │                         │
│      ▼                         │
│  Send email                    │
│  "You're approved!"            │
│      │                         │
│      ▼                         │
│  Fixer can now                 │
│  see and bid on jobs           │
│                                │
└────────────────────────────────┘
```

---

## 🔔 NOTIFICATION SYSTEM

```
┌─────────────────────────────────────────────┐
│          EMAIL NOTIFICATIONS                │
├─────────────────────────────────────────────┤
│                                             │
│  Trigger Events:                            │
│                                             │
│  1. NEW JOB POSTED                          │
│     → Email all verified fixers             │
│     → Subject: "New job in your area"       │
│     → Link to job details                   │
│                                             │
│  2. NEW BID SUBMITTED                       │
│     → Email job poster                      │
│     → Subject: "New bid on your job"        │
│     → Show bid amount                       │
│                                             │
│  3. BID ACCEPTED                            │
│     → Email winner                          │
│     → Subject: "You won the job!"           │
│     → Include full address                  │
│                                             │
│  4. BID REJECTED (Job filled)               │
│     → Email other bidders                   │
│     → Subject: "Job filled"                 │
│     → Encourage them to bid on others       │
│                                             │
│  5. FIXER VERIFIED                          │
│     → Email fixer                           │
│     → Subject: "Account approved!"          │
│     → Link to browse jobs                   │
│                                             │
│  6. WELCOME EMAIL                           │
│     → Email on signup                       │
│     → Different for broker vs fixer         │
│     → Next steps                            │
│                                             │
└─────────────────────────────────────────────┘
```

**Service:** Resend (recommended) or SendGrid

---

## 💾 DATABASE SCHEMA

```
FIRESTORE STRUCTURE
│
├── users/
│   └── {userId}
│       ├── email: string
│       ├── name: string
│       ├── role: 'broker' | 'fixer'
│       ├── isVerified: boolean
│       ├── avatar?: string
│       ├── bio?: string
│       ├── rating?: number
│       └── reviewCount?: number
│
├── jobs/
│   └── {jobId}
│       ├── brokerId: string
│       ├── brokerName: string
│       ├── title: string
│       ├── description: string
│       ├── category: string
│       ├── photos: string[]
│       ├── zipCode: string
│       ├── privateAddress: string
│       ├── startingPrice: number | null
│       ├── isPrivate: boolean
│       ├── invitedFixers: string[]
│       ├── status: JobStatus
│       ├── winnerId?: string
│       ├── winningBidAmount?: number
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── bids/
│   └── {bidId}
│       ├── jobId: string
│       ├── fixerId: string
│       ├── fixerName: string
│       ├── fixerRating?: number
│       ├── amount: number
│       ├── message: string
│       ├── status: 'pending' | 'accepted' | 'rejected'
│       └── createdAt: timestamp
│
├── reviews/ (Future)
│   └── {reviewId}
│       ├── jobId: string
│       ├── brokerId: string
│       ├── fixerId: string
│       ├── rating: 1-5
│       ├── review: string
│       └── createdAt: timestamp
│
└── notifications/ (Future)
    └── {notificationId}
        ├── userId: string
        ├── type: string
        ├── title: string
        ├── message: string
        ├── link: string
        ├── read: boolean
        └── createdAt: timestamp
```

---

## 🎨 UI COMPONENTS NEEDED

### Already Built (Need Data Connection):
- ✅ JobCard - Display job in list
- ✅ LiveBidBoard - Show bids in real-time
- ✅ CreateJobForm - Post new job
- ✅ CreateBidForm - Submit bid
- ✅ JobFeed - List of jobs

### Need to Build:
- ⬜ AuthGuard - Protect routes
- ⬜ PhotoUploader - Upload multiple photos
- ⬜ BidComparison - Compare multiple bids
- ⬜ StatusBadge - Show job status
- ⬜ RatingStars - Display ratings
- ⬜ ReviewCard - Show reviews
- ⬜ NotificationBell - In-app notifications
- ⬜ UserAvatar - Profile pictures
- ⬜ JobStatusStepper - Progress indicator

---

## ⚡ REAL-TIME FEATURES

```
FIRESTORE SNAPSHOTS (Live Updates)

┌──────────────────────────────────┐
│  Job Feed                        │
│  • New jobs appear instantly     │
│  • No refresh needed             │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Bid Board                       │
│  • New bids show immediately     │
│  • All fixers see each other     │
│  • Creates urgency!              │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Job Status                      │
│  • Updates across all devices    │
│  • Broker and fixer stay synced  │
└──────────────────────────────────┘
```

**Implementation:**
```typescript
onSnapshot(query, (snapshot) => {
  // Auto-updates when data changes!
});
```

---

## 🔐 SECURITY RULES (TODO: Lock down later)

```javascript
// Current: Open (for development)
allow read, write: if true;

// Production: Strict
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    
    match /jobs/{jobId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.brokerId;
      allow delete: if request.auth.uid == resource.data.brokerId;
    }
    
    match /bids/{bidId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.fixerId;
    }
  }
}
```

---

## 📊 SUCCESS METRICS

```
Beta Testing KPIs

Users:
├── 10+ Brokers registered
├── 20+ Fixers registered
└── 5+ Admin-verified fixers

Jobs:
├── 15+ Jobs posted
├── 50+ Bids submitted
└── 5+ Jobs completed

Performance:
├── < 2s page load
├── < 500ms real-time update
└── 99% uptime

Quality:
├── 0 critical bugs
├── < 5 minor bugs
└── > 80% user satisfaction
```

---

## 🎯 MINIMUM VIABLE PRODUCT (MVP)

### Week 1 Deliverables:
```
✅ Email/Password Auth
✅ Post Jobs
✅ Upload Photos
✅ Browse Jobs
✅ Submit Bids
✅ Accept Bids
✅ Admin Verify Fixers
✅ Email Notifications
```

### What Can Wait:
```
❌ Payment Processing
❌ SMS Notifications
❌ Advanced Search
❌ Messaging
❌ Mobile App
❌ Rating System (v1)
❌ Reviews (v1)
```

---

**This is your roadmap. Follow it and you'll have a working beta in 1 week!** 🚀
