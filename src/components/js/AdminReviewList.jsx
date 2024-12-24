import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ListGroup, Modal } from "react-bootstrap";
import "../../css/ReviewList.css";

import { restaurantStore } from '../../store/restaurantStore';
import { useParams } from "react-router-dom";

export function AdminReviewList() {
  const [reviews, setReviews] = useState([]);
  const [reviewImages, setReviewImages] = useState({});
  const [restaurantImg, setRestaurantImg] = useState([]);
  const [users, setUsers] = useState({});

  const [showReviewsCount, setShowReviewsCount] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const { restaurant, setRestaurant } = restaurantStore();
  const { restaurantId } = useParams();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchRestaurantDetails = async () => {
    if (restaurantId) {
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
    }
  };

  const fetchReviews = async () => {
    if (restaurantId) {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/api/restaurants/${restaurantId}/reviews?userId=1`
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
        setLoading(false);
      }
    }
  };

  const fetchUsers = async () => {
    if (restaurantId) {
      try {
        const response = await fetch(
          `${apiUrl}/api/js/users/${restaurantId}`
        );
        if (response.ok) {
          const data = await response.json();
          const usersData = {};
          data.forEach((user) => {
            if (user && user.userId && user.userName) {
              usersData[user.userId] = user.userName;
            }
          });
          setUsers(usersData);
        } else {
          console.error("유저 정보를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("유저 정보를 가져오는 중 오류 발생:", error);
      }
    }
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/reviews/${reviewToDelete}`,
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
    if (restaurantId) {
      fetchRestaurantDetails();
      fetchReviews();
      fetchUsers();
    }
  }, [restaurantId]);

  return (
    <Container>
      {restaurant && (
        <>
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
              <h2>{restaurant.name || "가게 정보 없음"}</h2>
              <p>
                {restaurant?.city || ""} {restaurant?.district || ""}{" "}
                {restaurant?.neighborhood || ""}
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
              ) : reviews.length > 0 ? (
                <ListGroup>
                  {reviews.slice(0, showReviewsCount).map((review) => (
                    <ListGroup.Item key={review.reviewId} className="js-review-item">
                      <div className="js-review-item-content" style={{ width: "66%" }}>
                        <p className="mb-0">
                          <strong>{users[review.userId] || "익명"}</strong>
                        </p>
                        <p className="text-muted small">{formatDate(review.createdAt)}</p>
                        {/* 리뷰 이미지가 있는 경우에만 이미지 렌더링 */}
                        {reviewImages[review.reviewId] && reviewImages[review.reviewId].length > 0 && (
                          <img
                            src={reviewImages[review.reviewId][0].imageUrl}
                            alt="리뷰 이미지"
                            className="review-image mb-2"
                          />
                        )}
                        <p>{review.reviewContent}</p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        className="delete-button"
                        onClick={() => {
                          setReviewToDelete(review.reviewId);
                          setShowDeleteModal(true);
                        }}
                      >
                        삭제
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="no-data text-center mt-4">
                  <p>리뷰가 없습니다.</p>
                </div>
              )}
              {reviews.length > showReviewsCount && reviews.length > 0 && (
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
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
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
        </>
      )}
    </Container>
  );
}

export default AdminReviewList;