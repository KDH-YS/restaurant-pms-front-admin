import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/AdminMembershipManagement.css";

function AdminMembershipManagement() {

  const [members, setMembers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAuth, setSelectedAuth] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/membership");
      // UserDTO를 받아서 필요한 정보만 추출
      const formattedMembers = response.data.map(user => ({
        userId: user.userId,
        userName: user.userName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        auth: user.authorities && user.authorities.length > 0 ? user.authorities[0].auth : null
      }));
      setMembers(formattedMembers);
    } catch (error) {
      console.error("Error fetching members: ", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get("http://localhost:8080/api/admin/membership", {
        params: { keyword: searchKeyword },
      });
      // 검색 결과도 포맷팅
      const formattedMembers = response.data.map(user => ({
        userId: user.userId,
        userName: user.userName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        auth: user.authorities && user.authorities.length > 0 ? user.authorities[0].auth : null
      }));
      setMembers(formattedMembers);
    } catch (error) {
      console.error("Error searching members:", error);
    }
  };

  const handleShowModal = (userId) => {
    const memberToUpdate = members.find(member => member.userId === userId);
    if (memberToUpdate) {
      setSelectedMember(memberToUpdate);
      setShowModal(true);
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    console.log("selectedMember:", selectedMember); // 상태 확인용

    // authorities 리스트를 업데이트
    const updatedAuthorities = [{
      authNo: null,
      userId: selectedMember.userId,
      auth: selectedAuth,
    }];
    const updatedMember = {
      ...selectedMember,
      auth: selectedAuth,
      authorities: updatedAuthorities,
    };

    console.log("updatedMember: ", updatedMember);

    try {
      await axios.put(`http://localhost:8080/api/admin/membership/${selectedMember.userId}`, updatedMember);

      setMembers(prevMembers =>
        prevMembers.map(member =>
          member.userId === selectedMember.userId ? updatedMember : member
        )
      );

      // 선택된 멤버 상태 업데이트
      setSelectedMember(updatedMember);

      // 모달 닫기
      handleCloseModal();

      // 권한 수정 완료 메시지
      alert("권한이 수정되었습니다.");
    } catch (error) {
      console.error("Error updating member status: ", error);
      alert("권한 수정 중 오류가 발생했습니다.");
    }
  };

  // select 태그의 onChange 이벤트 핸들러
  const handleAuthChange = (event) => {
    setSelectedAuth(event.target.value);
  };

  // 회원 삭제
  const handleDeleteMember = async () => {
    if (selectedMember) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/membership/${selectedMember.userId}`);
        setMembers(members.filter((member) => member.userId !== selectedMember.userId));
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting member: ", error);
      }
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  return(
    <div className="HjAdminMM">
      <h1 className="HjAdminMMTitle">회원 관리</h1>
      <form className="HjAdminMMForm" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="이름 또는 이메일로 검색"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
        <button type="submit">검색</button>
      </form>

      <table className="HjAdminMMTable">
        <thead>
          <tr>
            <th>번호</th>
            <th>유저 번호</th>
            <th>아이디</th>
            <th>이름</th>
            <th>이메일</th>
            <th>휴대폰 번호</th>
            <th>권한</th>
            <th>권한 수정</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.userId}>
              <td>{index + 1}</td>
              <td>{member.userId}</td>
              <td>{member.userName}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.phone}</td>
              <td>{member.auth}</td>
              <td>
                <button 
                type="button" 
                className="HjAdminMMBtn"
                onClick={() => handleShowModal(member.userId)}>
                  수정
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 회원 정보 모달 */}
      {showModal && selectedMember && (
        <div className="HjAdminMMModal">
          <div className="HjAdminMMModalContent">
            <h2>{selectedMember.name}</h2>
            <p>
              <strong>ID:</strong> {selectedMember.userId}
            </p>
            <p>
              <strong>이메일:</strong> {selectedMember.email}
            </p>
            <p>
              <strong>휴대폰 번호:</strong> {selectedMember.phone}
            </p>
            <p>
              <strong>권한:</strong>
              <select
                value={selectedAuth}
                onChange={handleAuthChange}
              >
                <option value="ROLE_ADMIN">관리자</option>
                <option value="ROLE_OWNER">사장님</option>
                <option value="ROLE_USER">일반회원</option>
              </select>
            </p>
            <button onClick={handleUpdateMember}>수정</button>
            <button onClick={handleDeleteMember}>회원 삭제</button>
            <button onClick={handleCloseModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMembershipManagement;