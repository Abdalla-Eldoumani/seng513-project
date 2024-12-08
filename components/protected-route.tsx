"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ReactNode, useEffect, useState } from 'react';
import { getUserFromFirestore } from '@/lib/firestore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserFromFirestore(user.uid);

          if (!userData) {
            throw new Error("User data not found.");
          };
          
          setRole(userData.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
          router.push('/sign-in'); // Redirect if there's an error fetching the role
        }
      }
    };

    if (!loading && user) {
      fetchUserRole();
    } else if (!loading && !user) {
      router.push('/sign-in'); // Redirect if not authenticated
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (role && role === "admin") {
      // Redirect if user role is not admin and user
      router.push('/admin-dashboard');
    } else if (role && role === "moderator") {
      // Redirect if user role is not admin to moderator dashboard
      router.push('/moderator-dashboard');
    }
  }, [role, router]);

  // Display a loading message while checking auth status and role
  if (loading || !user || role === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Render the protected content if the user is authenticated and has the correct role (admin)
  return <>{children}</>;
};
