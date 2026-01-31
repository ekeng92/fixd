# GitHub Copilot Instructions for Fix'D

> **Note:** Keep this file under 500 lines for efficient AI processing.

## Project Overview
**Fix'D** is a reverse auction marketplace connecting homeowners (brokers) with handymen (fixers) for home repair jobs. Fixers can see competing bids to create competitive pricing.

---

## Tech Stack
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Firebase (Firestore, Storage, Auth), Next.js Server Actions
- **Auth:** Email/Password (beta) → Phone/SMS (production)
- **Notifications:** Email (Resend) → SMS (Twilio later)
- **Session:** Iron Session

---

## User Roles

### Broker (Homeowner)
- Posts jobs with photos and details
- Reviews bids in real-time
- Accepts winning bid
- Manages job lifecycle

### Fixer (Handyman)
- **Must be admin-verified** before accessing jobs
- Browses available jobs
- Submits competitive bids (can see other bids)
- Completes accepted jobs

### Admin
- Verifies fixer credentials
- Special permissions for platform management

---

## Core Architecture Rules

### File Organization (CRITICAL)
```
/actions/        → Server actions ('use server')
/app/            → Next.js App Router pages
/components/     → Reusable React components
/lib/            → Utilities and helpers
/types/          → TypeScript interfaces (centralized)
/docs/           → ALL DOCUMENTATION (never in root!)
/.github/        → GitHub config (including this file)
```

**DOCUMENTATION RULE:** All project documentation, planning docs, guides, and markdown files MUST go in `/docs/` folder. NEVER create .md files in project root except README.md.

### Database Schema

#### Users
```typescript
{
  id: string;           // Firestore doc ID
  uid: string;          // Firebase Auth UID
  email: string;        // User email
  role: 'broker' | 'fixer';
  name: string;
  isVerified: boolean;  // Fixers only
  createdAt: Timestamp;
}
```

#### Jobs
```typescript
{
  id: string;
  brokerId: string;
  title: string;
  description: string;
  photos: string[];              // Storage URLs
  zipCode: string;
  privateAddress: string;        // Hidden until bid accepted
  startingPrice: number | null;  // null = "Open to offers"
  isPrivate: boolean;
  invitedFixers: string[];       // For private jobs
  status: 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  winnerId?: string;
  winningBidAmount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Bids
```typescript
{
  id: string;
  jobId: string;
  fixerId: string;
  fixerName: string;
  amount: number;
  message: string;
  createdAt: Timestamp;
}
```

---

## Code Patterns

### Authentication
```typescript
// ALWAYS use the auth hook
import { useAuth } from '@/lib/AuthContext';

const { user, isAuthenticated, isLoading } = useAuth();

// Never hardcode user IDs
const userId = user?.id; // ✅ Correct
const userId = 'user-123'; // ❌ Wrong
```

### Real-time Firestore (PREFERRED)
```typescript
useEffect(() => {
  const q = query(collection(db, 'jobs'), where('status', '==', 'open'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setJobs(data);
  });
  
  return () => unsubscribe(); // ALWAYS cleanup!
}, []);
```

### Server Actions
```typescript
'use server';

