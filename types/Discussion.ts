import Message from "./Message";

type Discussion = {
    discussionId: string;
    title: string;
    author: string;
    authorAvatar?: string;
    createdAt: string; // ISO string
    downVotes: number;
    messages: Record<string, Message>;
    clubId?: string;
    upVotes?: number,
  }

export default Discussion;