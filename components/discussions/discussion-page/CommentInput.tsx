import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, GitBranch, Send } from "lucide-react";
import { useState } from "react";
import EmojiPicker from "./emoji-input"; // Import the custom EmojiPicker

export default function CommentInput({
  newMessage,
  setNewMessage,
  handleSendMessage,
}: {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => void;
}) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleEmojiSelect = (emoji: { native: string }) => {
    // Append the selected emoji to the message
    setNewMessage((prev) => prev + emoji.native);
  };

  return (
    <form
      onSubmit={(e) => {
        console.log("Form submitted with message:", newMessage);
        handleSendMessage(e);
      }}
      className="mt-4 flex space-x-2 relative"
    >
      <div className="flex-grow flex items-center space-x-2 bg-[#F5F5DC] rounded-lg border border-[#8B4513]">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-[#8B4513]"
          onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => {
            console.log("New message input:", e.target.value);
            setNewMessage(e.target.value);
          }}
          className="flex-grow border-0 bg-transparent focus-visible:ring-0"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-[#8B4513]"
        >
          <GitBranch className="h-5 w-5" />
        </Button>
      </div>
      <Button
        type="submit"
        className="bg-[#8B4513] text-[#F5F5DC] hover:bg-[#A0522D]"
      >
        <Send className="h-4 w-4" />
      </Button>

      {/* Emoji Picker */}
      {isEmojiPickerOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-white shadow-lg rounded-lg z-10">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </form>
  );
}
