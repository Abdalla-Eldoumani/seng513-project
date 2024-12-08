"use client";

/*
! TODO: Tweak the page so that it contains actual data from the database not just mock data
     -> Begun under mock user definition, running into issues when calling userSnap.data()
*/

/* Eslint Disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* esling-disable @typescript-eslint/no-wrapper-object-types */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Users, MessageCircle, Calendar, Search } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for demonstration purposes
const user = {
  name: "Moderator",
  avatar: "/placeholder.svg?height=40&width=40",
  clubsCount: 3,
  booksInProgress: 2,
};

/*
 * const uid = auth.currentUser!.uid;
 * const userRef = doc(db, 'users', uid);
 * const userSnap = getDoc(userRef)
*/

const clubs = [
  {
    id: 1,
    name: "Classic Literature",
    book: "Pride and Prejudice",
    members: 15,
  },
  { id: 2, name: "Sci-Fi Enthusiasts", book: "Dune", members: 20 },
  {
    id: 3,
    name: "Mystery Lovers",
    book: "The Girl with the Dragon Tattoo",
    members: 12,
  },
];

interface Discussion {
  id: number;
  title: string;
  replies: number;
}

const discussions = [
  { id: 1, title: "Character development in Pride and Prejudice", replies: 24 },
  { id: 2, title: "Exploring the world-building in Dune", replies: 18 },
  { id: 3, title: "Plot twists in mystery novels", replies: 30 },
];

const meetings = [
  {
    id: 1,
    title: "Classic Lit Book Discussion",
    date: "2023-06-15T19:00:00",
    club: "Classic Literature",
  },
  {
    id: 2,
    title: "Sci-Fi Movie Night",
    date: "2023-06-18T20:00:00",
    club: "Sci-Fi Enthusiasts",
  },
  {
    id: 3,
    title: "Mystery Book Selection",
    date: "2023-06-20T18:30:00",
    club: "Mystery Lovers",
  },
];


export const ModeratorDashboardPage = () => {

  const router = useRouter();

  const handleCreateClub = () => {
    router.push("/create-club");
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <header className="bg-[#E6D8B5] border-b border-[#8B4513]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-[#8B4513]" />
            <h1 className="text-2xl font-bold text-[#8B4513]">LitCircle</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Button onClick={handleCreateClub} variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#F5F5DC]"> 
              Create Club 
            </Button>
            <Link href="/profile-page">
              <Button
                variant="outline"
                className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#F5F5DC]"
              >
                Manage Profile
              </Button>
            </Link>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-[#8B4513]">
                Welcome back, {user.name}!
              </h2>
              <p className="text-[#A0522D]">
                You&apos;re currently in {user.clubsCount} clubs and reading{" "}
                {user.booksInProgress} books.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-[#8B4513] mb-4">
                Your Clubs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clubs.map((club) => (
                  <Card key={club.id} className="bg-[#E6D8B5] border-[#8B4513]">
                    <CardHeader>
                      <CardTitle className="text-[#8B4513]">
                        {club.name}
                      </CardTitle>
                      <CardDescription className="text-[#A0522D]">
                        Currently reading: {club.book}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#A0522D]">
                        <Users className="inline mr-2" /> {club.members} members
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/club-page">
                      <Button
                        variant="outline"
                        className="w-full text-[#8B4513] border-[#8B4513] hover:bg-[#F5F5DC]"
                      >
                        Enter Club
                      </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/explore-clubs">
                <Button className="bg-[#8B4513] text-[#F5F5DC] hover:bg-[#A0522D]">
                  <Search className="mr-2 h-4 w-4" /> Explore More Clubs
                </Button>
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-[#8B4513] mb-4">
              New Discussions
            </h3>
            <Card className="bg-[#E6D8B5] border-[#8B4513]">
              <CardContent className="p-0">
                <ul className="divide-y divide-[#8B4513]">
                  {discussions.map((discussion) => (
                    <li
                      key={discussion.id}
                      className="p-4 hover:bg-[#F5F5DC] transition-colors"
                    >
                      <Link href={{
                        pathname: "/discussion-page",
                        query: { id: discussion.id }
                      }} className="block">
                        <div className="flex justify-between items-center">
                          <span className="text-[#8B4513] font-medium">
                            {discussion.title}
                          </span>
                          <span className="text-[#A0522D] text-sm">
                            <MessageCircle className="inline mr-1" />{" "}
                            {discussion.replies} replies
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/all-public-discussions">
                <Button variant="link" className="w-full text-[#8B4513]">
                  View All Discussions
                </Button>
                </Link>
              </CardFooter>
            </Card>
          </section>
        </div>

        <section className="mt-8">
          <h3 className="text-xl font-semibold text-[#8B4513] mb-4">
            Upcoming Meetings
          </h3>
          <Card className="bg-[#E6D8B5] border-[#8B4513]">
            <CardContent className="p-0">
              <ul className="divide-y divide-[#8B4513]">
                {meetings.map((meeting) => (
                  <li
                    key={meeting.id}
                    className="p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium text-[#8B4513]">
                        {meeting.title}
                      </h4>
                      <p className="text-sm text-[#A0522D]">{meeting.club}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#8B4513]">
                        <Calendar className="inline mr-1" />
                        {new Date(meeting.date).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};
