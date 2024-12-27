import React from 'react';

const Dashboard = () => {
  const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
  // 세션 스토리지에 토큰 저장
  sessionStorage.setItem('token', token);

  console.log('토큰이 세션에 저장되었습니다:', token);

  // 필요 시, URL에서 토큰 제거
  const currentUrl = window.location.href.split('?')[0];
  window.history.replaceState(null, '', currentUrl);
} else {
  alert('로그인후 접속해주시기 바랍니다.');
}
  return (
    <div className="container">
      <h1>대시보드</h1>
      <p>대시보드 내용은 여기에 표시됩니다.</p>
    </div>
  );
};

export default Dashboard;
