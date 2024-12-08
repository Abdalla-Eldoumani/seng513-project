// * Shows the title, description, author information, and posting date.
// * Includes upvote and downvote functionality, as well as the reply count.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Discussion from "@/types/Discussion";
import { ArrowBigUp, ArrowBigDown, MessageCircle } from "lucide-react";

export default function DiscussionPost({
  discussionData,
  votes,
  userVote,
  handleUpvote,
  handleDownvote,
  formatDate,
}: {
  discussionData: Discussion;
  votes: number;
  userVote: number;
  handleUpvote: () => void;
  handleDownvote: () => void;
  formatDate: (dateString: string) => string;
}) {
  return (
    <div className="bg-[#E6D8B5] rounded-lg p-4 shadow-md">
      <div className="flex items-start space-x-4">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={discussionData.authorAvatar}
            alt={discussionData.author}
          />
          {/* <AvatarFallback>{discussionData.author[0]}</AvatarFallback> */}
        </Avatar>
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-[#8B4513]">
            {discussionData.title}
          </h2>
          <div className="text-sm text-[#A0522D] mb-2">
            Posted by {discussionData.author} • {formatDate(discussionData.createdAt)}
          </div>
          <p className="text-[#8B4513] mb-4">{discussionData.title}</p>
          {/* Upvote/Downvote Section */}
          <div className="flex items-center justify-between pt-4 border-t border-[#8B4513]/20">
            <div className="flex items-center space-x-2 mt-4">
              {/* Voting Buttons */}
              <div className="flex items-center space-x-1 bg-[#D8C8A5] rounded-full px-3 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-4 w-4 p-0 hover:bg-transparent ${
                    userVote === 1 ? "text-green-500" : "text-black"
                  }`}
                  onClick={handleUpvote}
                >
                  <ArrowBigUp className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{votes}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-4 w-4 p-0 hover:bg-transparent ${
                    userVote === -1 ? "text-red-500" : "text-black"
                  }`}
                  onClick={handleDownvote}
                >
                  <ArrowBigDown className="h-4 w-4" />
                </Button>
              </div>
              {/* Reply Count */}
              <div className="flex items-center space-x-1 bg-[#D8C8A5] rounded-full px-3 py-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {discussionData.downVotes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
