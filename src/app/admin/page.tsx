'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRoot() {
  const router = useRouter();

  useEffect(() => {
    // Check if authenticated
    const token = localStorage.getItem('adminAuth');
    
    if (token) {
      // Verify token is still valid
      fetch('/api/admin/auth', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) {
          router.push('/admin/dashboard');
        } else {
          localStorage.removeItem('adminAuth');
          router.push('/admin/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('adminAuth');
        router.push('/admin/login');
      });
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Kontrollerar behörighet...</p>
      </div>
    </div>
  );
}