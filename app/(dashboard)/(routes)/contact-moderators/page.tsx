import ContactModerators from "@/components/discussions/discussion-page/contact-moderators";
import { ProtectedRoute } from "@/components/protected-route";

const contact = () => {
  return (
    <ProtectedRoute>
      <ContactModerators />
    </ProtectedRoute>
  );
};

export default contact;