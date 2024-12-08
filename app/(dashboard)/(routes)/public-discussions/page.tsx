import { AllPublicDiscussionsPage } from "@/components/public-discussions";
import { GeneralProtectedRoute } from "@/components/general-protected-route";

const Discussions = () => {
  return (
    <GeneralProtectedRoute>
      <AllPublicDiscussionsPage />
    </GeneralProtectedRoute>
  );
};

export default Discussions;
