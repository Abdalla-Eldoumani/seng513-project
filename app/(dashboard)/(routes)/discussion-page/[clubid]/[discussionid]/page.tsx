"use client";

import { useEffect, useState } from "react";
import { getClubFromFirestore } from "@/lib/firestore";
import Discussion from "@/types/Discussion";
import { useParams } from "next/navigation";
import Discussion_Page from "@/components/discussions/discussion-page/main";

const DiscussionPage = () => {
  
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { clubid, discussionid } = useParams();
  

  const clubId = Array.isArray(clubid) ? clubid[0] : clubid as string;
  const discussionId = Array.isArray(discussionid) ? discussionid[0] : discussionid as string;

  console.log(clubid)
  console.log(discussionId)
  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        // Fetch the entire club document from Firestore
        const clubData = await getClubFromFirestore(clubId);

        // Access the specific discussion directly using the discussionId key
        const discussionData = clubData?.discussions?.[discussionId];
        console.log(discussionData)
        if (discussionData) {
          setDiscussion({
            discussionId,
            title: discussionData.title || "Untitled Discussion",
            author: discussionData.author || "Unknown",
            authorAvatar: discussionData.authorAvatar || "",
            createdAt: discussionData.createdAt || new Date().toISOString(),
            messages: {},
            downVotes: 10
          });
        } else {
          console.error("Discussion not found");
          setDiscussion(null);
        }
      } catch (error) {
        console.error("Error fetching discussion:", error);
        setDiscussion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [clubId, discussionId]);

  if (loading) return <div>Loading...</div>;
  if (!discussion) return <div>Discussion not found!</div>;

  return <Discussion_Page clubId={clubId as string}
  discussionId={discussionId as string}/>;
};

export default DiscussionPage;
