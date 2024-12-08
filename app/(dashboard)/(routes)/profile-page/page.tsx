import { GeneralProtectedRoute } from "@/components/general-protected-route";
import { ProfilePage } from "@/components/profile-page";

const profilePage = () => {
    return (
        <GeneralProtectedRoute>
            <ProfilePage />
        </GeneralProtectedRoute>
    );
}
 
export default profilePage;