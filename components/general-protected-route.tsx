"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ReactNode, useEffect, useState } from "react";
import { getUserFromFirestore } from "@/lib/firestore";

interface GeneralProtectedRouteProps {
  children: ReactNode;
}

export const GeneralProtectedRoute = ({
  children,
}: GeneralProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserFromFirestore(user.uid);

          if (!userData) {
            throw new Error("User data not found.");
          }

          setIsAuthorized(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAuthorized(false);
          router.push("/sign-in");
        }
      } else if (!loading) {
        setIsAuthorized(false);
        router.push("/sign-in");
      }
    };

    if (!loading) {
      checkAuthentication();
    }
  }, [user, loading, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};