export async function actionName(
  userId: string,
  data: InputType
): Promise<{ success: boolean; data?: DataType; error?: string }> {
  try {
    // Validate inputs
    if (!data.required) {
      return { success: false, error: 'Field required' };
    }
    
    // Perform operation
    const result = await operation();
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

### React Components
```typescript
export default function ComponentName() {
  // Hooks at top
  const { user } = useAuth();
  const [state, setState] = useState();
  
  useEffect(() => {
    // Setup with cleanup
    return () => cleanup();
  }, [deps]);
  
  // Early returns for states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  if (!data) return <EmptyState />;
  
  // Main render
  return <div>...</div>;
}
```

---

## Key Business Rules

### Budget Handling
- `startingPrice: number` = Fixed price (fixers bid at/below)
- `startingPrice: null` = "Open to offers" (fixers suggest price)
- Always validate: if not null, must be > 0

### Job Status Lifecycle
```
open → accepted → in_progress → completed
  ↓
cancelled (from open or accepted only)
```

### Private Jobs
- `isPrivate: true` + `invitedFixers: [ids]`
- Only invited fixers can see/bid
- Used for trusted contractors

### Photo Upload
- Max 5 photos per job
- Upload to Firebase Storage first
- Store download URLs in job doc
- Delete from Storage if job creation fails

### Reverse Auction
- Fixers see all bids on a job
- Creates competitive pricing
- Encourages lower bids
- Winner gets full address

---

## Naming Conventions
- **Components:** PascalCase (`JobCard.tsx`, `LiveBidBoard.tsx`)
- **Files:** camelCase (`jobActions.ts`, `auth.ts`)
- **Functions:** camelCase (`createJob`, `submitBid`)
- **Types:** PascalCase (`Job`, `Bid`, `User`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_PHOTOS`)

---

## Error Handling

### Client-Side
```typescript
try {
  const result = await serverAction(data);
  if (result.success) {
    toast.success('Success!');
  } else {
    toast.error(result.error || 'Failed');
  }
} catch (error) {
  toast.error('Unexpected error');
  console.error(error);
}
```

### Server-Side
```typescript
try {
  // operation
} catch (error) {
  console.error('Context:', error);
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Unknown error' 
  };
}
```

---

## UI/UX Patterns

### Loading States
```typescript
if (isLoading) {
  return <div className="animate-pulse">Loading...</div>;
}
```

### Empty States
```typescript
if (items.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">No items found</p>
      <button>Create First Item</button>
    </div>
  );
}
```

### Notifications
```typescript
import toast from 'react-hot-toast';

toast.success('Action completed!');
toast.error('Action failed');
toast.loading('Processing...');
```

---

## Security Guidelines

### Client-Side
- Never trust client input
- Validate on server
- No sensitive data in client code
- Use environment variables

### Server-Side
- Validate all inputs
- Check user permissions
- Use Firebase Security Rules
- Sanitize user content

### Firebase Rules (Development)
```javascript
// Open for development
allow read, write: if true;

// Lock down for production!
```

---

## Testing Checklist

### Manual Testing
- ✅ Happy path works
- ✅ Error cases handled
- ✅ Edge cases (null, empty)
- ✅ Mobile responsive
- ✅ Real-time updates work

### User Flows
1. **Broker:** Sign up → Post job → Accept bid → Complete
2. **Fixer:** Sign up → Verify → Browse → Bid → Win
3. **Admin:** Verify fixer

---

## Common Patterns

### Get Current User
```typescript
const { user, isAuthenticated } = useAuth();
if (!isAuthenticated) router.push('/login');
```

### Query Jobs
```typescript
const q = query(
  collection(db, 'jobs'),
  where('status', '==', 'open'),
  where('brokerId', '==', userId)
);
```

### Upload Photos
```typescript
// Upload to Storage first
const urls = await uploadJobPhotos(files);
// Then save URLs to Firestore
```

---

## Development Phase

**Current:** Week 1 - MVP Development

**Focus:**
- Email/password authentication
- Job posting with photos
- Real-time bidding
- Admin verification
- Email notifications

**Keep it simple!** Build features that work, then refine.

---

## Documentation Rules

### Where Docs Go
- **ALL documentation:** `/docs/` folder
- **Never:** Create .md files in project root (except README.md)
- **Planning docs:** `/docs/MASTER_PLAN.md`, etc.
- **Guides:** `/docs/QUICK_START.md`, etc.
- **References:** `/docs/FEATURE_MAP.md`, etc.

### When to Update Docs
- New architectural decisions → Update `/docs/MASTER_PLAN.md`
- New patterns → Update this file or relevant doc
- Feature complete → Update `/docs/IMPLEMENTATION_SUMMARY.md`
- Breaking changes → Document in relevant guides

### Creating New Docs
1. Create in `/docs/` folder
2. Add link to `/docs/README.md`
3. Use clear markdown formatting
4. Include code examples

---

## Quick Reference

### Key Files
- Auth: `/lib/AuthContext.tsx`
- Types: `/types/index.ts`
- Firebase: `/lib/firebase.js`
- Actions: `/actions/jobActions.ts`, `/actions/userActions.ts`

### Environment Variables
- Firebase config (NEXT_PUBLIC_*)
- Firebase Admin (server-side)
- Session secret
- Email API key (Resend)

### Commands
```bash
npm run dev    # Start dev server
npm run build  # Build for production
```

---

## When in Doubt

1. Check `/docs/MASTER_PLAN.md` for architecture
2. Review `/types/index.ts` for data structures
3. Look at similar existing code
4. Follow patterns above
5. **Keep it simple**

---

**Last Updated:** January 30, 2026  
**Lines:** ~400 (Keep under 500!)  
**Phase:** Week 1 MVP

*Update this file when introducing new patterns or architectural decisions.*
