"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClubsFromFirestore, getUserFromFirestore, addUserToClub, addClubToUser } from "@/lib/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Users } from "lucide-react";
import Club from "../types/Club";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import User from "../types/User";
import toast from "react-hot-toast";

export const ExploreClubsPage = () => {
  
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [joiningClub, setJoiningClub] = useState<string | null>(null); // Track the club being joined

  // Fetch clubs from Firestore
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const fetchedClubs = await getClubsFromFirestore();
        setClubs(fetchedClubs); // Set the fetched clubs to state
        
        if (!user) {
          throw new Error("User not found.");
        }
        
        const userData = await getUserFromFirestore(user.uid);
        setUserData(userData);
      } catch (err) {
        console.error("Error fetching clubs:", err);
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return <div>Loading clubs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleJoinClub = async (clubId: string) => {
    if (!user) {
      return;
    }

    setJoiningClub(clubId);

    try {
      await addUserToClub(clubId, user.uid);
      await addClubToUser(clubId, user.uid);
      toast.success("Successfully joined club!");
    } catch (err) {
      console.error("Error joining club:", err);
    } finally {
      setJoiningClub(null);
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const searchMatch = club.name.toLowerCase().includes(searchTerm.toLowerCase());


    const matchesGenre =
      genreFilter === "all" || !genreFilter || club.genre === genreFilter;

    const matchesSize =
      sizeFilter === "all" ||
      !sizeFilter ||
      (sizeFilter === "small" && club?.memberCount < 50) ||
      (sizeFilter === "medium" && club?.memberCount >= 50 && club?.memberCount < 100) ||
      (sizeFilter === "large" && club?.memberCount >= 100);

    const matchesStatus =
      statusFilter === "all" ||
      !statusFilter ||
      (statusFilter === "public" && club.isPublic) ||
      (statusFilter === "private" && !club.isPublic);

    return searchMatch && matchesGenre && matchesSize && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <header className="bg-[#E6D8B5] border-b border-[#8B4513]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <div className="flex items-center space-x-4 cursor-pointer">
              <BookOpen className="h-8 w-8 text-[#8B4513]" />
              <h1 className="text-2xl font-bold text-[#8B4513]">LitCircle</h1>
            </div>
          </Link>
          <Link href="/profile-page">
            <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80">
              <AvatarImage src={userData?.avatarURL} alt={userData?.username} />
              <AvatarFallback>{userData?.username?.[0]}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#8B4513] mb-6">
          Explore Book Clubs
        </h2>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#F5F5DC] border-[#8B4513] text-[#8B4513] placeholder-[#A0522D]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0522D]" />
          </div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>{" "}
              <SelectItem value="Classics">Classics</SelectItem>
              <SelectItem value="Science Fiction">Science Fiction</SelectItem>
              <SelectItem value="Mystery">Mystery</SelectItem>
              <SelectItem value="Fantasy">Fantasy</SelectItem>
              <SelectItem value="Contemporary">Contemporary</SelectItem>
              <SelectItem value="Historical">Historical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]">
              <SelectValue placeholder="Club Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small">Small (&lt;50)</SelectItem>
              <SelectItem value="medium">Medium (50-99)</SelectItem>
              <SelectItem value="large">Large (100+)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <Card key={club?.clubId} className="bg-[#E6D8B5] border-[#8B4513]">
              <CardHeader>
                  <Link
                      href={{
                        pathname: "/club-page",
                        query: { clubId: club.clubId, role: userData?.role }, 
                      }}
                    >
                  <CardTitle className="text-[#8B4513] cursor-pointer hover:underline">
                    {club?.name}
                  </CardTitle>
                </Link>
                <CardDescription className="text-[#A0522D]">
                  {club?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary" className="bg-[#F5F5DC] text-[#8B4513]">
                    {club?.genre}
                  </Badge>
                  <span className="text-[#8B4513]">
                    <Users className="inline mr-1" />
                    {club?.memberCount} members
                  </span>
                </div>
                <Badge
                  variant={club.isPublic ? "default" : "outline"}
                  className={
                    club.isPublic
                      ? "bg-[#8B4513] text-[#F5F5DC]"
                      : "border-[#8B4513] text-[#8B4513]"
                  }
                >
                  {club.isPublic ? "Public" : "Private"}
                </Badge>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#8B4513] text-[#F5F5DC] hover:bg-[#A0522D]"
                  onClick={() => handleJoinClub(club?.clubId)}
                >
                  Join Club
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};
