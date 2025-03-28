// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If token expired, handle it globally
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  return response;
}