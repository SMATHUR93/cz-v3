# Next.js CRUD App Setup Guide

## 1. Local Setup of Next.js Project

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)

### Step 1: Create a Next.js Project

Run the following command in your terminal:

```sh
npx create-next-app@latest my-next-crud-app --typescript
cd my-next-crud-app
```

### Step 2: Project Folder Structure

```plaintext
/my-next-crud-app
 ├── /src
 │   ├── /components      # UI Components (Forms, Tables)
 │   ├── /context         # React Context API (ProductContext, AuthContext)
 │   ├── /lib             # Firebase Config
 │   ├── /pages           # Next.js pages (_app.tsx, index.tsx, login.tsx, products.tsx)
 │   ├── /styles          # Global styles
 │   ├── /netlify         # Netlify Functions for Backend
 │   ├── /utils           # Utility functions (helpers, validators)
 ├── .env                 # Environment variables
 ├── package.json         # Dependencies
 ├── tsconfig.json        # TypeScript Configuration
 ├── firebase.json        # Firebase Functions Config
 ├── netlify.toml         # Netlify Config File
```

---

## 2. Install Required Libraries & APIs

Run the following command to install dependencies:

```sh
npm install firebase react-bootstrap bootstrap @types/react-bootstrap
npm install netlify-cli -g  # Install Netlify CLI globally
```

### Libraries Overview:

- **Firebase** - Authentication & Database
- **React-Bootstrap** - UI Styling
- **React Context** - Global State Management
- **Netlify Functions** - Serverless Backend

Modify `_app.tsx` to include Bootstrap CSS:

```tsx
import 'bootstrap/dist/css/bootstrap.min.css';
```

---

## 3. Setup Netlify & Firebase Accounts

### Step 1: Create & Configure Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create Project**, enter a name, and complete the setup.
3. In the Firebase Dashboard:
   - **Enable Firestore** (Database > Create Firestore Database)
   - **Enable Authentication** (Authentication > Sign-in method > Email/Password)
   - **Generate a Service Account Key** (Project Settings > Service Accounts > Generate Key) → Save as `firebase-service-account.json`

### Step 2: Configure Firebase in Next.js

Create `/src/lib/firebase.ts`:

```ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

Create `.env.local` and add Firebase credentials:

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 3: Setup Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Create a new project and link it to your GitHub repository.
3. Add **Environment Variables** in Netlify Dashboard (Under Site Settings > Environment):
   - `FIREBASE_SERVICE_ACCOUNT_KEY` → Paste the content of `firebase-service-account.json`

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = ".next"
```

---

## 4. Authentication & React Context Setup

### Step 1: Implement Authentication (AuthContext)

Create `/src/context/AuthContext.tsx`:

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
```

### Step 2: Firebase Service Account & Authentication Middleware

To ensure secure API requests, Netlify Functions use Firebase service account credentials.
- **Locally**, they load from `firebase-service-account.json`.
- **In production**, they use Netlify Environment Variables.

Additionally, requests are authenticated using `authMiddleware.ts`, which verifies the Firebase user token before allowing access.

Modify `/src/pages/_app.tsx` to include `AuthProvider`:

```tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import AuthProvider from '../context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
export default MyApp;
```

---

## 5. UI Overview

The application includes:
- **Login & Registration Pages** (Authenticate users)
- **Product CRUD Pages** (Add, edit, delete, and display products)
- **Logout Button** (Signs out user)

All UI components use **React-Bootstrap** for styling.

