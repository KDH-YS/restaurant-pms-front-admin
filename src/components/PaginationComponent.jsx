import React from 'react';
import { Pagination } from 'react-bootstrap';
import usePaginationStore from 'store/usePaginationStore';

// PaginationComponent는 페이지네이션 UI를 렌더링하고 동작을 제어하는 컴포넌트입니다.
const PaginationComponent = ({ onPageChange }) => {
  // `usePaginationStore`를 사용하여 현재 페이지, 총 페이지 수, 페이지 그룹 등을 가져옵니다.
  const { currentPage, totalPages, pageGroup, setCurrentPage, setPageGroup } = usePaginationStore();

  // 페이지네이션 UI를 생성하는 함수입니다.
  const handlePagination = () => {
    // 현재 페이지 그룹의 시작 페이지와 끝 페이지를 계산합니다.
    const pageStart = (pageGroup - 1) * 5 + 1; // 페이지 그룹의 첫 번째 페이지
    const pageEnd = Math.min(pageStart + 4, totalPages); // 페이지 그룹의 마지막 페이지 (총 페이지 수를 초과하지 않도록 제한)

    // 이전 페이지 그룹으로 이동하는 함수입니다.
    const handlePrevGroup = () => {
      if (pageGroup > 1) { // 현재 페이지 그룹이 1보다 크면 이전 그룹으로 이동 가능
        const newPageGroup = pageGroup - 1; // 이전 페이지 그룹
        setPageGroup(newPageGroup); // 페이지 그룹 상태를 업데이트
        setCurrentPage(newPageGroup * 5); // 새로운 페이지 그룹의 마지막 페이지로 이동
        onPageChange(newPageGroup * 5); // 부모 컴포넌트에 페이지 변경 이벤트 알림
      }
    };

    // 다음 페이지 그룹으로 이동하는 함수입니다.
    const handleNextGroup = () => {
      if (pageGroup * 5 < totalPages) { // 현재 페이지 그룹이 총 페이지 수를 초과하지 않으면 다음 그룹으로 이동 가능
        const newPageGroup = pageGroup + 1; // 다음 페이지 그룹
        setPageGroup(newPageGroup); // 페이지 그룹 상태를 업데이트
        setCurrentPage((newPageGroup - 1) * 5 + 1); // 새로운 페이지 그룹의 첫 번째 페이지로 이동
        onPageChange((newPageGroup - 1) * 5 + 1); // 부모 컴포넌트에 페이지 변경 이벤트 알림
      }
    };

    // 페이지네이션 UI 요소를 반환합니다.
    return (
      <>
        {/* 이전 그룹으로 이동 버튼 */}
        <Pagination.Prev
          disabled={pageGroup === 1} // 페이지 그룹이 첫 번째 그룹일 경우 비활성화
          onClick={handlePrevGroup} // 클릭 시 이전 그룹으로 이동
        />
        {/* 현재 페이지 그룹 내 페이지 번호를 렌더링 */}
        {[...Array(pageEnd - pageStart + 1)].map((_, index) => (
          <Pagination.Item
            key={pageStart + index} // 페이지 번호를 키로 사용
            active={pageStart + index === currentPage} // 현재 페이지인 경우 활성화 표시
            onClick={() => {
              setCurrentPage(pageStart + index); // 클릭한 페이지를 현재 페이지로 설정
              onPageChange(pageStart + index); // 부모 컴포넌트에 페이지 변경 이벤트 알림
            }}
          >
            {pageStart + index} {/* 페이지 번호 출력 */}
          </Pagination.Item>
        ))}
        {/* 다음 그룹으로 이동 버튼 */}
        <Pagination.Next
          disabled={pageGroup * 5 >= totalPages} // 현재 페이지 그룹이 마지막 그룹일 경우 비활성화
          onClick={handleNextGroup} // 클릭 시 다음 그룹으로 이동
        />
      </>
    );
  };

  // 최종적으로 Pagination 컴포넌트를 렌더링합니다.
  return (
    <Pagination>
      {handlePagination()} {/* 페이지네이션 UI를 포함 */}
    </Pagination>
  );
};

export default PaginationComponent;
