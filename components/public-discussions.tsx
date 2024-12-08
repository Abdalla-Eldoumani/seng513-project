"use client";

/* TODO:
 ! when you click on a discussion on this page it does not redirect you to the discussion page
 */

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Search,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const discussions = [
  {
    id: 1,
    title: "The symbolism in 'To Kill a Mockingbird'",
    description:
      "Let's discuss the various symbols used in Harper Lee's classic novel.",
    genre: "Classic Literature",
    topic: "Literary Analysis",
    date: "2023-06-10T14:30:00Z",
    replies: 23,
    author: { name: "Alice", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: 2,
    title: "Favorite sci-fi novels of the 21st century",
    description:
      "Share and discuss your top picks for science fiction novels published since 2000.",
    genre: "Science Fiction",
    topic: "Book Recommendations",
    date: "2023-06-09T10:15:00Z",
    replies: 45,
    author: { name: "Bob", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: 3,
    title: "The impact of 'The Great Gatsby' on American literature",
    description:
      "Exploring how F. Scott Fitzgerald's work influenced subsequent authors and literary movements.",
    genre: "Classic Literature",
    topic: "Literary History",
    date: "2023-06-08T16:45:00Z",
    replies: 17,
    author: { name: "Charlie", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: 4,
    title: "Dystopian fiction: predictions vs. reality",
    description:
      "Comparing the predictions made in popular dystopian novels to our current world.",
    genre: "Dystopian",
    topic: "Comparative Analysis",
    date: "2023-06-07T09:30:00Z",
    replies: 31,
    author: { name: "Diana", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: 5,
    title: "The rise of Nordic noir in crime fiction",
    description:
      "Discussing the popularity and characteristics of Scandinavian crime novels.",
    genre: "Crime",
    topic: "Genre Trends",
    date: "2023-06-06T13:20:00Z",
    replies: 28,
    author: { name: "Ethan", avatar: "/placeholder.svg?height=40&width=40" },
  },
];

export const AllPublicDiscussionsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all-genres");
  const [topicFilter, setTopicFilter] = useState("all-topics");
  const [dateFilter, setDateFilter] = useState("all-time");

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesGenre =
      genreFilter === "all-genres" || discussion.genre === genreFilter;
    const matchesTopic =
      topicFilter === "all-topics" || discussion.topic === topicFilter;
    const matchesSearchTerm =
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      dateFilter === "all-time" ||
      (dateFilter === "today" &&
        new Date(discussion.date).toDateString() ===
          new Date().toDateString()) ||
      (dateFilter === "week" &&
        new Date(discussion.date) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" &&
        new Date(discussion.date) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    return matchesGenre && matchesTopic && matchesSearchTerm && matchesDate;
  });

  const trendingDiscussions = [...discussions]
    .sort((a, b) => b.replies - a.replies)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <header className="bg-[#E6D8B5] border-b border-[#8B4513] shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-[#8B4513]" />
            <h1 className="text-2xl font-bold text-[#8B4513]">LitCircle</h1>
          </Link>
          <nav>
            <Link href="/profile-page">
              <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80">
                <AvatarImage
                  src={user?.avatarURL ?? undefined}
                  alt={user?.username ?? undefined}
                />
                <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
              </Avatar>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#8B4513] mb-6">
          Public Discussions
        </h2>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Input
              type="text"
              placeholder="Search discussions..."
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
              <SelectItem value="all-genres">All Genres</SelectItem>
              <SelectItem value="Classic Literature">
                Classic Literature
              </SelectItem>
              <SelectItem value="Science Fiction">Science Fiction</SelectItem>
              <SelectItem value="Dystopian">Dystopian</SelectItem>
              <SelectItem value="Crime">Crime</SelectItem>
            </SelectContent>
          </Select>
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-topics">All Topics</SelectItem>
              <SelectItem value="Literary Analysis">
                Literary Analysis
              </SelectItem>
              <SelectItem value="Book Recommendations">
                Book Recommendations
              </SelectItem>
              <SelectItem value="Literary History">Literary History</SelectItem>
              <SelectItem value="Comparative Analysis">
                Comparative Analysis
              </SelectItem>
              <SelectItem value="Genre Trends">Genre Trends</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]">
              <SelectValue placeholder="Date Posted" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {filteredDiscussions.map((discussion) => (
              <Link
                key={discussion.id}
                href={`/discussion-page/${discussion.id}`}
                className="block"
              >
                <Card className="bg-[#E6D8B5] border-[#8B4513] shadow-md transition-colors duration-200 hover:bg-[#D8C8A5]">
                  <CardHeader>
                    <CardTitle className="text-[#8B4513]">
                      {discussion.title}
                    </CardTitle>
                    <CardDescription className="text-[#A0522D]">
                      {discussion.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage
                            src={discussion.author.avatar}
                            alt={discussion.author.name}
                          />
                          <AvatarFallback>
                            {discussion.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[#8B4513]">
                          {discussion.author.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#A0522D]">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(discussion.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-[#F5F5DC] text-[#8B4513]"
                      >
                        {discussion.genre}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[#8B4513] text-[#8B4513]"
                      >
                        {discussion.topic}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-[#8B4513]">
                      <MessageSquare className="h-4 w-4" />
                      <span>{discussion.replies} replies</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          <div className="space-y-6">
            {!user && (
              <Card className="bg-[#E6D8B5] border-[#8B4513] shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#8B4513]">
                    Join the Conversation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#A0522D] mb-4">
                    Sign up or log in to participate in discussions and share
                    your thoughts with fellow book lovers!
                  </p>
                  <div className="space-y-2">
                    <Link href="/sign-up">
                      <Button className="w-full bg-[#8B4513] text-white hover:bg-[#A0522D]">
                        Sign Up
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button
                        variant="outline"
                        className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                      >
                        Log In
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="bg-[#E6D8B5] border-[#8B4513] shadow-md">
              <CardHeader>
                <CardTitle className="text-[#8B4513]">
                  Trending Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {trendingDiscussions.map((discussion) => (
                    <li
                      key={discussion.id}
                      className="border-b border-[#8B4513] pb-2 last:border-b-0 transition-colors duration-200 hover:bg-[#D8C8A5]"
                    >
                      <Link
                        href={`/discussion-page/${discussion.id}`}
                        className="text-[#8B4513] hover:text-[#A0522D]"
                      >
                        <h4 className="font-medium">{discussion.title}</h4>
                        <div className="flex items-center space-x-1 text-[#A0522D] text-sm">
                          <TrendingUp className="h-4 w-4" />
                          <span>{discussion.replies} replies</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
