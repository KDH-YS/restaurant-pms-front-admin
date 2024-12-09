import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import "../../css/Review.css";

function AdminReview() {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([
    { id: 1, name: '레스토랑 1', rating: '★★★★★', reviews: 10, likes: 10 },
    { id: 2, name: '레스토랑 2', rating: '★★★★★', reviews: 10, likes: 10 },
  ]);

  const handleSearch = () => {
    console.log(`Searching for: ${keyword}`);
  };

  return (
    <Container fluid>
      <Row className="my-4">
        <Col md={10}>
          <Form className="d-flex mb-4">
            <Form.Control
              type="text"
              placeholder="키워드"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearch} className="ms-2 button-search">
              검색
            </Button>
          </Form>
          <div className="table-container">
            <div className="table-header">
              <div>#</div>
              <div>가게명</div>
              <div>별점</div>
              <div>리뷰 수</div>
              <div>신고 수</div>
              <div>관리</div>
            </div>
            <div className="table-body">
              {data.map((item, index) => (
                <div key={item.id} className="table-row">
                  <div>{index + 1}</div>
                  <div>{item.name}</div>
                  <div>{item.rating}</div>
                  <div>{item.reviews}</div>
                  <div>{item.likes}</div>
                  <div className="button-group">
                    <Button variant="primary" className="mb-2">
                      리뷰관리
                    </Button>
                    <Button variant="danger">
                      신고관리
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminReview;
