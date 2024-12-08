import { CreateClub } from "@/components/create-club";
import { ProtectedRouteAdminModerator } from '@/components/protectedRoute-Admin-Moderator';


const CreateClubPage = () => {
    return  <ProtectedRouteAdminModerator> 
                <CreateClub />
            </ProtectedRouteAdminModerator>;
};

export default CreateClubPage;