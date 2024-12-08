"use client";


import Link from "next/link";
import { auth, db } from '@/lib/firebase';
import { getClubFromFirestore, getUserFromFirestore, deleteClubFromFirestore, getClubsFromFirestore, getAllDiscussions } from "@/lib/firestore";
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
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";


interface UserProgress {
  clubId: string;
  progress: number;
  bookId: string;
}


interface User {
  avatarURL: string;
  bio: string;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "moderator";
  username: string;
  clubsJoined: string[];
  progress: UserProgress[];
}


interface Message {
  author: string;
  content: string[];
  timestamp: string;
  reactions: Record<string, { count: number; users: Record<string, boolean> }>;
}

type Discussion = {
    discussionId: string;
    title: string;
    author: string;
    authorAvatar?: string;
    createdAt: string; // ISO string
    downVotes: number;
    messages: Record<string, Message>;
    clubId?: string;
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


interface Meeting {
  id: string;
  title: string;
  club: string;
  date: string;
}


export const AdminDashboardPage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state for user data
  const [userCount, setUserCount] = useState<number>(0);
  const [clubCount, setClubCount] = useState<number>(0);
  const [discussionCount, setDiscussionCount] = useState<number>(0);
  const [meetingsCount, setMeetingsCount] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserFromFirestore(auth.currentUser!.uid);
        setUserData(user);

        const fetchedClubs = await getClubsFromFirestore();
        setClubs(fetchedClubs);

        const fetchedDiscussions = await getAllDiscussions();
        const flattenedDiscussions: Discussion[] = fetchedDiscussions.flatMap(record => Object.values(record));
        setDiscussions(flattenedDiscussions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };


    const getUserCount = async () => {
      try {
        const userRef = collection(db, "users");
        const snapshot = await getDocs(userRef);  
        const userCount = snapshot.size;          
        console.log("User Count:", userCount);    
        setUserCount(userCount);                  
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };


    const getClubCount = async () => {
      try {
        const clubRef = collection(db, "clubs");
        const snapshot = await getDocs(clubRef);  
        const clubCount = snapshot.size;          
        setClubCount(clubCount);                  
      } catch (error) {
        console.error("Error fetching club count:", error);
      }
    };


    const getMessageCount = async () => {
      try {
        const messageRef = collection(db, "messages");
        const snapshot = await getDocs(messageRef);
        const messageCount = snapshot.size;
        setDiscussionCount(messageCount); // Assuming you want to display message count as discussion count
      } catch (error) {
        console.error("Error fetching message count:", error);
      }
    };


    const getDiscussionCount = async () => {
      try {
        const discussionRef = collection(db, "discussions");
        const snapshot = await getDocs(discussionRef);
        const discussionCount = snapshot.size;
        setDiscussionCount(discussionCount);
      } catch (error) {
        console.error("Error fetching discussion count:", error);
      }
    };

    getMessageCount()
    getDiscussionCount();
    getClubCount();
    getUserCount();
    fetchUserData();
  }, []);


  // Helper Functions
  const getClubsCount = () => userData?.clubsJoined.length || 0;
  const getBooksInProgressCount = () => userData?.progress.filter(book => book.progress > 0).length || 0;


  const handleDeleteClub = async (clubId: string) => {
    try {
      await deleteClubFromFirestore(clubId);  
      setClubs(clubs.filter(club => club.clubId !== clubId)); // Update UI after deleting the club
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  };

  const handleCreateClub = () => {
    router.push("/create-club");
  }


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
                    You haven't joined any clubs yet.
                  </div>
                ) : (
                  clubs.map((club) => (
                    <Card key={club.clubId} className="bg-[#E6D8B5] border-[#8B4513]">
                      <CardHeader>
                        <CardTitle className="text-[#8B4513]">
                          {club.name}
                        </CardTitle>
                        <CardDescription className="text-[#A0522D]">
                          Currently reading: {club.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#A0522D]">
                          <Users className="inline mr-2" /> {club.moderators.length} moderators
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link
                          href={{
                            pathname: "/club-page",
                            query: { clubId: club.clubId },
                          }}
                        >
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
                    discussions.map((discussion) => (
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
                          </div>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>


        {/* Analytics Section */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold text-[#8B4513] mb-4">
            Analytics
          </h3>
          <Card className="bg-[#E6D8B5] border-[#8B4513]">
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              <div className="flex flex-col items-center text-[#8B4513]">
                <h4 className="text-lg font-semibold">Total Clubs</h4>
                <p className="text-2xl">{clubCount}</p>
              </div>
              <div className="flex flex-col items-center text-[#8B4513]">
                <h4 className="text-lg font-semibold">Total Users</h4>
                <p className="text-2xl">{userCount}</p>
              </div>
              <div className="flex flex-col items-center text-[#8B4513]">
                <h4 className="text-lg font-semibold">Upcoming Meetings</h4>
                <p className="text-2xl">{meetingsCount}</p>
              </div>
              <div className="flex flex-col items-center text-[#8B4513]">
                <h4 className="text-lg font-semibold">Active Discussions</h4>
                <p className="text-2xl">{discussionCount}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};





