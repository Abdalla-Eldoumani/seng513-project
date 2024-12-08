"use client";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import DiscussionHeader from "./DiscussionHeader";
import DiscussionPost from "./DiscussionPost";
import DiscussionComments from "./DiscussionComments";
import CommentInput from "./CommentInput";
import DiscussionSidebar from "./DiscussionSidebar";
import { useAuth } from "@/context/AuthContext";
import Discussion from "@/types/Discussion";
import Message from "@/types/Message";
import { addMessageToDiscussion, getClubFromFirestore, getDiscussionsFromClub, getMessagesFromDiscussion } from "@/lib/firestore";

export default function Discussion_Page({
  clubId,
  discussionId,
}: {
  clubId: string;
  discussionId: string;
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentDiscussion, setCurrentDiscussion] = useState<Discussion | null>(null);
  const [votes, setVotes] = useState<number>(0);
  const [userVote, setUserVote] = useState(0); // -1 for downvote, 0 for no vote, 1 for upvote
  const [newMessage, setNewMessage] = useState("");



  // Fetch messages in real-time from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch the entire club data
        const clubData = await getClubFromFirestore(clubId);
  
        // Access the specific discussion's messages map
        const discussion = clubData?.discussions?.[discussionId];
        const messagesMap = discussion?.messages || {};
  
        // Convert the messages map to an array
        const messagesArray = Object.entries(messagesMap)
          .map(([key, msg]: [string, any]) => ({
            id: key,
            author: msg.author || "Unknown",
            userId: msg.userId || "",
            content: Array.isArray(msg.content) ? msg.content : [msg.content || ""],
            timestamp: msg.timestamp || new Date().toISOString(),
            replies: msg.replies || [],
            reactions: msg.reactions || {},
          }))
          .filter((message) => {
            // Exclude messages deleted by the author
            const lastContent = message.content[message.content.length - 1];
            return lastContent !== "[deleted by author]";
          });
  
        // Set the messages array to state
        setMessages(messagesArray);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    fetchMessages();
  }, [clubId, discussionId]);


  // Fetch discussion data from Firestore
  //Add props later
   useEffect(() => {
    const fetchDiscussion = async () => {
      
      try {
       
        // Fetch the specific discussion from Firestore
        const discussions = await getDiscussionsFromClub(clubId);
        if (discussions && discussions[discussionId]) {
          setCurrentDiscussion(discussions[discussionId]);
        } else {
          console.error("Discussion not found");
        }
      } catch (error) {
        console.error("Error fetching discussion:", error);
      }

    };

    fetchDiscussion();
  }, [clubId, discussionId]);
  

  const handleUpvote = async () => {
    if (!currentDiscussion || !user) return;
  
    try {
      // Reference the club document
      const clubRef = doc(db, "clubs", clubId);
      const clubSnap = await getDoc(clubRef);
  
      if (!clubSnap.exists()) {
        console.error(`Club with ID ${clubId} not found.`);
        return;
      }
  
      // Get discussions and locate the current discussion
      const clubData = clubSnap.data();
      const discussions = clubData.discussions || {};
      const discussion = discussions[discussionId];
  
      if (!discussion) {
        console.error(`Discussion with ID ${discussionId} not found.`);
        return;
      }
  
      // Extract userVotes or initialize an empty object
      const userVotes: Record<string, number> = discussion.userVotes || {};
      const currentUserVote = userVotes[user.uid] || 0;
  
      // Toggle upvote
      let newVoteValue = currentUserVote === 1 ? 0 : 1;
      userVotes[user.uid] = newVoteValue;
  
      // Calculate the total votes
      const totalVotes = Object.values(userVotes).reduce(
        (sum: number, vote: number) => sum + vote,
        0
      );
  
      // Update Firestore
      await updateDoc(clubRef, {
        [`discussions.${discussionId}.userVotes`]: userVotes,
      });
  
      // Update local state for immediate UI feedback
      setUserVote(newVoteValue);
      setVotes(totalVotes);
      console.log("Upvote updated successfully!");
    } catch (error) {
      console.error("Error updating upvote:", error);
    }
  };
  

  const handleDownvote = async () => {
    if (!currentDiscussion || !user) return;
  
    try {
      // Reference the club document
      const clubRef = doc(db, "clubs", clubId);
      const clubSnap = await getDoc(clubRef);
  
      if (!clubSnap.exists()) {
        console.error(`Club with ID ${clubId} not found.`);
        return;
      }
  
      // Get discussions and locate the current discussion
      const clubData = clubSnap.data();
      const discussions = clubData.discussions || {};
      const discussion = discussions[discussionId];
  
      if (!discussion) {
        console.error(`Discussion with ID ${discussionId} not found.`);
        return;
      }
  
      // Extract userVotes or initialize an empty object
      const userVotes: Record<string, number> = discussion.userVotes || {};
      const currentUserVote = userVotes[user.uid] || 0;
  
      // Toggle downvote
      let newVoteValue = currentUserVote === -1 ? 0 : -1;
      userVotes[user.uid] = newVoteValue;
  
      // Calculate the total votes
      const totalVotes = Object.values(userVotes).reduce(
        (sum: number, vote: number) => sum + vote,
        0
      );
  
      // Update Firestore
      await updateDoc(clubRef, {
        [`discussions.${discussionId}.userVotes`]: userVotes,
      });
  
      // Update local state for immediate UI feedback
      setUserVote(newVoteValue);
      setVotes(totalVotes);
      console.log("Downvote updated successfully!");
    } catch (error) {
      console.error("Error updating downvote:", error);
    }
  };
  

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (!user) {
        console.error("User is not logged in");
        return;
      }
      try {
        const message = {
          author: user.username || user.displayName || user.email || "Unknown",
          userId: user.uid,
          content: [newMessage],
          timestamp: new Date().toISOString(),
          replies: [],
          reactions: {},
        };
        await addMessageToDiscussion(clubId, discussionId, message);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }
  
    try {
      // 1. Fetch messages from the specific discussion
      const messages = await getMessagesFromDiscussion(clubId, discussionId);
  
      if (messages && messages[messageId]) {
        // 2. Get the current message and its reactions
        const currentMessage = messages[messageId];
        const reactions = currentMessage.reactions || {};
  
        // 3. Update reactions based on user action
        if (!reactions[emoji]) {
          reactions[emoji] = { users: {}, count: 0 };
        }
  
        if (reactions[emoji].users[user.uid]) {
          // Remove the user's reaction
          delete reactions[emoji].users[user.uid];
          reactions[emoji].count -= 1;
  
          // Remove the emoji key if no users remain
          if (Object.keys(reactions[emoji].users).length === 0) {
            delete reactions[emoji];
          }
        } else {
          // Add the user's reaction
          reactions[emoji].users[user.uid] = true;
          reactions[emoji].count += 1;
        }
  
        // 4. Update the Firestore document with the updated message reactions
        const clubRef = doc(db, "clubs", clubId);
        const updatedMessages = { ...messages, [messageId]: { ...currentMessage, reactions } };
  
        await updateDoc(clubRef, {
          [`discussions.${discussionId}.messages`]: updatedMessages,
        });
  
        // 5. Update the local state to reflect changes in the UI
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, reactions } : msg
          )
        );
  
        console.log("Reaction updated successfully!");
      } else {
        console.error("Message not found.");
      }
    } catch (error) {
      console.error("Error updating reactions:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const messageRef = doc(db, "messages", messageId);
    const messageSnap = await getDoc(messageRef);
    if (messageSnap.exists()) {
      const data = messageSnap.data();
      const currentContent = Array.isArray(data.content)
        ? data.content
        : [data.content || ""];
      const updatedContent = [...currentContent, "[deleted by author]"];

      await updateDoc(messageRef, { content: updatedContent });

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, content: updatedContent } : msg
        )
      );
    }
  };

  const handleSaveEdit = async (messageId: string, editedContent: string) => {
    try {
      const messageRef = doc(db, "messages", messageId);
      const messageSnap = await getDoc(messageRef);
      if (messageSnap.exists()) {
        const data = messageSnap.data();
        const currentContent = Array.isArray(data.content)
          ? data.content
          : [data.content || ""];
        const updatedContent = [...currentContent, editedContent];
        await updateDoc(messageRef, { content: updatedContent });

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, content: updatedContent } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] flex flex-col">
      <DiscussionHeader />
      <main className="flex-grow min-h-screen bg-[#F5F5DC] container mx-auto p-4 flex flex-col md:flex-row gap-4 h-[calc(100vh-64px)]">
        <div className="md:w-2/3 space-y-4 flex flex-col h-full">
          {currentDiscussion ? (
            <DiscussionPost
              discussionData={currentDiscussion}
              votes={votes}
              userVote={userVote}
              handleUpvote={handleUpvote}
              handleDownvote={handleDownvote}
              formatDate={formatDate}
            />
          ) : (
            <div>Loading discussion...</div>
          )}
          <DiscussionComments
            messages={messages}
            handleReaction={handleReaction}
            handleDeleteMessage={handleDeleteMessage}
            handleSaveEdit={handleSaveEdit}
            formatDate={formatDate}
          />
          <CommentInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        </div>
        <div className="md:w-1/3 space-y-4">
          <DiscussionSidebar  clubId={clubId}/>
        </div>
      </main>
    </div>
  );
}