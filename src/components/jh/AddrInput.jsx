import { useEffect, useState } from 'react';
import { Button, Modal, Form, InputGroup, FormControl, Col, Row } from 'react-bootstrap'; // named import
import DaumPostcode from 'react-daum-postcode';  // 올바른 import 확인

const AddrInput = ({ address,setAddressData }) => {
// 우편번호, 도로명 주소, 지번 주소, 상세 주소 상태를 관리
const [postalCode, setPostalCode] = useState(address?.postalCode || ""); 
const [jibunAddr, setJibunAddr] = useState(address?.jibunAddr || ""); 
const [roadAddr, setRoadAddr] = useState(address?.roadAddr || ""); 
const [detailAddr, setDetailAddr] = useState(address?.detailAddr || ""); // 부모로부터 받은 값으로 detailAddr 초기화
const [city, setCity] = useState(address?.city || ""); 
const [district, setDistrict] = useState(address?.district || ""); 
const [neighborhood, setNeighborhood] = useState(address?.neighborhood || ""); 
const [isOpenAddr, setIsOpenAddr] = useState(false); // 모달 상태
  
    const themeObj = {
        postcodeTextColor: "#FA7142",
        emphTextColor: "#333333",
    };
    const style = {
        width: "100%",
        height: "400px",
        border: "1px solid #333333",
    };

    useEffect(() => {
        if (address) {
            setPostalCode(address.postalCode || "");
            setJibunAddr(address.jibunAddr || "");
            setRoadAddr(address.roadAddr || "");
            setDetailAddr(address.detailAddr || "");
            setCity(address.city || "");    // sido 값 초기화
            setDistrict(address.district || ""); // sigungu 값 초기화
            setNeighborhood(address.neighborhood || ""); // sigungu 값 초기화
        }
    }, [address]);

    const handleOpenAddr = () => {
        setIsOpenAddr((current) => !current); // 모달 열고 닫기
    };

    const selectAddr = (data) => {
        // 지번 주소가 있으면 jibunAddr, 없으면 autoJibunAddress 사용
        const selectedJibunAddr = data.jibunAddress || data.autoJibunAddress;
 
        setPostalCode(data.zonecode);
        setCity(data.sido); // sido 값을 추가
        setDistrict(data.sigungu || ""); // sigungu 값을 추가
        setNeighborhood(data.bname || ""); // bname이 없으면 빈 문자열로 설정

       setJibunAddr(selectedJibunAddr);
        setRoadAddr(data.roadAddress);

        setIsOpenAddr(false); // 주소 선택 후 모달 닫기

        // 주소가 수정되면 상위 컴포넌트로 업데이트
        setAddressData({
            postalCode: data.zonecode,
            roadAddr: data.roadAddress,
            jibunAddr: selectedJibunAddr,
            detailAddr: detailAddr,
            city: data.sido,      // sido는 city로 매핑
            district: data.sigungu || "", // sigungu는 district로 매핑
            neighborhood: data.bname || "" // sigungu는 district로 매핑
        });
        // 콘솔 로그로 데이터를 확인
        // console.log(data);
        };
    
       // useEffect를 사용하여 상태가 변경될 때마다 부모로 값을 전달
       useEffect(() => {
        setAddressData({
            postalCode,
            jibunAddr,
            roadAddr,
            detailAddr, // detailAddr의 최신 값 전달
            city, // sido 값을 부모에게 전달
            district, // sigungu 값을 부모에게 전달
            neighborhood // sigungu 값을 부모에게 전달
        });
    }, [postalCode, jibunAddr, roadAddr, detailAddr, city, district,neighborhood]); // 상태 변경 시마다 실행


    return (
        <div>
         <Form>
        <Row className="mb-3">
          {/* 우편번호 입력 필드 */}
          <Col md={6} sm={6}>
            <Form.Group controlId="zonecode">
              <Form.Label>우편번호</Form.Label>
              <InputGroup>
                <FormControl
                  value={postalCode}
                  readOnly
                  placeholder="우편번호"
                  aria-label="우편번호"
                />
                <Button variant="outline-secondary" onClick={handleOpenAddr}>
                  검색
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          {/* 도로명 주소 입력 필드 */}
          <Col md={6} sm={6}>
            <Form.Group controlId="address_kakao">
              <Form.Label>도로명 주소</Form.Label>
              <FormControl
                value={roadAddr}
                readOnly
                placeholder="도로명 주소"
              />
            </Form.Group>
          </Col>

          {/* 지번 주소 입력 필드 */}
          <Col md={6} sm={6}>
            <Form.Group controlId="address_kakao">
              <Form.Label>지번 주소</Form.Label>
              <FormControl
                value={jibunAddr}
                readOnly
                placeholder="지번 주소"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* 모달에서 주소 검색 */}
        {isOpenAddr && (
          <Modal
            show={isOpenAddr}
            onHide={handleOpenAddr} // 모달 닫기
          >
            <Modal.Header closeButton>
              <Modal.Title>주소 검색</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <DaumPostcode
                theme={themeObj}
                style={style}
                onComplete={selectAddr}
                autoClose={false} // 값 선택 시 모달 자동 닫힘 방지
              />
            </Modal.Body>
          </Modal>
        )}

        <Row className="mb-3">
          {/* 상세 주소 입력 필드 */}
          <Col md={12} sm={12}>
            <Form.Group controlId="detailAddress">
              <Form.Label>상세 주소</Form.Label>
              <FormControl
                value={detailAddr}
                onChange={(e) => setDetailAddr(e.target.value)}
                placeholder="상세 주소"
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
        </div>
    );
};

export default AddrInput;
