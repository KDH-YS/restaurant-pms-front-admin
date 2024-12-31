import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const token = sessionStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  
  const [stats, setStats] = useState({
    restaurants: 0,
    reservations: 0,
    reviews: 0,
    users: 0,
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [reservationStats, setReservationStats] = useState([]);
  const [chartType, setChartType] = useState('weekly');

  const DashBoardCount = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReservationStats = async (type) => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      let formattedData;
      switch(type) {
        case 'daily':
          formattedData = response.data.map(item => {
            const [year, month, day] = item.date.split('-');
            return {
              name: `${month}-${day}`,
              예약수: item.count
            };
          });
          break;
        case 'weekly':
          formattedData = response.data.map(item => {
            const date = new Date(item.week.slice(0, 4), 0, 1);
            date.setDate(date.getDate() + (item.week.slice(-2) - 1) * 7);
            const month = date.getMonth() + 1;
            return {
              name: `${month}월 ${Math.ceil(date.getDate() / 7)}주째`,
              예약수: item.count
            };
          });
          break;
        case 'monthly':
          formattedData = response.data.map(item => ({
            name: `${item.month.split('-')[1]}월`,
            예약수: item.count
          }));
          break;
        default:
          formattedData = [];
      }
      
      setReservationStats(formattedData);
    } catch (error) {
      console.error(`Failed to fetch ${type} reservation stats:`, error);
    }
  };

  useEffect(() => {
    DashBoardCount();
    fetchReservationStats('weekly');

    setRecentReviews([
      { id: 1, restaurantName: '맛있는 식당', rating: 4.5, content: '정말 맛있었어요!' },
      { id: 2, restaurantName: '분위기 좋은 카페', rating: 4.0, content: '분위기가 너무 좋았습니다.' },
      { id: 3, restaurantName: '신선한 해산물', rating: 5.0, content: '해산물이 아주 신선해요.' },
    ]);
  }, []);

  const handleChartTypeChange = (type) => {
    setChartType(type);
    fetchReservationStats(type);
  };

  return (
    <Container fluid className="mt-4">
      <h1 className="mb-4">관리자 대시보드</h1>

      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>총 레스토랑</Card.Title>
              <Card.Text>{stats.restaurants}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>총 예약</Card.Title>
              <Card.Text>{stats.reservations}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>총 리뷰</Card.Title>
              <Card.Text>{stats.reviews}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>총 사용자</Card.Title>
              <Card.Text>{stats.users}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>예약 통계</Card.Title>
              <div className="mb-3">
                <Button
                  onClick={() => handleChartTypeChange('daily')}
                  variant={chartType === 'daily' ? 'primary' : 'outline-primary'}
                  className="me-2"
                >
                  일별
                </Button>
                <Button
                  onClick={() => handleChartTypeChange('weekly')}
                  variant={chartType === 'weekly' ? 'primary' : 'outline-primary'}
                  className="me-2"
                >
                  주별
                </Button>
                <Button
                  onClick={() => handleChartTypeChange('monthly')}
                  variant={chartType === 'monthly' ? 'primary' : 'outline-primary'}
                >
                  월별
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={370}>
                <BarChart data={reservationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="예약수" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>최근 리뷰</Card.Title>
              {recentReviews.map(review => (
                <div key={review.id} className="mb-2">
                  <h6>{review.restaurantName}</h6>
                  <p>평점: {review.rating}</p>
                  <p>{review.content}</p>
                  <hr />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;

