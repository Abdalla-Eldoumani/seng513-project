"use client";

/*
! TODO: Tweak the page so that it contains actual data from the database not just mock data.
! Also, this page would be different when the user is a regular user and when the user is an admin/manager.
*/

/* Eslint Disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { useState } from 'react'
import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Settings } from 'lucide-react'
import { useSearchParams,  } from 'next/navigation';
import Link from "next/link";
import { getClubFromFirestore } from '@/lib/firestore';
import { useRouter } from 'next/navigation';

interface Message {
  author: string;
  content: string[];
  timestamp: string; // ISO string
  reactions: Record<string, { count: number; users: Record<string, boolean> }>;
}

interface Discussion {
  discussionId: string;
  title: string;
  author: string;
  authorAvatar?: string;
  createdAt: string; // ISO string
  downVotes: number;
  messages: Record<string, Message>;
}

interface Moderator {
  name: string;
  avatar: string;
}

interface Club {
  clubId: string;
  name: string;
  bio: string;
  book: string;
  description: string;
  genre: string;
  isPublic: boolean;
  memberCount: number;
  onlineCount: number;
  rank: string;
  rules: string[];
  moderators: Moderator[];
  createdAt: string;
  createdBy: string;
  discussions: Record<string, Discussion>;
}


export const ClubPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clubId = searchParams.get('clubId');
  const userRole = searchParams.get('role');
  const [clubData, setClubData] = useState<Club | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state for user data
  const [discussionsData, setDiscussionsData] = useState<Discussion[]>([]);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        if (clubId) {
          const clubData = await getClubFromFirestore(clubId);
          setClubData(clubData);
          if (clubData?.discussions) {
            setDiscussionsData(Object.values(clubData.discussions));
          };
        }
      } catch (error) {
        console.error("Error fetching club data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClubData()
  }, [clubData]);

  if (loading) {
    return  <div className="flex items-center justify-center min-h-screen">
              <p>Loading...</p>
            </div>;
  }


  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <header className="bg-[#E6D8B5] border-b border-[#8B4513]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-[#8B4513]">LitCircle</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Only render the "Manage Club" button if the user is a moderator */}
            {userRole === 'moderator' && (
              <Link href={{
                  pathname: '/manage-club',
                  query: { clubId: clubId }
                }}
              >
                <Button variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#F5F5DC]">
                  <Settings className="mr-2 h-4 w-4" /> Manage Club
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#F5F5DC]"
            >
               <Link
                href={
                  userRole === 'admin'
                    ? '/admin-dashboard'
                    : userRole === 'moderator'
                    ? '/moderator-dashboard'
                    : '/dashboard'
                }
              >
                Go Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-[#8B4513]">{clubData?.name}</h2>
              <Badge variant="secondary" className="bg-[#8B4513] text-[#F5F5DC]">{clubData?.rank}</Badge>
            </div>
          </div>

          <Card className="bg-[#E6D8B5] border-[#8B4513] mb-4">
            <CardHeader>
              <CardTitle className="text-[#8B4513]">Club Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#A0522D]">{clubData?.bio}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#8B4513]">Moderators</h3>
            <div className="space-y-2">
              {clubData?.moderators.map((moderator, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start cursor-pointer hover:bg-[#F5F5DC] transition-colors px-2 py-1"
                >
                  <Avatar>
                    <AvatarImage src={moderator.avatar} alt={moderator.name} />
                    <AvatarFallback>{moderator.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-[#A0522D]">{moderator.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#8B4513]">Club Rules</h3>
            <ul className="space-y-2">
              {clubData?.rules.map((rule, index) => (
                <li key={index} className="text-[#A0522D]">- {rule}</li>
              ))}
            </ul>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-[#E6D8B5] border-b border-[#8B4513]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5F5DC]">Overview</TabsTrigger>
            <TabsTrigger value="discussions" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5F5DC]">Discussions</TabsTrigger>
            <TabsTrigger value="meetings" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5F5DC]">Meetings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className="bg-[#E6D8B5] border-[#8B4513]">
              <CardHeader>
                <CardTitle className="text-[#8B4513]">{clubData?.book}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#A0522D]">{clubData?.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Discussions Tab Content */}
          <TabsContent value="discussions">
              <h3 className="text-xl font-semibold text-[#8B4513] mb-4">New Discussions</h3>
              <Card className="bg-[#E6D8B5] border-[#8B4513]">
                <CardContent className="p-0">
                  <ul className="divide-y divide-[#8B4513]">
                    {discussionsData?.length === 0 ? (
                      <div className="w-full text-[#8B4513] font-semibold text-lg pl-4 py-4">
                        No discussions yet.
                      </div>
                    ) : (
                      discussionsData?.map((discussion) => (
                        <li
                          key={discussion.discussionId}
                          className="p-4 hover:bg-[#F5F5DC] transition-colors"
                        >
                          <Link
                            href={{
                              pathname: "/discussion-page",
                              query: { id: discussion.discussionId },
                            }}
                            className="block"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[#8B4513] font-medium">
                                {discussion.title}
                              </span>
                              <span className="text-[#A0522D] text-sm">
                                <MessageCircle className="inline mr-1" />{" "}
                                {Object.keys(discussion.messages).length} messages
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          <TabsContent value="meetings">
            {/* Meetings tab content */}
            <Card className="bg-[#E6D8B5] border-[#8B4513]">
              <CardHeader>
                <CardTitle className="text-[#8B4513]">Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#A0522D]">List upcoming meetings and events for the club here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}