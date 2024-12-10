import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ListGroup, Modal } from "react-bootstrap";
import "../../css/ReviewList.css";

export function AdminReviewList() {
  const [reviews, setReviews] = useState([]);
  const [reviewImages, setReviewImages] = useState({});
  const [restaurant, setRestaurant] = useState({});
  const [restaurantImg, setRestaurantImg] = useState([]);
  const [users, setUsers] = useState({});
  const restaurantId = 1;

  const [showReviewsCount, setShowReviewsCount] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const fetchReviews = async () => {
    setLoading(true); // 로딩 시작
    try {
      const response = await fetch(
        `http://localhost:8080/api/restaurants/${restaurantId}/reviews?userId=1`
      );
      if (response.ok) {
        const data = await response.json();
        const reviewsData = data.reviews.map((reviewData) => ({
          ...reviewData.review,
        }));
        setReviews(reviewsData);
        setReviewImages(data.reviewImages);
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/js/users/${restaurantId}`
      );
      if (response.ok) {
        const data = await response.json();
        const usersData = {};
        data.forEach((user) => {
          if (user && user.userId && user.userName) {
            usersData[user.userId] = user.userName; // userName만 저장
          }
        });
        setUsers(usersData);
      } else {
        console.error("유저 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("유저 정보를 가져오는 중 오류 발생:", error);
    }
  };
  
  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewToDelete}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.reviewId !== reviewToDelete)
        );
        setShowDeleteModal(false);
      } else {
        console.error("리뷰 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 삭제 중 오류 발생:", error);
    }
  };

  const handleShowMoreReviews = () => {
    setShowReviewsCount((prevCount) => prevCount + 5);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchRestaurantDetails();
    fetchReviews();
    fetchUsers(); // 유저 데이터 가져오기
  }, []);

  return (
    <Container>
      <Row className="mb-4 justify-content-center">
        <Col md={8} className="text-center">
          <img
            src={
              restaurantImg.length > 0
                ? restaurantImg[0].imageUrl.trim()
                : "https://via.placeholder.com/100x100"
            }
            alt="Restaurant"
            className="mt-4 img-fluid rounded-circle"
          />
          <h2>{restaurant.name}</h2>
          <p>
            {restaurant.city} {restaurant.district} {restaurant.neighborhood}
          </p>
        </Col>
      </Row>
      <Row className="js-reviews">
        <Col>
          <h3 className="js-section-title">리뷰</h3>
        {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden"></span>
                </div>
              </div>
            ) : (
          <ListGroup>
            {reviews.slice(0, showReviewsCount).map((review) => (
              <ListGroup.Item key={review.reviewId} className="js-review-item">
                <img
                  src={
                    reviewImages[review.reviewId]?.[0]?.imageUrl ||
                    "https://via.placeholder.com/100x100"
                  }
                  alt="리뷰 이미지"
                />
                <div className="js-review-item-content">
                  <p className="mb-0">
                    <strong>{users[review.userId] || "익명"}</strong>
                  </p>
                  <p className="text-muted small">{formatDate(review.createdAt)}</p>
                  <p>{review.reviewContent}</p>
                </div>
                <img
                  src="/icons/xmark.svg"
                  alt="삭제하기"
                  onClick={() => handleDeleteClick(review.reviewId)}
                  className="delete-button"
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
          {reviews.length > showReviewsCount && (
            <Button
              variant="primary"
              onClick={handleShowMoreReviews}
              className="js-more-btn mt-3"
            >
              더보기
            </Button>
          )}
        </Col>
      </Row>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>리뷰 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>리뷰를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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

export default AdminReviewList;
