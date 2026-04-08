import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

function mapFirebaseError(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Користувач з таким email вже існує.';
    case 'auth/invalid-email':
      return 'Некоректний формат email.';
    case 'auth/weak-password':
      return 'Пароль має містити щонайменше 6 символів.';
    case 'auth/user-not-found':
      return 'Користувача з таким email не знайдено.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Невірний email або пароль.';
    case 'auth/too-many-requests':
      return 'Забагато спроб входу. Спробуйте пізніше.';
    default:
      return 'Сталася помилка авторизації. Спробуйте ще раз.';
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      return { user: credentials.user, error: null };
    } catch (error) {
      return { user: null, error: mapFirebaseError(error.code) };
    }
  };

  const login = async (email, password) => {
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      return { user: credentials.user, error: null };
    } catch (error) {
      return { user: null, error: mapFirebaseError(error.code) };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: mapFirebaseError(error.code) };
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

