import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/navigation/sidebar/Sidebar';

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="dashboard-container">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet /> {/* Renders the current sub-route */}
        </Suspense>
      </div>
    </div>
  );
}

export default DashboardLayout;
