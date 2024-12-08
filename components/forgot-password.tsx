"use client";

/* Eslint Disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { auth, db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, User, AlertCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordReset = async (email: string) => {
    return await sendPasswordResetEmail(auth, email);
  };

  const checkEmailExists = async (email: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
  
    return !querySnapshot.empty;
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!email) {
      setError('Please enter your email');
      return;
    }
  
    setLoading(true);
    try {
      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        throw new Error('User not found');
      }
  
      await passwordReset(email);
      setEmailMessage(true);
      toast.success('Email sent. Check your inbox!');
    } catch (error) {
      setError('An error occurred. Please try again.');
      toast.error('User not found');
      console.error(error);
      setEmail('');
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
          Reset Your Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#E6D8B5] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-[#8B4513]">
                Email
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <User className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-[#A0522D] pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@email.com"
                  className="pl-10 block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
              className={`w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-white ${loading ? 'bg-gray-400' : 'bg-[#8B4513] hover:bg-[#A0522D]'}`}
            >
              {loading ? 'Checking Email...' : 'Reset Password'}
            </Button>
          </form>

          <div className="flex items-center justify-between">
            <div className="text-md">
              <Link href="/sign-in" className="font-medium text-[#8B4513] hover:text-[#A0522D]">
                Return to Log In
              </Link>
            </div>

            <div className="text-md">
              <Link href="/sign-up" className="font-medium text-[#8B4513] hover:text-[#A0522D]">
                Not a member? Sign up here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};