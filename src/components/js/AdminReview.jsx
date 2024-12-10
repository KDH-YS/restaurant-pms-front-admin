import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../../css/Review.css";

function AdminReview() {
  const [restaurants, setRestaurants] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = async (page = 1, keyword = '') => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/restaurant?page=${page}&size=20&keyword=${keyword}`
      );
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.content);
        setTotalPages(data.totalPages);
        setPageNumber(page); // 현재 페이지 업데이트
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
    fetchRestaurants(newPage, keyword);
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
                <div>별점</div>
                <div>주소</div>
                <div>전화번호</div>
                <div>관리</div>
              </div>
              <div className="table-body">
                {restaurants.length > 0 ? (
                  restaurants.map((item, index) => (
                    <div key={item.restaurantId} className="table-row">
                      <div>{index + 1 + (pageNumber - 1) * 20}</div>
                      <div>{item.name}</div>
                      <div>{item.averageRating || 'N/A'}</div>
                      <div>{item.roadAddr || item.jibunAddr || 'N/A'}</div>
                      <div>{item.phone || 'N/A'}</div>
                      <div className="button-group">
                        <Link to={`/reviewList`}>
                          <Button variant="primary" className="mb-2">
                            리뷰관리
                          </Button>
                        </Link>
                        <Button variant="danger">신고관리</Button>
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
          <div className="pagination">
            {Array.from({ length: 10 }, (_, i) => (
              <Button
                key={i + 1}
                variant={pageNumber === i + 1 ? 'primary' : 'secondary'}
                onClick={() => handlePageChange(i + 1)}
                className="me-2"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminReview;
