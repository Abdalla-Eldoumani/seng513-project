// * Includes club details like name, bio, creation date, membership stats, rules, and moderators.
// * Provides options for users to join the club or contact moderators.

import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CakeSlice, Globe, Lock, ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Club from "@/types/Club";
import { useEffect, useState } from "react";
import { getClubFromFirestore } from "@/lib/firestore";


export default function DiscussionSidebar({
  clubId
}: {
  clubId: string;
}){
  const [clubData, setClubData] = useState<Club | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const data = await getClubFromFirestore(clubId);
        setClubData(data);
      } catch (error) {
        console.error("Error fetching club data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
    console.log(clubData)
  }, []);

  if (loading) return <div>Loading club information...</div>;
  if (!clubData) return <div>Error: Club data not found.</div>;
  
  return (
    <div className="bg-[#E6D8B5] rounded-lg shadow-md">
      {/* Club Information */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#8B4513]">
              {clubData.name}
            </h3>
            <p className="text-[#A0522D]">{clubData.name}</p>
          </div>
          <Button variant="outline" className="text-[#8B4513]">
            Joined
          </Button>
        </div>
        <p className="text-[#A0522D] text-sm mb-4">{clubData.bio}</p>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center text-sm text-[#8B4513]">
            <CakeSlice className="h-4 w-4 mr-2 transform scale-x-[-1]" />{" "}
            <span>
              Created {new Date(clubData.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-sm text-[#8B4513]">
            {clubData.isPublic ? (
              <>
                <Globe className="h-4 w-4 mr-2" />
                <span>Public</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                <span>Private</span>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
          <div>
            <div className="font-medium text-[#8B4513]">
              {clubData.memberCount.toLocaleString()}
            </div>
            <div className="text-[#A0522D]">Members</div>
          </div>
          <div>
            <div className="font-medium text-[#8B4513]">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />
              {clubData.onlineCount}
            </div>
            <div className="text-[#A0522D]">Online</div>
          </div>
          <div>
            <div className="font-medium text-[#8B4513]">{clubData.rank}</div>
            <div className="text-[#A0522D]">Rank by size</div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rules Section */}
      <div className="p-4">
        <h4 className="text-lg font-bold text-[#8B4513] mb-4">Rules</h4>
        <div className="space-y-2">
          {clubData.rules.map((rule, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-[#8B4513] hover:bg-[#D8C8A5] p-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{index + 1}.</span>
                  <span className="text-sm">{rule}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 py-2 text-sm text-[#A0522D]">
                Detailed explanation of {rule.toLowerCase()} rule goes here.
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      <Separator />

      {/* Moderators Section */}
      <div className="p-4">
        <h4 className="text-lg font-bold text-[#8B4513] mb-4">Moderators</h4>
        <div className="space-y-3">
          {clubData.moderators.map((mod) => (
            <div key={mod.name} className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={mod.avatar} alt={mod.name} />
                <AvatarFallback>{mod.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-[#8B4513] text-sm">{mod.name}</span>
            </div>
          ))}
          <Link href="/contact-moderators">
            <Button className="w-full bg-[#8B4513] text-[#F5F5DC] hover:bg-[#A0522D]">
              <Users className="h-4 w-4 mr-2" />
              Contact Moderators
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
