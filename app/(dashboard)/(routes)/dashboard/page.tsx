import { DashboardPage } from '@/components/dashboard-page';
import { ProtectedRoute } from '@/components/protected-route';

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
};

export default Dashboard;