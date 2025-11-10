import { Outlet } from 'react-router-dom';
import { Layout } from '@widgets/layout/Layout';
import { ProtectedRoute } from '@shared/ui';

export const TeamsLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};


