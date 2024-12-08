"use client";

/* Eslint Disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import Link from "next/link";
import { auth } from '@/lib/firebase';
import { getClubFromFirestore, getUserFromFirestore } from "@/lib/firestore";
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
import { useEffect, useState } from "react";
import User from "@/types/User";
import Club from "@/types/Club";
import Discussion from "@/types/Discussion";
import Meeting from "@/types/Meeting";


export const DashboardPage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [meetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state for user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserFromFirestore(auth.currentUser!.uid);
        setUserData(user);

        if (user && user.clubsJoined) {
          const userClubs = user.clubsJoined || [];
          const clubsData: Club[] = [];
          const allDiscussions: Discussion[] = []; 

          for (const clubId of userClubs) {
            const clubData = await getClubFromFirestore(clubId);
            if (clubData) clubsData.push(clubData);

            if (clubData?.discussions) {
              allDiscussions.push(...Object.values(clubData.discussions));
          }
          }

          setClubs(clubsData);  // Set the fetched clubs data
          setDiscussions(allDiscussions);

        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Helper Functions
  const getClubsCount = () => userData?.clubsJoined.length || 0;
  const getBooksInProgressCount = () => userData?.progress.filter(book => book.progress > 0).length || 0;

  if (loading) {
    return  <div className="flex items-center justify-center min-h-screen">
              <p>Loading...</p>
            </div>;
  }

  if (!userData) {
    return <div>Error: User data could not be loaded.</div>;
  }

  return (

    <div className="min-h-screen bg-[#F5F5DC]">
      <header className="bg-[#E6D8B5] border-b border-[#8B4513]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-[#8B4513]" />
            <h1 className="text-2xl font-bold text-[#8B4513]">LitCircle</h1>
          </Link>

          <Link href="/profile-page">
            <Button
              variant="outline"
              className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#F5F5DC]"
            >
              Manage Profile
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={userData?.avatarURL} alt={userData?.username} />
              <AvatarFallback>{userData?.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-[#8B4513]">
                Welcome back, {userData?.firstName}!
              </h2>
              <p className="text-[#A0522D]">
                You&apos;re currently in {getClubsCount()} clubs and reading{" "}
                {getBooksInProgressCount()} books.
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
                {clubs.length === 0 ? (
                  <div className="text-[#8B4513] font-semibold text-lg">
                    You havent joined any clubs yet.
                  </div>
                ) : (
                  clubs.map((club) => (
                    <Card key={club.clubId} className="bg-[#E6D8B5] border-[#8B4513]">
                      <CardHeader>
                        <CardTitle className="text-[#8B4513]">
                          {club.name}
                        </CardTitle>
                        <CardDescription className="text-[#A0522D]">
                          Currently reading: {club.name} {/* Assuming a `book` field for this */}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#A0522D]">
                          <Users className="inline mr-2" /> {club.moderators.length} moderators
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
                  ))
                )}
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
                  {discussions.length === 0 ? (
                    <div className="w-full text-[#8B4513] font-semibold text-lg pl-4 py-4">
                      No discussions yet.
                    </div>
                  ) : (
                    Object.entries(discussions).map(([discussionKey, discussion]) => (
                      <li
                        key={discussionKey}
                        className="p-4 hover:bg-[#F5F5DC] transition-colors"
                      >
                        <Link
                          href={`/discussion-page/0XVhVkjNfcNUlioYtkAl/${discussionKey}`} // Implement clubId fetch dynamically later
                          className="block"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[#8B4513] font-medium">
                              {discussion.title}
                            </span>
                            <span className="text-[#A0522D] text-sm">
                              <MessageCircle className="inline mr-1" />{" "}
                              {/* {discussion.messages.length} messages */}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/public-discussions">
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
                {meetings.length === 0 ? (
                  <div className="w-full text-[#8B4513] font-semibold text-lg pl-4 py-4">
                    No upcoming meetings.
                  </div>
                ) : (
                  meetings.map((meeting) => (
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
                          <Calendar className="inline mr-2" />
                          {new Date(meeting.date).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/all-meetings">
                <Button variant="link" className="w-full text-[#8B4513]">
                  View All Meetings
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
      </main>
    </div>
  );
};