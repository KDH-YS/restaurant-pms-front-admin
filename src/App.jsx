import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import ManageRestaurants from './pages/ManageRestaurants';
import ManageReservations from './pages/ManageReservations';
import ManageReviews from './pages/ManageReviews';
import ManageReports from './pages/ManageReports';
import ManageBoards from './pages/ManageBoards';
import Reservationlistpage from 'pages/ReservationListpage';
import 'admin-lte/dist/css/adminlte.min.css';
import AdminReviewList from './components/js/AdminReviewList';
import AdminReport from './components/js/AdminReport';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/manage-restaurants" element={<ManageRestaurants />} />
            <Route path="/manage-reservations" element={<ManageReservations />} />
            <Route path="/manage-reviews" element={<ManageReviews />} />
            <Route path="/reviewList/:restaurantId" element={<AdminReviewList />} />
            <Route path="/report/:restaurantId" element={<AdminReport />} />
            <Route path="/manage-reports" element={<ManageReports />} />
            <Route path="/manage-boards" element={<ManageBoards />} />
            <Route path="/manager-reservations/reservations" element={<Reservationlistpage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

