"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { addUserToFirestore } from "@/lib/firestore";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, User, Mail, Lock, AlertCircle } from "lucide-react";

export const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });  
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Sign up the user using Firebase Authentication
      const authCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const uid = authCredential.user.uid;

      // Add user data to Firestore
      await addUserToFirestore(uid, {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "user",
        bio: "",
        avatarURL: "",
        createdAt: new Date().toISOString(),
        clubsJoined: [],
        progress: [],
      });      

      toast.success("Signed up successfully.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-up error:", error);
      setError("Failed to sign up. Please try again.");
      toast.error("An error occurred. Please try again.");
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
          Create your LitCircle account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#E6D8B5] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
              <Label htmlFor="firstname" className="block text-sm font-medium text-[#8B4513]">
                First Name
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <User className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-[#A0522D] pointer-events-none" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="pl-10 block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lastname" className="block text-sm font-medium text-[#8B4513]">
                Last Name
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <User className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-[#A0522D] pointer-events-none" />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="pl-10 block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-[#8B4513]">
                Username
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <User className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-[#A0522D] pointer-events-none" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="pl-10 block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-[#8B4513]">
                Email address
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Mail className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-[#A0522D] pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-[#8B4513]">
                Password
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Lock className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-[#A0522D] pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-2">
                <Label className="text-sm text-[#8B4513]">Password Strength</Label>
                <Progress value={passwordStrength} className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-[#8B4513]">
                Confirm Password
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Lock className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-[#A0522D] pointer-events-none" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="pl-10 block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                  value={formData.confirmPassword}
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
              className={`w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-white ${loading ? "bg-gray-400" : "bg-[#8B4513] hover:bg-[#A0522D]"}`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/sign-in" className="font-medium text-[#8B4513] hover:text-[#A0522D]">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};