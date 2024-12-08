import { ClubPage } from "@/components/club-page";
import { GeneralProtectedRoute } from "@/components/general-protected-route";

const clubPage = () => {
    return (
        <GeneralProtectedRoute>
            <ClubPage />
        </GeneralProtectedRoute>
    );
}
 
export default clubPage;