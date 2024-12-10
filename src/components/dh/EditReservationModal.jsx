import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditReservationModal = ({ show, onHide, reservation, onSave }) => {
  const [request, setRequest] = useState(reservation?.request || '');
  const [status, setStatus] = useState(reservation?.status || '');
  const [reservationTime, setReservationTime] = useState(reservation?.reservationTime || '');

  const handleSave = () => {
    const updatedReservation = {
      ...reservation,
      request,
      status,
      reservationTime,
    };
    onSave(updatedReservation); // 부모 컴포넌트에 저장 요청
    onHide(); // 모달 닫기
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>예약 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>요청사항</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>상태</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELREQUEST">CANCELREQUEST</option>
              <option value="CANCELLED">CANCELLED</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>예약 시간</Form.Label>
            <Form.Control
              type="datetime-local"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSave}>
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditReservationModal;
