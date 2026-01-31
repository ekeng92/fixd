# Fix'D - Reverse Auction Marketplace for Home Repairs

A modern platform connecting homeowners with trusted handymen through real-time competitive bidding.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Firebase and email service credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📖 Documentation

All project documentation is located in the [`/docs`](/docs) folder:

- **[Getting Started Guide](docs/QUICK_START.md)** - Day-by-day implementation plan
- **[Master Plan](docs/MASTER_PLAN.md)** - Comprehensive feature breakdown and roadmap
- **[Feature Map](docs/FEATURE_MAP.md)** - Visual diagrams and user flows
- **[Implementation Checklist](docs/CHECKLIST.md)** - Track your progress
- **[One Page Summary](docs/ONE_PAGE_SUMMARY.md)** - Quick reference
- **[Documentation Index](docs/README_DOCS.md)** - How to use all the docs

## 🎯 Current Status

**Phase:** Local Development Beta (Week 1)  
**Focus:** Building core MVP functionality with email/password authentication

### What Works:
- ✅ Beautiful UI/UX design
- ✅ Firebase infrastructure
- ✅ Type system and routing

### In Progress:
- 🔨 Email/password authentication
- 🔨 Real job posting with photo upload
- 🔨 Bidding system
- 🔨 Admin verification

## 🏗️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Firebase (Firestore, Storage, Auth), Next.js Server Actions
- **Notifications:** Email (Resend) - SMS (Twilio) coming later
- **Deployment:** Local development (Vercel-ready)

## 📂 Project Structure

```
fixd/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── broker/            # Broker (homeowner) pages
│   ├── fixer/             # Fixer (handyman) pages
│   ├── admin/             # Admin pages
│   └── login/             # Authentication pages
├── actions/               # Server actions
├── components/            # React components
├── lib/                   # Utilities and helpers
├── types/                 # TypeScript type definitions
└── docs/                  # 📚 All documentation
```

## 🎨 Features

### For Homeowners (Brokers)
- Post jobs with photos and details
- Choose fixed price or "open to offers"
- Receive real-time bids from verified handymen
- Compare bids and accept the best offer
- Track job progress

### For Handymen (Fixers)
- Browse available jobs in real-time
- Submit competitive bids
- See other bids (reverse auction model)
- Build reputation through ratings
- Get paid for completed work

### For Admins
- Verify handyman credentials
- Manage platform users
- Monitor job activity

## 🔐 Environment Variables

Required variables in `.env.local`:

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

# Email Service
RESEND_API_KEY=
```

## 🧪 Development Workflow

1. **Read the docs** - Start with [Quick Start Guide](docs/QUICK_START.md)
2. **Follow the plan** - Use [Checklist](docs/CHECKLIST.md) to track progress
3. **Test as you build** - Manual testing after each feature
4. **Commit often** - Clear, descriptive commit messages
5. **Reference as needed** - Consult other docs when stuck

## 📊 Project Goals

### Week 1 (Current)
- Complete MVP with core functionality
- Email/password authentication
- Job posting and bidding
- Admin verification
- Email notifications

### Week 2
- Enhanced features (search, filters, profiles)
- Job editing
- Better error handling

### Week 3
- Beta testing with real users
- Bug fixes and refinement
- Performance optimization

## 🤝 Contributing

This is currently a solo development project. For questions or issues, refer to the documentation in `/docs`.

## 📄 License

Proprietary - All rights reserved

## 🆘 Need Help?

1. Check [Documentation Index](docs/README_DOCS.md) for the right guide
2. Review [Feature Map](docs/FEATURE_MAP.md) for architecture
3. Consult [Master Plan](docs/MASTER_PLAN.md) for detailed requirements
4. Use [Quick Start Guide](docs/QUICK_START.md) for code snippets

---

**Built with ❤️ for homeowners and handymen everywhere**
