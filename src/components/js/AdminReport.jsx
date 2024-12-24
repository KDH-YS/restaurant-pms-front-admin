import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ListGroup, Badge, Modal } from "react-bootstrap";
import "../../css/Report.css";

import { restaurantStore } from "../../store/restaurantStore";
import { useParams } from "react-router-dom";

export function AdminReportList() {
  const [reports, setReports] = useState([]);
  const [showReportsCount, setShowReportsCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const { restaurant, setRestaurant } = restaurantStore();
  const [restaurantImg, setRestaurantImg] = useState([]);
  const { restaurantId } = useParams();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchRestaurantDetails = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/restaurants/${restaurantId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data.restaurant);
        setRestaurantImg(data.restaurantImg);
      }
    } catch (error) {
      console.error("가게 정보를 가져오는 중 오류 발생:", error);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/js/reports/${restaurantId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setReports(data);
      } else {
        console.error("신고 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("신고 정보를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/reports/${reportToDelete}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setReports((prevReports) =>
          prevReports.filter((report) => report.reportId !== reportToDelete)
        );
        setShowDeleteModal(false);
      } else {
        console.error("신고 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("신고 삭제 중 오류 발생:", error);
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const reasonToKorean = (reason) => {
    switch (reason) {
      case "INAPPROPRIATE":
        return "부적절한 내용";
      case "FAKE":
        return "허위 정보";
      case "OFFENSIVE":
        return "모욕적인 내용";
      case "OTHER":
        return "기타";
      default:
        return "알 수 없음";
    }
  };
  
  const statusToKorean = (status) => {
    switch (status) {
      case "PENDING":
        return "대기 중";
      case "PROCESSED":
        return "처리 완료";
      case "REJECTED":
        return "거부됨";
      default:
        return "알 수 없음";
    }
  };
  useEffect(() => {
    fetchRestaurantDetails();
    fetchReports();
  }, [restaurantId]);

  return (
    <Container>
      <Row className="mb-4 justify-content-center">
        <Col md={3} className="text-center">
          <img
            src={
              restaurantImg.length > 0
                ? restaurantImg[0].imageUrl.trim()
                : "https://via.placeholder.com/100x100"
            }
            alt="Restaurant"
            className="mt-4 img-fluid rounded-circle"
          />
          <h2>{restaurant?.name || "가게 정보 없음"}</h2>
          <p>
            {restaurant?.city || ""} {restaurant?.district || ""}{" "}
            {restaurant?.neighborhood || ""}
          </p>
        </Col>
      </Row>
      <Row className="js-reports">
        <Col>
          <h3 className="js-section-title">신고 관리</h3>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden"></span>
              </div>
            </div>
          ) : reports.length > 0 ? (
            <ListGroup>
              {reports.slice(0, showReportsCount).map((report) => (
                <ListGroup.Item
                  key={report.reportId}
                  className="js-report-item position-relative"
                >
                  <Button
                    variant="danger"
                    size="sm"
                    className="delete-button"
                    onClick={() => {
                      setReportToDelete(report.reportId);
                      setShowDeleteModal(true);
                    }}
                  >
                    삭제
                  </Button>
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ width: "66%" }}>
                      <strong>{report.user_name || "익명"}</strong>
                      <p className="text-muted small">
                        {formatDate(report.created_at)}
                      </p>
                      <p>{report.review_content || "리뷰 내용이 없습니다."}</p>
                    </div>
                    <Badge
                      bg={
                        report.status === "PENDING"
                          ? "secondary"
                          : report.status === "PROCESSED"
                          ? "Primary"
                          : "Warning"
                      }
                    >
                      {statusToKorean(report.status)}
                    </Badge>
                  </div>
                  <hr />
                  <p>
                    <strong>신고 사유: </strong>
                    {reasonToKorean(report.reason)}
                  </p>
                  <p>
                    <strong>신고 내용: </strong>
                    {report.report_description}
                  </p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="no-data text-center mt-4">
              <p>신고가 없습니다.</p>
            </div>
          )}
          {reports.length > showReportsCount && (
            <Button
              variant="primary"
              onClick={() => setShowReportsCount((prev) => prev + 5)}
              className="js-more-btn mt-3"
            >
              더보기
            </Button>
          )}
        </Col>
      </Row>

      {/* 삭제 확인 모달 */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>신고 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          정말로 이 신고를 삭제하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            아니요
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            예
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminReportList;
