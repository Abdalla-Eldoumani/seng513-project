import { db } from '@/lib/firebase';
import Club from '@/types/Club';
import Discussion from '@/types/Discussion';
import Message from '@/types/Message';
import User from '@/types/User';
import UserProgress from '@/types/UserProgress';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  setDoc,
} from 'firebase/firestore';

// USERS
const usersCollection = collection(db, 'users');

export const addUserToFirestore = async (
  userId: string,
  {
    avatarURL = '',
    bio = '',
    createdAt = new Date().toISOString(),
    email,
    firstName,
    lastName,
    role = 'user',
    username,
    clubsJoined = [],
    progress = [],
  }: {
    avatarURL?: string;
    bio?: string;
    createdAt?: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "user"
    username: string;
    clubsJoined?: string[];
    progress?: UserProgress[];
  }
) => {
  try {
    const userRef = doc(db, 'users', userId);

    await setDoc(userRef, {
      avatarURL,
      bio,
      createdAt,
      email,
      firstName,
      lastName,
      role,
      username,
      clubsJoined,
      progress,
    });

    return { success: true, message: 'User added successfully' };
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};

export const getUserFromFirestore = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const data = userDoc.data();

    const user: User = {
      avatarURL: data.avatarURL || "",
      bio: data.bio || "",
      createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt || "",
      email: data.email || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      role: data.role || "user",
      username: data.username || "",
      clubsJoined: data.clubsJoined || [],
      progress: data.progress
        ? data.progress.map((prog: UserProgress) => ({
            clubId: prog.clubId,
            progress: prog.progress,
            bookId: prog.bookId,
          }))
        : [],
    };

    return { id: userDoc.id, ...user };
  }

  return null;
};



export const updateUserInFirestore = async (userId: string, updates: Partial<{ username: string; email: string; role: string }>) => {
  const userDoc = doc(usersCollection, userId);
  return await updateDoc(userDoc, updates);
};

export const deleteUserFromFirestore = async (userId: string) => {
  const userDoc = doc(usersCollection, userId);
  return await deleteDoc(userDoc);
};

export const getUserByUsername = async (username: string): Promise<{ id: string; email: string; role: string } | null> => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return { id: doc.id, email: data.email, role: data.role };
  }
  return null;
};


export const getUserClubsFromFirestore = async (userId: string): Promise<Club[]> => {
  try {
    const usersCollection = collection(db, 'users');

    const userDoc = doc(usersCollection, userId);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    // Get the clubs array from the user's data
    const userData = userSnap.data();
    const clubs = userData.clubsJoined || [];


    // Fetch club details for each clubId
    const clubsCollection = collection(db, 'clubs');
    const clubDetails: Club[] = [];

    for (const clubId of clubs) {
      const clubDoc = doc(clubsCollection, clubId);
      const clubSnap = await getDoc(clubDoc);

      if (clubSnap.exists()) {
        const clubData = clubSnap.data();
        clubDetails.push({
          clubId: clubSnap.id,
          name: clubData.name,
          bio: clubData.bio,
          book: clubData.book,
          description: clubData.description,
          genre: clubData.genre,
          isPublic: clubData.isPublic,
          memberCount: clubData.memberCount,
          onlineCount: clubData.onlineCount,
          rank: clubData.rank,
          rules: clubData.rules,
          moderators: clubData.moderators,
          createdAt: clubData.createdAt,
          createdBy: clubData.createdBy,
          discussions: clubData.discussions,
        });
      }
    }

    return clubDetails;
  } catch (error) {
    console.error('Error fetching user clubs:', error);
    throw error;
  }
};


export const getUserRoleFromFirestore = async (uid: string): Promise<string | null> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", uid));
    console.log("Querying for user with UID:", uid);

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log("User data fetched:", userData);

      return userData.role || null;
    } else {
      console.error("No document found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw new Error("Failed to fetch user role");
  }
};
// CLUBS


const clubsCollection = collection(db, "clubs");

// Club Methods

// Add a Club to Firestore
export const addClubToFirestore = async ({
  name,
  bio,
  book,
  description,
  genre,
  isPublic,
  createdBy,
  rules = [],
  moderators = [],
  memberCount = 0,
  onlineCount = 0,
  rank = "",
}: Omit<Club, "clubId" | "createdAt" | "discussions">): Promise<void> => {
  const clubRef = doc(clubsCollection);

  await setDoc(clubRef, {
    name,
    bio,
    book,
    description,
    genre,
    isPublic,
    createdBy,
    memberCount,
    onlineCount,
    rank,
    rules,
    moderators,
    createdAt: new Date().toISOString(),
    discussions: {},
  });

  console.log(`Club ${name} added successfully.`);
};

// Get a Club by ID
export const getClubFromFirestore = async (clubId: string): Promise<Club | null> => {
  const clubRef = doc(db, "clubs", clubId);
  const clubSnap = await getDoc(clubRef);

  if (!clubSnap.exists()) {
    console.warn(`Club with ID ${clubId} not found.`);
    return null;
  }

  return { clubId, ...(clubSnap.data() as Omit<Club, "clubId">) };
};

// Get All Clubs
export const getClubsFromFirestore = async (): Promise<Club[]> => {
  const clubsSnapshot = await getDocs(clubsCollection);

  return clubsSnapshot.docs.map((doc) => ({
    clubId: doc.id,
    ...(doc.data() as Omit<Club, "clubId">),
  }));
};

// Update a Club
export const updateClubInFirestore = async (
  clubId: string,
  updates: Partial<Omit<Club, "clubId">>
): Promise<void> => {
  const clubRef = doc(db, "clubs", clubId);

  await updateDoc(clubRef, updates);
  console.log(`Club ${clubId} updated successfully.`);
};

