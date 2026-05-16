# Firestore Setup Guide

## Issue: Permission Denied Error

You're seeing this error:
```
FirebaseError: [code=permission-denied]: Missing or insufficient permissions.
```

This happens because Firestore's default security rules deny all access. We need to apply custom rules.

---

## How to Fix

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com
2. Select your project: **crazy-guys-app**
3. Go to **Firestore Database** in the left sidebar

### Step 2: Access Security Rules
1. Click the **Rules** tab at the top
2. You'll see the current rules (likely very restrictive or default)

### Step 3: Replace with New Rules
Copy the rules from `firestore.rules` file in this repository and paste them into the Firebase Console Rules editor:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own apology status
    match /apologyStatus/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow authenticated users to read/write messages (shared chat)
    match /messages/{document=**} {
      allow read, write: if request.auth != null;
    }

    // Allow authenticated users to read/write their own rules/boundaries
    match /rules/{document=**} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         resource == null && request.auth.uid == request.resource.data.userId);
    }

    // Default deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 4: Publish Rules
1. Click the **Publish** button
2. Wait for the update to complete (usually ~1 second)

---

## What These Rules Do

✅ **apologyStatus**: Each user can only read/write their own apology status
✅ **messages**: All authenticated users can read and write messages (shared chat)
✅ **rules**: Each user can only read/write their own boundaries
✅ **Default**: Everything else is denied for security

---

## Verify the Fix

After applying the rules:
1. Reload your app in the browser
2. Try to access the Apology page or Chat
3. The error should be gone and data should load properly

If you still see errors, check:
- Browser console for details
- Make sure you're logged in with an approved email
- Verify your Firebase project ID is correct in `.env.local`

---

## Collections Used

The app creates these Firestore collections automatically:

- **apologyStatus** - Tracks if user has read the apology
- **messages** - Stores encrypted chat messages
- **rules** - Stores user-defined boundaries

They'll appear in your Firestore console once the app creates them.

---

## Need Help?

If rules still don't work:
1. Check Firebase Console → Firestore → Data for any existing data
2. Verify email addresses in `utils/constants.ts` match your Google login
3. Check browser DevTools Console for specific error messages
