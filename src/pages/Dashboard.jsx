import React from 'react';
import tokenStore from 'store/tokenStore';

const Dashboard = () => {
  const {isTokenValid} = tokenStore();
  return (
    isTokenValid? (
    <div className="container">
      <h1>대시보드</h1>
      <p>대시보드 내용은 여기에 표시됩니다.</p>
    </div>) : null
  );
};

export default Dashboard;
