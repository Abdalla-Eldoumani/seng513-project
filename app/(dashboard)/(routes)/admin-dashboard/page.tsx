import { AdminDashboardPage } from '@/components/admin-dashboard-page';
import { ProtectedRouteAdmin } from '@/components/protected-route-admin';
const AdminDashboard = () => {
  return (
    <ProtectedRouteAdmin>
      <AdminDashboardPage />
    </ProtectedRouteAdmin>
  );
};

export default AdminDashboard;