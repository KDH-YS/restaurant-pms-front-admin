import React from 'react';
import tokenStore from 'store/tokenStore';
import AdminDashboard from 'components/dh/AdminDashboard';
const Dashboard = () => {
  const {isTokenValid} = tokenStore();
  return (
    isTokenValid? (
      <AdminDashboard/>
    ) : null
  );
};

export default Dashboard;
