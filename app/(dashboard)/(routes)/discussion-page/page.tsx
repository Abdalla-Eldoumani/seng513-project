import DiscussionPage from "@/components/discussions/discussion-page/main";
import { GeneralProtectedRoute } from "@/components/general-protected-route";

export default function Page({ params }: { params: { discussionId: string, clubId: string } }) {
  return (
    <GeneralProtectedRoute>
      <DiscussionPage discussionId={params.discussionId} clubId={params.clubId} />
    </GeneralProtectedRoute>
  );
}
