# 🎯 Quick Reference: Environment Variables Template

Copy this to your `.env.local` file and fill in your actual values.

```env
# ===========================
# FIREBASE CLIENT (Frontend)
# ===========================
# From Firebase Console → Project Settings → General → Your apps → Web app config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# ===========================
# FIREBASE ADMIN (Server-side)
# ===========================
# From Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=""

# ===========================
# TWILIO (SMS)
# ===========================
# From Twilio Console → Dashboard
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_VERIFY_SERVICE_SID=

# ===========================
# SESSION & SECURITY
# ===========================
# Generate with: openssl rand -base64 32
SESSION_SECRET=

# ===========================
# ADMIN ACCESS
# ===========================
ADMIN_PASSWORD=

# ===========================
# APP CONFIGURATION
# ===========================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔍 Where to Find Each Value

### Firebase Client Values
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click ⚙️ → Project Settings
4. Scroll to "Your apps" section
5. If no web app exists, click "Add app" → Web
6. Copy all values from the config object

### Firebase Admin Values
1. Same project, go to Project Settings
2. Click "Service Accounts" tab
3. Click "Generate new private key"
4. Download JSON file
5. Extract: `project_id`, `client_email`, `private_key`

### Twilio Values
1. Go to https://console.twilio.com/
2. Dashboard shows: Account SID, Auth Token
3. Phone Numbers → Manage → Buy a number (or use trial number)
4. Verify → Services → Create new service → Copy Service SID

### Generate SESSION_SECRET
```bash
openssl rand -base64 32
```

### ADMIN_PASSWORD
Choose any secure password (e.g., "FixD2026Secure!!")

---

## ✅ Validation Checklist

Before proceeding, verify:

- [ ] All `NEXT_PUBLIC_FIREBASE_*` values filled (6 values)
- [ ] All `FIREBASE_ADMIN_*` values filled (3 values)
- [ ] All `TWILIO_*` values filled (4 values)
- [ ] `SESSION_SECRET` is 32+ characters
- [ ] `ADMIN_PASSWORD` is secure
- [ ] `NEXT_PUBLIC_APP_URL` points to localhost:3000
- [ ] No quotes around values (except `FIREBASE_ADMIN_PRIVATE_KEY`)
- [ ] File is saved as `.env.local` in project root

---

## 🚨 Common Mistakes

❌ **Wrong:** `FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...`  
✅ **Right:** `FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."`

❌ **Wrong:** Phone number without country code: `4155551234`  
✅ **Right:** With country code: `+14155551234`

❌ **Wrong:** File named `.env` or `env.local`  
✅ **Right:** File named `.env.local`

❌ **Wrong:** Spaces around `=` sign: `API_KEY = value`  
✅ **Right:** No spaces: `API_KEY=value`

---

## 📞 Ready to Build?

Once your `.env.local` is complete, reply with:

**"✅ Setup complete, start building!"**

And I'll implement the entire Fix'D marketplace! 🚀
