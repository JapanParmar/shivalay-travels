'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from './lib/AdminAuthContext';
import { AdminAuthProvider } from './lib/AdminAuthContext';

function AdminRedirect() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? '/admin/dashboard' : '/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);
  return null;
}

export default function AdminRoot() {
  return (
    <AdminAuthProvider>
      <AdminRedirect />
    </AdminAuthProvider>
  );
}
