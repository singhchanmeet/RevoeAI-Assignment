// app/signup/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '../../components/auth/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');

    if (token && expiry && new Date(expiry) > new Date()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12">
      <SignupForm />
    </div>
  );
}

