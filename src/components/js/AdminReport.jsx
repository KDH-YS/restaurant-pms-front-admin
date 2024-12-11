import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ListGroup, Badge } from "react-bootstrap";
import "../../css/Report.css";

import { restaurantStore } from "../../store/restaurantStore";
import { useParams } from "react-router-dom";

export function AdminReportList() {
  const [reports, setReports] = useState([]);
  const [showReportsCount, setShowReportsCount] = useState(5);
  const [loading, setLoading] = useState(false);

  const { restaurant, setRestaurant } = restaurantStore();
  const [restaurantImg, setRestaurantImg] = useState([]);
  const { restaurantId } = useParams();

  const fetchRestaurantDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/restaurants/${restaurantId}`
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
        `http://localhost:8080/api/js/reports/${restaurantId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
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

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
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
                <ListGroup.Item key={report.reportId} className="js-report-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-0">
                        <strong>{report.user_name || "익명"}</strong>
                      </p>
                      <p className="text-muted small">
                        {formatDate(report.created_at)}
                      </p>
                      <p>{report.review_content || "리뷰 내용이 없습니다."}</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        disabled
                      >
                        {report.reason || "기타"}
                      </Button>
                      <Badge
                        bg={
                          report.status === "처리중"
                            ? "warning"
                            : report.status === "완료"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {report.status || "알 수 없음"}
                      </Badge>
                    </div>
                  </div>
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
    </Container>
  );
}

export default AdminReportList;
