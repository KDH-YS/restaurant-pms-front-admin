import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/AdminMembershipManagement.css";

function AdminMembershipManagement() {

  const [members, setMembers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("/api/admin/membership");
      // UserDTO를 받아서 필요한 정보만 추출
      const formattedMembers = response.data.map(user => ({
        id: user.userName,
        name: user.name,
        email: user.email,
        userType: user.userType
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
      const response = await axios.get("/api/admin/membership", {
        params: { keyword: searchKeyword },
      });
      // 검색 결과도 포맷팅
      const formattedMembers = response.data.map(user => ({
        id: user.userName,
        name: user.name,
        email: user.email,
        userType: user.userType
      }));
      setMembers(formattedMembers);
    } catch (error) {
      console.error("Error searching members:", error);
    }
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  const handleStatusChange = async (event) => {
    const updatedMember = {
      ...selectedMember,
      userType: event.target.value,
    };
    try {
      await axios.put(`/api/admin/membership/${selectedMember.id}`, updatedMember);
      setSelectedMember(updatedMember);
      setMembers(
        members.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );
    } catch (error) {
      console.error("Error updating member status:", error);
    }
  };

  const handleDeleteMember = async () => {
    //회원 삭제
    if (selectedMember) {
      try {
        await axios.delete(`/api/admin/membership/${selectedMember.id}`);
        setMembers(members.filter((member) => member.id !== selectedMember.id));
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting member: ", error);
      }
    }
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
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>권한</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} onClick={() => handleMemberClick(member)}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.userType}</td>
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
              <strong>ID:</strong> {selectedMember.id}
            </p>
            <p>
              <strong>이메일:</strong> {selectedMember.email}
            </p>
            <p>
              <strong>상태:</strong>
              <select
                value={selectedMember.userType}
                onChange={handleStatusChange}
              >
                <option value="CUSTOMER">관리자</option>
                <option value="OWNER">사장님</option>
                <option value="USER">일반회원</option>
              </select>
            </p>
            <button onClick={handleDeleteMember}>회원 삭제</button>
            <button onClick={handleCloseModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMembershipManagement;