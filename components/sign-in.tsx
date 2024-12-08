"use client";

/*
! Fixed: Route based on user role dynamically.
*/

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getUserFromFirestore} from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Lock, AlertCircle, Mail } from "lucide-react";

export const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }
  
    setLoading(true);
  
    try {
      const { email, password } = formData;

      // Sign in using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Fetch user data and role from Firestore
      const user = await getUserFromFirestore(userId);

      if (!user) {
        throw new Error("User data not found.");
      }

      console.log("User data:", user); // Debugging purposes

      const role = user.role;

      if (!role) {
        throw new Error("Role not found for the user.");
      }

      // Redirect based on user role
      toast.success("Logged in successfully!");

      if (role === "admin") {
        router.push("/admin-dashboard");
      } else if (role === "moderator") {
        router.push("/moderator-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("Failed to log in. Please check your credentials and try again.");
      toast.error("Error logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <BookOpen className="h-12 w-12 text-[#8B4513]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#8B4513]">
          Sign in to LitCircle
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#E6D8B5] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="block text-xl text-[#8B4513]">
                Email
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Mail className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-[#A0522D] pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 block w-full border-[#8B4513] rounded-md text-xl focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-xl text-[#8B4513]">
                Password
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Lock className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-[#A0522D] pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 block w-full border-[#8B4513] text-xl rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-xl text-white ${loading ? 'bg-gray-400' : 'bg-[#8B4513] hover:bg-[#A0522D]'}`}
            >
              {loading ? 'Signing In...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/sign-up" className="text-xl text-[#8B4513] hover:text-[#A0522D]">
              Not a member? Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};