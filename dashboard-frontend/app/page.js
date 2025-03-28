// app/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../components/ui/button';

export default function Home() {
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center cyber-grid bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="max-w-md mx-auto floating glass-effect p-8 rounded-xl">
        <h1 className="text-4xl font-bold mb-4 neon-text">Welcome to Dashboard</h1>
        <p className="mb-8 text-gray-600">
          A powerful dashboard with Google Sheets integration to manage and visualize your data.
        </p>
        <div className="flex flex-col space-y-4">
          <Link href="/login">
            <Button className="w-full">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="w-full">Sign Up</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}