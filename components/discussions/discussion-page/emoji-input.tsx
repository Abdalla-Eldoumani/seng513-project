import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: { native: string }) => void;
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Picker
      data={data}
      theme="light"
      onEmojiSelect={onEmojiSelect}
    />
  );
}