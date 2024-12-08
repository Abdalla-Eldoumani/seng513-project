import { ManageClub } from "@/components/manage-club";
import { ProtectedRouteModerator } from '@/components/protected-route-moderator';


const CreateClubPage = () => {
    return  <ProtectedRouteModerator> 
                <ManageClub />
            </ProtectedRouteModerator>;
};

export default CreateClubPage;