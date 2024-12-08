"use client";

/* Eslint Disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* esling-disable @typescript-eslint/no-wrapper-object-types */

import Link from "next/link";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, TrendingUp, Search, BookmarkPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getBooksFromFirestore } from "@/lib/firestore";
import { Label } from "@/components/ui/label";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export const LandingPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<object[]>([]);

  const fetchBooks = async () => {
    const books = await getBooksFromFirestore();
    setBooks(books);
  };
  fetchBooks();
  const [avatarURL, setAvatarURL] = useState("");
  const [username, setUsername] = useState("");

  const routeToProfile = () => {
    router.push("/profile-page");
  };

  const getUserData = async () => {
    if (!user) return;

    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      const data = userSnap.data();
      // Get avatar URL
      if (data.avatarURL) { setAvatarURL(data.avatarURL); }
      else { setAvatarURL(""); }
      // Get username
      if (data.username) { setUsername(data.username); }
      else { setUsername(""); }
    }
  };
  getUserData();

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC] px-4 md:px-8 lg:px-16 mx-auto">
      <header className="fixed top-0 w-full bg-[#F5F5DC]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F5F5DC]/60 z-50 border-b border-[#8B4513]">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8 lg:px-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-[#8B4513]" />
            <span className="font-serif font-bold text-xl text-[#8B4513]">LitCircle</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-l font-medium">
            <Link href="/" className="text-[#8B4513] transition-colors hover:text-[#A0522D]">Home</Link>
            <Link href="#features" className="text-[#8B4513] transition-colors hover:text-[#A0522D]">Features</Link>
            <Link href="#books" className="text-[#8B4513] transition-colors hover:text-[#A0522D]">Books</Link>
            <Link href="#about" className="text-[#8B4513] transition-colors hover:text-[#A0522D]">About</Link>
            <Link href="#contact" className="text-[#8B4513] transition-colors hover:text-[#A0522D]">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
            <>
              <Link href="/dashboard">
                <Button className="bg-[#8B4513] text-[#F5F5DC] hover:bg-[#A0522D]">Go To Dashboard</Button>
              </Link>
              <Button
                className="ml-4 w-10 h-10 rounded-full flex items-center justify-center"
                onClick={routeToProfile}
              >
                <Avatar className="h-11 w-11">
                  <AvatarImage src={avatarURL} />
                  <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#F5F5DC]">Login</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-[#8B4513] text-[#F5F5DC] hover:bg-[#A0522D]">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow mx-auto px-4 md:px-8 lg:px-16">
        <section className="relative pt-20 md:pt-24 lg:pt-32">
          <div className="container flex flex-col items-center text-center space-y-4 py-16 md:py-24 lg:py-32">
            <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-[#8B4513]">
              Welcome to LitCircle
            </h1>
            <p className="mx-auto max-w-[700px] text-[#A0522D] md:text-xl">
              Join virtual book clubs, engage in discussions, and track your reading progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#8B4513] text-[#F5F5DC] hover:bg-[#A0522D]">View Clubs</Button>
              <Button size="lg" variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#F5F5DC]">Browse Discussions</Button>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 h-full w-full bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
        </section>
        <section id="about" className="py-12 md:py-16 lg:py-20 bg-[#E6D8B5]">
          <div className="container">
            <h2 className="font-serif text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-center mb-4 text-[#8B4513]">About LitCircle</h2>
            <p className="text-[#A0522D] text-center max-w-2xl mx-auto">
              LitCircle is a virtual book club platform that brings readers together from all around the world.
              Share your thoughts, discover new books, and connect with fellow book lovers in a vibrant online community.
            </p>
          </div>
        </section>
        <section id="features" className="py-12 md:py-16 lg:py-20 bg-[#F5F5DC]">
          <div className="container">
            <h2 className="font-serif text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-center mb-8 text-[#8B4513]">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-[#E6D8B5] rounded-lg shadow-md">
                <BookmarkPlus className="h-12 w-12 mb-4 text-[#8B4513]" />
                <h3 className="text-xl font-bold mb-2 text-[#8B4513]">Book Club Creation</h3>
                <p className="text-[#A0522D]">Start your own book club or join existing ones based on your interests.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-[#E6D8B5] rounded-lg shadow-md">
                <MessageCircle className="h-12 w-12 mb-4 text-[#8B4513]" />
                <h3 className="text-xl font-bold mb-2 text-[#8B4513]">Real-Time Discussions</h3>
                <p className="text-[#A0522D]">Engage in lively discussions with fellow readers in real-time chat rooms.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-[#E6D8B5] rounded-lg shadow-md">
                <TrendingUp className="h-12 w-12 mb-4 text-[#8B4513]" />
                <h3 className="text-xl font-bold mb-2 text-[#8B4513]">Reading Progress Tracking</h3>
                <p className="text-[#A0522D]">Keep track of your reading goals and share your progress with your club.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="books" className="py-12 md:py-16 lg:py-20 bg-[#E6D8B5]">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-serif text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-8 text-[#8B4513]">Discover Your Next Read</h2>
            <Carousel className="w-full max-w-xs">
              <CarouselContent>
                {Array.from({ length: books.length }).map((_, index) => (
                  <CarouselItem key={index}>
                      <Card className="border-[#8B4513]">
                        <CardContent className="flex flex-col justify-between bg-[#E6D8B5]">
                          <div>
                            <Label className="text-[#8B4513] text-2xl font-bold">{books[index].title}<br/></Label>
                            <Label className="text-[#8B4513] text-xl font-bold">by </Label>
                            <Label className="text-[#8B4513] text-2xl font-bold">{books[index].author}<br/></Label>
                          </div>
                          <img src={books[index].photoURL} height="150px"/>
                        </CardContent>
                      </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      </main>
      <footer className="border-t border-[#8B4513] bg-[#F5F5DC]">
        <section id="contact">
          <div className="container flex flex-col md:flex-row justify-between items-center py-8 space-y-4 md:space-y-0 px-4 md:px-8 lg:px-16">
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-[#8B4513] hover:text-[#A0522D]">
                Facebook
              </Link>
              <Link href="#" className="text-[#8B4513] hover:text-[#A0522D]">
                Twitter
              </Link>
              <Link href="#" className="text-[#8B4513] hover:text-[#A0522D]">
                Instagram
              </Link>
            </div>
            <div className="text-center md:text-right">
              <p className="text-m text-[#8B4513]">© 2024 LitCircle. All rights reserved.</p>
            </div>
          </div>
        </section>
      </footer>
    </div>
  );
};