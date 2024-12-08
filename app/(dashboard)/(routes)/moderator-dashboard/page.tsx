import { ModeratorDashboardPage } from '@/components/moderator-dashboard-page';
import { ProtectedRouteModerator } from '@/components/protected-route-moderator';

const ModeratorDashboard = () => {
  return (
    <ProtectedRouteModerator>
      <ModeratorDashboardPage />
    </ProtectedRouteModerator>
  );
};

export default ModeratorDashboard;