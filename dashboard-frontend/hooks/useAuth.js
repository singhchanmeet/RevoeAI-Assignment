// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Check if token exists and has not expired
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const expiry = localStorage.getItem('tokenExpiry');

      if (!token || !expiry) {
        logout();
        return;
      }

      // Check if token has expired
      if (new Date(expiry) < new Date()) {
        logout();
        return;
      }

      // If token exists and is not expired, fetch user data
      fetchUser(token);
    };

    const fetchUser = async (token) => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up token expiry check
    const interval = setInterval(() => {
      const expiry = localStorage.getItem('tokenExpiry');
      if (expiry && new Date(expiry) < new Date()) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setUser(null);
    setLoading(false);
    router.push('/login');
  };

  return { user, loading, logout };
}
