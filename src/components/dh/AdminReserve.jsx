import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Modal, Col, Row } from 'react-bootstrap';
import PaginationComponent from '../PaginationComponent';
import usePaginationStore from 'store/usePaginationStore';
const AdminReserve = () => {
  // 상태 관리
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  // 페이지네이션 상태 관리
  const { currentPage, setCurrentPage, setTotalPages, pageGroup } = usePaginationStore();
  const itemsPerPage = 8;
  const itemsPerGroup = 40;

  // 레스토랑 데이터 가져오기
  const fetchRestaurants = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/restaurants?name=${searchTerm}&page=${pageGroup}&size=${itemsPerGroup}`
      );
      const data = await response.json();
      setRestaurants(data.list);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error('레스토랑 데이터 가져오기 오류:', error);
    }
  };

  // 페이지 그룹이 변경될 때마다 레스토랑 데이터 가져오기
  useEffect(() => {
    fetchRestaurants();
  }, [pageGroup]);

  // 검색 처리
  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    fetchRestaurants();
  };

  // 레스토랑 선택 처리
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    // 임시 예약 데이터 (실제 구현 시 API에서 가져와야 함)
    const mockReservations = [
      { id: 1, name: '김철수', date: '2023-06-15', time: '18:00', guests: 2, status: '확인됨' },
      { id: 2, name: '이영희', date: '2023-06-16', time: '19:30', guests: 4, status: '대기 중' },
    ];
    setReservations(mockReservations);
  };

  // 예약 수정 처리
  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setShowModal(true);
  };

  // 예약 삭제 처리
  const handleDelete = (id) => {
    setReservations(reservations.filter((reservation) => reservation.id !== id));
    alert('예약이 삭제되었습니다.');
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReservation(null);
  };

  // 예약 수정 저장
  const handleSaveEdit = (event) => {
    event.preventDefault();
    const form = event.target;
    const updatedReservation = {
      ...editingReservation,
      name: form.name.value,
      date: form.date.value,
      time: form.time.value,
      guests: parseInt(form.guests.value),
      status: form.status.value,
    };

    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === updatedReservation.id ? updatedReservation : reservation
      )
    );

    handleCloseModal();
    alert('예약이 수정되었습니다.');
  };

  // 현재 페이지에 표시할 레스토랑 목록
  const currentRestaurants = restaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-4">
      <h1 className="mb-4">레스토랑 예약 관리</h1>
      
      {/* 검색 폼 */}
      <Form className="mb-3" onSubmit={handleSearch}>
        <Row className="align-items-center">
          <Col xs={11}>
            <Form.Control
              type="text"
              placeholder="레스토랑 이름 입력"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={1}>
            <Button variant="primary" type="submit" className="w-100">
              검색
            </Button>
          </Col>
        </Row>
      </Form>

      {/* 레스토랑 목록 */}
      {currentRestaurants.length > 0 && (
        <Table striped bordered hover className="mb-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>도로명 주소</th>
              <th>지번 주소</th>
              <th>상세 주소</th>
            </tr>
          </thead>
          <tbody>
            {currentRestaurants.map((restaurant) => (
              <tr
                key={restaurant.restaurantId}
                onClick={() => handleRestaurantSelect(restaurant)}
              >
                <td>{restaurant.restaurantId}</td>
                <td>{restaurant.name}</td>
                <td>{restaurant.phone}</td>
                <td>{restaurant.roadAddr}</td>
                <td>{restaurant.jibunAddr}</td>
                <td>{restaurant.detailAddr}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* 페이지네이션 */}
      <PaginationComponent onPageChange={setCurrentPage} />

      {/* 선택된 레스토랑의 예약 목록 */}
      {selectedRestaurant && (
        <>
          <h2 className="mb-3">{selectedRestaurant.name} 예약 목록</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>예약 번호</th>
                <th>이름</th>
                <th>날짜</th>
                <th>시간</th>
                <th>인원</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.name}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.time}</td>
                  <td>{reservation.guests}</td>
                  <td>{reservation.status}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(reservation)}
                    >
                      수정
                    </Button>{' '}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(reservation.id)}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* 예약 수정 모달 */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>예약 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveEdit}>
            <Form.Group className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                name="name"
                defaultValue={editingReservation?.name}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>날짜</Form.Label>
              <Form.Control
                type="date"
                name="date"
                defaultValue={editingReservation?.date}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>시간</Form.Label>
              <Form.Control
                type="time"
                name="time"
                defaultValue={editingReservation?.time}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>인원</Form.Label>
              <Form.Control
                type="number"
                name="guests"
                defaultValue={editingReservation?.guests}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>상태</Form.Label>
              <Form.Control
                type="text"
                name="status"
                defaultValue={editingReservation?.status}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              저장
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminReserve;