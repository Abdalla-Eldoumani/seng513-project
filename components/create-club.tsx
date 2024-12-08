"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Tag, FileText, AlertCircle } from "lucide-react";
import { addClubToFirestore } from "@/lib/firestore";

export const CreateClub = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    book: "",
    description: "",
    genre: "",
    isPublic: true,
    rank: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.push("/login");
      setError("You must be logged in to create a club.");
      return;
    }
    setUserId(user.uid);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, bio, book, description, genre, isPublic, rank } = formData;

    if (!name || !bio || !book || !description || !genre) {
      setError("All fields except rank are required.");
      return;
    }

    if (!userId) {
      setError("You must be logged in to create a club.");
      return;
    }

    setLoading(true);

    try {
      await addClubToFirestore({
        name,
        bio,
        book,
        description,
        genre,
        isPublic,
        createdBy: userId,
        rules: ["Be respectful", "No spam"],
        moderators: [{ name: auth.currentUser?.displayName || "Creator", avatar: "/path.png" }],
        memberCount: 1,
        onlineCount: 0,
        rank,
      });

      toast.success("Club created successfully.");
      router.push("/club-page");
    } catch (error) {
      console.error("Create club error:", error);
      setError("Failed to create club. Please try again.");
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
          Create a New Club
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#E6D8B5] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-[#8B4513]">
                Club Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="bio" className="block text-sm font-medium text-[#8B4513]">
                Club Bio
              </Label>
              <textarea
                id="bio"
                name="bio"
                rows={2}
                required
                className="block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="book" className="block text-sm font-medium text-[#8B4513]">
                Featured Book
              </Label>
              <Input
                id="book"
                name="book"
                type="text"
                required
                className="block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                value={formData.book}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-[#8B4513]">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                className="block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="genre" className="block text-sm font-medium text-[#8B4513]">
                Genre
              </Label>
              <Input
                id="genre"
                name="genre"
                type="text"
                required
                className="block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                value={formData.genre}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="rank" className="block text-sm font-medium text-[#8B4513]">
                Club Rank (Optional)
              </Label>
              <Input
                id="rank"
                name="rank"
                type="text"
                className="block w-full border-[#8B4513] rounded-md focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC]"
                value={formData.rank}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="isPublic" className="block text-sm font-medium text-[#8B4513]">
                Public Club?
              </Label>
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="rounded-md border-[#8B4513] focus:ring-[#8B4513] focus:border-[#8B4513] bg-[#F5F5DC] text-[#8B4513]"
              />
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
              {loading ? "Creating..." : "Create Club"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};