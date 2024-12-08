import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export default function DiscussionHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-[#E6D8B5] border-b border-[#8B4513] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard">
          <div className="flex items-center space-x-4 cursor-pointer">
            <BookOpen className="h-8 w-8 text-[#8B4513]" />
            <h1 className="text-2xl font-bold text-[#8B4513]">LitCircle</h1>
          </div>
        </Link>
        <Link href="/profile-page">
          <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80">
            <AvatarImage src={user?.avatarURL ?? undefined} alt={user?.username ?? undefined} />
            <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}