// Delete a Club
export const deleteClubFromFirestore = async (clubId: string): Promise<void> => {
  const clubRef = doc(db, "clubs", clubId);

  await deleteDoc(clubRef);
  console.log(`Club ${clubId} deleted successfully.`);
};

// Add a Discussion to a Club
export const addDiscussionToClub = async (
  clubId: string,
  {
    title,
    author,
    authorAvatar = "",
    downVotes = 0,
    messages = {},
  }: Omit<Discussion, "discussionId" | "createdAt">
): Promise<void> => {
  const clubRef = doc(db, "clubs", clubId);
  const clubSnap = await getDoc(clubRef);

  if (!clubSnap.exists()) {
    throw new Error(`Club with ID ${clubId} not found.`);
  }

  const clubData = clubSnap.data()!;
  const discussions = clubData.discussions || {};

  const discussionId = `discussion-${Object.keys(discussions).length + 1}`;
  discussions[discussionId] = {
    title,
    author,
    authorAvatar,
    createdAt: new Date().toISOString(),
    downVotes,
    messages,
  };

  await updateDoc(clubRef, { discussions });
  console.log(`Discussion ${title} added to club ${clubId}.`);
};

// Add Club to user
export const addClubToUser = async (clubId: string, userId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);

    // Fetch the user document
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    // Get the current clubsJoined array
    const userData = userDoc.data();
    const clubsJoined = userData.clubsJoined || [];

    if (clubsJoined.includes(clubId)) {
      console.log(`User ${userId} is already a member of club ${clubId}`);
      return;  
    }

    clubsJoined.push(clubId);

    await updateDoc(userDocRef, {
      clubsJoined,
    });

    console.log(`Club ${clubId} added to user ${userId}`);
  } catch (error) {
    console.error('Error adding club to user:', error);
    throw error;  
  }
};

// Add User to Club
export const addUserToClub = async (clubId: string, userId: string): Promise<void> => {
  try {
    const clubDocRef = doc(clubsCollection, clubId);

    const clubSnap = await getDoc(clubDocRef);

    if (!clubSnap.exists()) {
      throw new Error(`Club with ID ${clubId} not found.`);
    }

    const clubData = clubSnap.data();
    const members = clubData.members || [];

    if (members.includes(userId)) {
      console.log(`User ${userId} is already a member of club ${clubId}`);
      return;
    }

    members.push(userId);

    await updateDoc(clubDocRef, {
      members,
      memberCount: members.length, 
    });

    console.log(`User ${userId} added to club ${clubId}`);
  } catch (error) {
    console.error('Error adding user to club:', error);
    throw error;
  }
};

// Fetch Discussions from a Club
export const getDiscussionsFromClub = async (clubId: string): Promise<Record<string, Discussion> | null> => {
  const club = await getClubFromFirestore(clubId);

  return club ? club.discussions : null;
};

// Fetch all Discussions from all Clubs
export const getAllDiscussions = async (): Promise<Record<string, Discussion>[]> => {
  const clubs = await getClubsFromFirestore();
  const discussions: Record<string, Discussion>[] = [];

  for (const club of clubs) {
    const clubDiscussions = await getDiscussionsFromClub(club.clubId);
    if (clubDiscussions) {
      discussions.push(clubDiscussions);
    }
  }

  return discussions;
};

// Add a Message to a Discussion
export const addMessageToDiscussion = async (
  clubId: string,
  discussionId: string,
  message: Message
): Promise<void> => {
  const clubRef = doc(db, "clubs", clubId);
  const clubSnap = await getDoc(clubRef);

  if (!clubSnap.exists()) {
    throw new Error(`Club with ID ${clubId} not found.`);
  }

  const clubData = clubSnap.data()!;
  const discussions = clubData.discussions || {};

  if (!discussions[discussionId]) {
    throw new Error(`Discussion with ID ${discussionId} not found.`);
  }

  const messages = discussions[discussionId].messages || {};
  const messageId = `message-${Object.keys(messages).length + 1}`;
  messages[messageId] = message;

  discussions[discussionId].messages = messages;

  await updateDoc(clubRef, { discussions });
  console.log(`Message added to discussion ${discussionId} in club ${clubId}.`);
};

// Get Messages from a Discussion
export const getMessagesFromDiscussion = async (
  clubId: string,
  discussionId: string
): Promise<Record<string, Message> | null> => {
  const discussions = await getDiscussionsFromClub(clubId);

  if (discussions && discussions[discussionId]) {
    return discussions[discussionId].messages;
  }

  return null;
};

// BOOKS
const booksCollection = collection(db, 'books');

export const addBookToFirestore = async (title: string, author: string, photoURL: string, synopsis: string) => {
  return await addDoc(booksCollection, {
    title,
    author,
    photoURL,
    synopsis,
    createdAt: new Date(),
  });
};

export const getBooksFromFirestore = async () => {
  const booksSnapshot = await getDocs(booksCollection);
  return booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateBookInFirestore = async (bookId: string, updates: Partial<{ title: string; author: string; photoURL: string; synopsis: string }>) => {
  const bookDoc = doc(booksCollection, bookId);
  return await updateDoc(bookDoc, updates);
};

export const deleteBookFromFirestore = async (bookId: string) => {
  const bookDoc = doc(booksCollection, bookId);
  return await deleteDoc(bookDoc);
};


// AVATARS
const avatarsCollection = collection(db, 'avatars');

export const getAllAvatarURLsFromFirestore = async () => {
  const URLs: string[] = [];
  const avatarsSnapshot = getDocs(avatarsCollection);
  (await avatarsSnapshot).forEach(function (doc) {
    const data = doc.data();
    URLs.push(data.url);
  });
  return URLs;
};