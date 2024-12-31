import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';
import PaginationComponent from 'components/PaginationComponent';
import usePaginationStore from 'store/usePaginationStore';
import { restaurantStore } from 'store/restaurantStore';
import axios from 'axios';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { currentPage, setCurrentPage, setTotalPages } = usePaginationStore();
  const itemsPerPage = 10;
  const { restaurant } = restaurantStore();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const token = sessionStorage.getItem('token');

  // 모달 관련 상태
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  
  useEffect(() => {
    fetchReservations();
  }, [restaurant.restaurantId]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/reservations/manager/${restaurant.restaurantId}?page=${currentPage}&size=${itemsPerPage}`
      );
      const data = await response.json();
      console.log(data)
      setReservations(data.list);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error('예약 데이터 가져오기 오류:', error);
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setShowModal(true);
  };

  const handleDelete = async (reservationId) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/reservations/manager/${reservationId}`,
        {
          method: 'DELETE',
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        alert('예약이 취소되었습니다.');
        fetchReservations();
      } else {
        alert('예약 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 취소 오류:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReservation(null);
  };

  const handleSaveEdit = async () => {
    try {
      // 예약 데이터를 객체 형태로 준비
      const updatedReservation = {
        reservationId: editingReservation?.reservationId ,// 수정하려는 예약의 ID
        status: editingReservation?.status,
        request: editingReservation?.request,
        reservationTime: editingReservation?.reservationTime,
        numberOfPeople: editingReservation?.numberOfPeople,
      };
      
      // PUT 요청 보내기
      const response = await axios.put(
        `${apiUrl}/api/reservations`,
        updatedReservation,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // 필요한 경우 토큰을 여기에 추가
            'Content-Type': 'application/json', // JSON 데이터 형식 명시
          },
        }
      );
  
      // 성공적으로 업데이트된 경우
      if (response.status === 200) {
        // 성공적으로 업데이트된 경우
        console.log('Reservation updated successfully:', response.data);
        alert('예약이 성공적으로 수정되었습니다.');
        fetchReservations();  // 수정 후 예약 리스트를 다시 불러옵니다.
        handleCloseModal();  // 모달 닫기
      } else {
        alert('예약 수정에 실패했습니다.');
      }
    } catch (error) {
      // 에러 처리
      console.error('Error updating reservation:', error);
      alert('예약 업데이트 중 오류가 발생했습니다.');
    }
  };

  const statusLabels = {
    CANCELREQUEST: '취소 요청',
    COMPLETE: '방문 완료',
    RESERVING: '예약 중',
    PENDING: '결제 대기중',
    NOSHOW: '노쇼',
  };
console.log(reservations)
return (
  <Container className="mt-4">
    <h1 className="mb-4">{restaurant.name} 예약 관리</h1>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>예약 번호</th>
          <th>이메일</th>
          <th>이름</th>
          <th>날짜</th>
          <th>연락처</th>
          <th>인원</th>
          <th>상태</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {reservations.length === 0 ? (
          <tr>
            <td colSpan="8" className="text-center">
              현재 예약이 없습니다.
            </td>
          </tr>
        ) : (
          reservations.map((reservation) => (
            <tr key={reservation.reservationId}>
              <td>{reservation.reservationId}</td>
              <td>{reservation.user?.email || 'N/A'}</td>
              <td>{reservation.user?.name || 'N/A'}</td>
              <td>{reservation.reservationTime}</td>
              <td>{reservation.user?.phone || 'N/A'}</td>
              <td>{reservation.numberOfPeople}</td>
              <td>{statusLabels[reservation.status]}</td>
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
                  onClick={() => handleDelete(reservation.reservationId)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
    <PaginationComponent onPageChange={handlePageChange} />
    <Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>예약 수정</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* 상태 필드 */}
      <Form.Group className="mb-3">
        <Form.Label>상태</Form.Label>
        <Form.Select
          value={editingReservation?.status || ''}
          onChange={(e) =>
            setEditingReservation({
              ...editingReservation,
              status: e.target.value,
            })
          }
        >
          <option value="">상태를 선택하세요</option>
          <option value="RESERVING">예약 중</option>
          <option value="COMPLETE">방문 완료</option>
          <option value="PENDING">결제 대기 중</option>
          <option value="NOSHOW">노쇼</option>
        </Form.Select>
      </Form.Group>
      {/* 요청사항 */}
      <Form.Group className="mb-3">
        <Form.Label>요청사항</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={editingReservation?.request || ''}
          onChange={(e) =>
            setEditingReservation({
              ...editingReservation,
              request: e.target.value,
            })
          }
        />
      </Form.Group>
      {/* 예약 시간 */}
      <Form.Group className="mb-3">
        <Form.Label>예약 시간</Form.Label>
        <Form.Control
          type="datetime-local"
          value={
            editingReservation?.reservationTime
              ? editingReservation.reservationTime.slice(0, 16)
              : ''
          }
          onChange={(e) =>
            setEditingReservation({
              ...editingReservation,
              reservationTime: e.target.value,
            })
          }
        />
      </Form.Group>
      {/* 인원 */}
      <Form.Group className="mb-3">
        <Form.Label>인원</Form.Label>
        <Form.Control
          type="number"
          value={editingReservation?.numberOfPeople || ''}
          onChange={(e) =>
            setEditingReservation({
              ...editingReservation,
              numberOfPeople: parseInt(e.target.value, 10),
            })
          }
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      취소
    </Button>
    <Button variant="primary" onClick={handleSaveEdit}>
      저장
    </Button>
  </Modal.Footer>
</Modal>

  </Container>
);
};
export default ReservationList;
