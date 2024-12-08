type Message = {
    id?: string | undefined;
    author: string;
    content: string[];
    timestamp: string; // ISO string
    reactions: Record<string, { count: number; users: Record<string, boolean> }>;
  }

export default Message;