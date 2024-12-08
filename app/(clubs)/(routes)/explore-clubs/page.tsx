import { ExploreClubsPage } from '@/components/explore-club-pages';
import { GeneralProtectedRoute } from '@/components/general-protected-route';

const Explore = () => {
  return (
    <GeneralProtectedRoute>
      <ExploreClubsPage />
    </GeneralProtectedRoute>
  );
};

export default Explore;