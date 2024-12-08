"use client";

import React, { useState } from "react";
import { addDiscussionToFirestore } from "@/lib/firestore";
import { DiscussionData } from "@/components/discussions/discussion-page-types";

export default function NewDiscussionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      // Use the provided template for author and avatar data
      const newDiscussion: Partial<DiscussionData> = {
        title,
        description,
        author: "LiteraryExplorer", // Replace with dynamic user data if available
        authorAvatar: "/placeholder.svg?height=50&width=50",
      };

      await addDiscussionToFirestore(
        newDiscussion.title!,
        newDiscussion.description!,
        newDiscussion.author!,
        newDiscussion.authorAvatar!
      );

      setSuccess(true);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding discussion:", err);
      setError("Failed to create discussion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDF6E3] rounded-lg p-6 shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-[#8B4513] mb-4">
        Start a New Discussion
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#8B4513]"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full border-[#8B4513] rounded-md shadow-sm focus:ring-[#8B4513] focus:border-[#8B4513] sm:text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#8B4513]"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 block w-full border-[#8B4513] rounded-md shadow-sm focus:ring-[#8B4513] focus:border-[#8B4513] sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#8B4513] text-white px-4 py-2 rounded-md shadow hover:bg-[#5C3317] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {success && (
        <p className="mt-4 text-green-500 font-medium">
          Discussion created successfully!
        </p>
      )}
      {error && (
        <p className="mt-4 text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
