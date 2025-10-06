'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
// Import the singleton auth instance directly.
import { auth } from '@/firebase';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The auth object is stable and imported directly.
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // The dependency array is now empty because 'auth' is a stable module import.

  // We still return the auth object for convenience in components.
  return { user, auth, loading };
}
