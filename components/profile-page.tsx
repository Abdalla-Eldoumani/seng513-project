"use client";

/*
! TODO: User Avatar
*/

/* Eslint Disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* esling-disable @typescript-eslint/no-wrapper-object-types */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BookOpen, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { deleteUserFromFirestore, getAllAvatarURLsFromFirestore } from "@/lib/firestore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
export const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Avatar URLs
  const [allAvatarURLs, setAllAvatarURLs] = useState<string[]>([]);  
  // User data
  const [avatarURL, setAvatarURL] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [meetingReminders, setMeetingReminders] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [discussionAlerts, setDiscussionAlerts] = useState(false);

  useEffect(() => {
    const fetchAvatarURLs = async () => {
      const urls = await getAllAvatarURLsFromFirestore();
      setAllAvatarURLs(urls);
    };
    if (user) {
      const fetchProfile = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setAvatarURL(data.avatarURL || "");
          setUsername(data.username || "");
          setFirstname(data.firstname || "");
          setLastname(data.lastname || "");
          setEmail(data.email || user.email);
          setBio(data.bio || "");
          setEmailNotifications(data.emailNotifications || false);
          setMeetingReminders(data.meetingReminders || false);
          setDiscussionAlerts(data.discussionAlerts || false);
        }
      };

      fetchProfile();
      fetchAvatarURLs();
    }
  }, [user]);

  const routeToDashboard = () => {
    router.push("/dashboard");
  }

  const handleSaveChanges = async () => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    setLoading(true);
    try {
      await updateDoc(docRef, {
        firstname: firstname,
        lastname: lastname,
        username: username,
        bio: bio,
        emailNotifications: emailNotifications,
        meetingReminders: meetingReminders,
        discussionAlerts: discussionAlerts
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      await deleteUserFromFirestore(user.uid);
      await deleteUser(user as User);
      toast.success("Account deleted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  const handleChangeAvatar = async (avatarNum: string) => {
    if (!user) return;

    const avatarURL = allAvatarURLs[parseInt(avatarNum)];
    const userDocRef = doc(db, "users", user.uid);
    setLoading(true);
    try {
      await updateDoc(userDocRef, {avatarURL: avatarURL});
      setAvatarURL(avatarURL);
      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <header className="bg-[#E6D8B5] border-b border-[#8B4513]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button className="flex items-center space-x-4" onClick={routeToDashboard}>
            <BookOpen className="h-8 w-8 text-[#8B4513]" />
            <h1 className="text-2xl font-bold text-[#8B4513]">LitCircle</h1>
          </button>
          <Button
            variant="outline"
            className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#F5F5DC]"
            onClick={signOut}
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#8B4513] mb-6">Your Profile</h2>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="bg-[#E6D8B5] border-b border-[#8B4513]">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5F5DC]">
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5F5DC]">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-[#E6D8B5] border-[#8B4513]">
              <CardHeader>
                <CardTitle className="text-[#8B4513]">Profile Information</CardTitle>
                <CardDescription className="text-[#A0522D]">Update your profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarURL} />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Select onValueChange={handleChangeAvatar}>
                    <SelectTrigger className="w-[150px] bg-[#F5F5DC] border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#F5F5DC]">
                      Change Avatar
                    </SelectTrigger>
                    <SelectContent className="border-[#8B4513] bg-[#E6D8B5]">
                      <b className="text-3l text-bold text-[#8B4513]">Select Your Avatar</b>
                      <SelectGroup className="grid grid-cols-2 gap-2">
                        <SelectItem value="0"><img src={allAvatarURLs[0]} width="100px" /></SelectItem>
                        <SelectItem value="1"><img src={allAvatarURLs[1]} width="100px" /></SelectItem>
                        <SelectItem value="2"><img src={allAvatarURLs[2]} width="100px" /></SelectItem>
                        <SelectItem value="3"><img src={allAvatarURLs[3]} width="100px" /></SelectItem>
                        <SelectItem value="4"><img src={allAvatarURLs[4]} width="100px" /></SelectItem>
                        <SelectItem value="5"><img src={allAvatarURLs[5]} width="100px" /></SelectItem>
                        <SelectItem value="6"><img src={allAvatarURLs[6]} width="100px" /></SelectItem>
                        <SelectItem value="7"><img src={allAvatarURLs[7]} width="100px" /></SelectItem>
                        <SelectItem value="8"><img src={allAvatarURLs[8]} width="100px" /></SelectItem>
                        <SelectItem value="9"><img src={allAvatarURLs[9]} width="100px" /></SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-[#8B4513]">First Name</Label>
                  <Input
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-[#8B4513]">Last Name</Label>
                  <Input
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[#8B4513]">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#8B4513]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    className="bg-[#F5F5DC] border-[#8B4513] text-[#8B4513] cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-[#8B4513]">Biography</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-[#E6D8B5] border-[#8B4513]">
              <CardHeader>
                <CardTitle className="text-[#8B4513]">Account Settings</CardTitle>
                <CardDescription className="text-[#A0522D]">Manage your account preferences and security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B4513]">Notification Preferences</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="text-[#8B4513]">Email Notifications</Label>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meeting-reminders" className="text-[#8B4513]">Meeting Reminders</Label>
                    <Switch
                      id="meeting-reminders"
                      checked={meetingReminders}
                      onCheckedChange={setMeetingReminders}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="discussion-alerts" className="text-[#8B4513]">Discussion Alerts</Label>
                    <Switch
                      id="discussion-alerts"
                      checked={discussionAlerts}
                      onCheckedChange={setDiscussionAlerts}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B4513]">Delete Account</h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#F5F5DC] border-[#8B4513]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#8B4513]">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#A0522D]">
                          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-[#8B4513] text-[#8B4513] hover:bg-[#E6D8B5]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveChanges} disabled={loading} className="bg-[#8B4513] text-[#F5F5DC] hover:bg-[#A0522D]">
            <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </main>
    </div>
  );
}