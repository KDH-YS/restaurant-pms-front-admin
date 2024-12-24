import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "../../css/Review.css";

function AdminReview() {
  const [restaurant, setRestaurant] = useState([]);  // 레스토랑 데이터 상태
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  // 페이지네이션
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1); // 현재 페이지
  const [pageGroup, setPageGroup] = useState(0);   // 페이지 그룹 (0부터 시작)
  const buttonsPerPage = 10; // 한 번에 보여줄 페이지 버튼 수

  const [isHighOrder, setIsHighOrder] = useState(true); // true: 내림차순, false: 오름차순

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchRestaurants = async (page = 1, keyword = '', order = 'desc') => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/restaurant?page=${page}&size=20&keyword=${keyword}&order=${order}`
      );
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data.content);
        setTotalPages(data.totalPages);
        setPageNumber(page); // 현재 페이지 업데이트
        console.log(data)
      } else {
        console.error("가게 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("가게 정보를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRestaurants(1, keyword); // 검색 시 첫 페이지로 이동
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
      fetchRestaurants(newPage, keyword); // 새 페이지 데이터 가져오기
    }
  };
  const handleNextGroup = () => {
    if ((pageGroup + 1) * buttonsPerPage < totalPages) {
      const nextPage = (pageGroup + 1) * buttonsPerPage + 1; // 다음 그룹의 첫 페이지
      setPageGroup(pageGroup + 1);
      setPageNumber(nextPage);
      fetchRestaurants(nextPage, keyword); // 새로운 페이지 데이터 가져오기
    }
  };
  const handlePrevGroup = () => {
    if (pageGroup > 0) {
      const prevPage = (pageGroup - 1) * buttonsPerPage + 1; // 이전 그룹의 첫 페이지
      setPageGroup(pageGroup - 1);
      setPageNumber(prevPage);
      fetchRestaurants(prevPage, keyword); // 새로운 페이지 데이터 가져오기
    }
  };
  // 현재 그룹의 시작 페이지와 끝 페이지
  const startPage = pageGroup * buttonsPerPage + 1;
  const endPage = Math.min(startPage + buttonsPerPage - 1, totalPages);

  const handleReviewClick = (restaurantId) => {
    if (typeof restaurantId !== 'string' && typeof restaurantId !== 'number') {
      console.error('Invalid restaurantId:', restaurantId);
      return;
    }
    navigate(`/reviewList/${restaurantId}`); // restaurantId를 경로에 포함
  };
  const handleReportClick = (restaurantId) => {
    if (typeof restaurantId !== 'string' && typeof restaurantId !== 'number') {
      console.error('Invalid restaurantId:', restaurantId);
      return;
    }
    navigate(`/report/${restaurantId}`); // restaurantId를 경로에 포함
  };

  const handleRatingSort = () => {
    const newOrder = !isHighOrder; // 현재 상태 반전
    setIsHighOrder(newOrder);
    fetchRestaurants(1, keyword, newOrder ? "desc" : "asc"); // 정렬 방식 전달
  };
  
  useEffect(() => {
    fetchRestaurants(); // 초기 데이터 로드
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <h3 className="mt-4">리뷰 관리</h3>
          <Form className="d-flex mb-4">
            <Form.Control
              type="text"
              placeholder="키워드로 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              className="ms-2 button-search"
            >
              검색
            </Button>
          </Form>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden"></span>
              </div>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <div>#</div>
                <div>가게명</div>
                <div
                  onClick={handleRatingSort}
                >
                  {isHighOrder ? "별점 높은순" : "별점 낮은순"}
                </div>
                <div>주소</div>
                <div>전화번호</div>
                <div>관리</div>
              </div>
              <div className="table-body">
                {restaurant.length > 0 ? (
                  restaurant.map((item, index) => (
                    <div key={item.restaurantId} className="table-row">
                      <div>{index + 1 + (pageNumber - 1) * 20}</div>
                      <div>{item.name}</div>
                      <div>{item.averageRating || 'N/A'}</div>
                      <div>{item.roadAddr || item.jibunAddr || 'N/A'}</div>
                      <div>{item.phone || 'N/A'}</div>
                      <div className="button-group">
                        <Button
                          variant="primary"
                          className="mb-2"
                          onClick={() => handleReviewClick(item.restaurantId)} // 올바른 값 전달
                        >
                          리뷰관리
                        </Button>
                        <Button variant="danger"
                          onClick={() => handleReportClick(item.restaurantId)}
                        >
                          신고관리
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">데이터가 없습니다.</div>
                )}
              </div>
            </div>
          )}

          {/* 페이지네이션 */}
          <div className="pagination d-flex align-items-center">
          {/* 이전 그룹 버튼 */}
          <Button
            variant="secondary"
            onClick={handlePrevGroup}
            disabled={pageGroup === 0}
            className="me-2"
          >
            이전
          </Button>

          {/* 페이지 번호 */}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <Button
              key={startPage + i}
              variant={pageNumber === startPage + i ? "primary" : "secondary"}
              onClick={() => handlePageChange(startPage + i)}
              className="me-2"
            >
              {startPage + i}
            </Button>
          ))}

          {/* 다음 그룹 버튼 */}
          <Button
            variant="secondary"
            onClick={handleNextGroup}
            disabled={endPage === totalPages}
          >
            다음
          </Button>
        </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminReview;
