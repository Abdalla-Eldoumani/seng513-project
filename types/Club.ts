import Discussion from "./Discussion";
import Moderator from "./Moderator";

type Club = {
  clubId: string;
  name: string;
  bio: string;
  book: string;
  description: string;
  genre: string;
  isPublic: boolean;
  memberCount: number;
  onlineCount: number;
  rank: string;
  rules: string[];
  moderators: Moderator[];
  createdAt: string;
  createdBy: string;
  discussions: Record<string, Discussion>;
}

export default Club;