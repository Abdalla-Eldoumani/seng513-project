/* Eslint Disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* esling-disable @typescript-eslint/no-wrapper-object-types */

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SmilePlus, Pencil, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Message from "@/types/Message";

// Dynamically load the EmojiPicker to optimize load times
const EmojiPicker = dynamic(() => import("./emoji-input"), {
  loading: () => <span>Loading...</span>,
});

export default function DiscussionComments({
  messages,
  handleReaction,
  handleDeleteMessage,
  handleSaveEdit,
  formatDate,
}: {
  messages: Message[];
  handleReaction: (messageId: string, emoji: string) => void;
  handleDeleteMessage: (messageId: string) => void;
  handleSaveEdit: (messageId: string, editedContent: string) => void;
  formatDate: (dateString: string) => string;
}) {
  const { user } = useAuth();
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const quickEmojis = ["👍", "⭐", "💯"];

  const handleEdit = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      setEditedContent(message.content[message.content.length - 1]);
      setEditingMessageId(messageId);
    }

    
  };

  return (
    <div className="bg-[#E6D8B5] rounded-lg p-4 shadow-md flex flex-col flex-grow">
      <ScrollArea className="flex-grow mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="group mb-4 p-3 rounded-lg hover:bg-[#D8C8A5] transition-colors duration-200 relative"
          >
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.author}`}
                />
                <AvatarFallback>{message.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-[#8B4513]">
                      {message.author}
                    </span>
                    <span className="text-xs text-[#A0522D]">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>

                  <div
                    className={`${
                      activeMessageId === message.id ||
                      message.id === activeMessageId
                        ? "visible"
                        : "invisible group-hover:visible"
                    } flex items-center space-x-1 bg-[#D8C8A5]/90 rounded-md p-1 transition-opacity`}
                  >
                    {quickEmojis.map((emoji) => {
                      const reacted =
                        user &&
                        message.reactions[emoji] &&
                        message.reactions[emoji].users &&
                        user.uid in message.reactions[emoji].users;
                      return (
                        <Button
                          key={emoji}
                          variant="ghost"
                          size="sm"
                          className={`h-7 px-2 text-sm ${
                            reacted ? "bg-[#D8C8A5]" : ""
                          }`}
                          onClick={() => handleReaction(message.id as string, emoji)}
                        >
                          {emoji}
                        </Button>
                      );
                    })}
                    <Popover
                      onOpenChange={(open) => {
                        if (open) {
                          setActiveMessageId(message.id as string);
                        } else {
                          setActiveMessageId(null);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <SmilePlus className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2 bg-transparent border-none shadow-none">
                        <EmojiPicker
                          onEmojiSelect={(emoji) =>
                            handleReaction(message.id as string, emoji.native)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    {user && user.uid === message.author && (
                      <>
                        <Separator orientation="vertical" className="h-5" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => handleEdit(message.id as string)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => handleDeleteMessage(message.id as string )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {editingMessageId === message.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <div className="flex space-x-2 mt-2">
                      <Button
                        onClick={async () => {
                          await handleSaveEdit(message.id as string, editedContent);
                          setEditingMessageId(null);
                        }}
                        className="bg-blue-500 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingMessageId(null)}
                        className="bg-gray-500 text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#8B4513] mt-1">
                    {message.content[message.content.length - 1]}
                  </p>
                )}
                {Object.keys(message.reactions).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(message.reactions)
                      .map(([emoji, data]) => ({
                        emoji,
                        users: data.users || {}, // Ensure 'users' is always an object
                      }))
                      .map(({ emoji, users }) => {
                        const userReacted = user && users[user.uid];
                        return (
                          <div
                            key={emoji}
                            className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-sm cursor-pointer ${
                              userReacted ? "bg-[#C8B595]" : "bg-[#F5F5DC]"
                            }`}
                            onClick={() => handleReaction(message.id as string, emoji)}
                          >
                            <span>{emoji}</span>
                            <span className="text-xs text-[#8B4513]">
                              {Object.keys(users || {}).length}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
