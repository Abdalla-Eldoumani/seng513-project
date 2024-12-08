import UserProgress from "./UserProgress";
type User = {
    avatarURL: string;
    bio: string;
    createdAt: string;  // ISO string or timestamp
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin" | "moderator";
    username: string;
    clubsJoined: string[];
    progress: UserProgress[];
  }

export default User