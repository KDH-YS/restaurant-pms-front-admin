import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지 범위 계산 (최대 10개 페이지 버튼을 보여주기 위한 함수)
  const calculatePageRange = (currentPage, totalPages) => {
    const pagesToShow = 10;  // 최대 10개까지 페이지를 보이게 한다
    const leftRange = 4; // 왼쪽 4 페이지
    const rightRange = 5; // 오른쪽 5 페이지
    let startPage = currentPage - leftRange; // 시작은 현재에서 왼쪽 4
    let endPage = currentPage + rightRange; // 끝은 현재에서 오른쪽 5

    if (startPage <= 0) {
      startPage = 1;
      endPage = Math.min(pagesToShow, totalPages);
    }
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - pagesToShow + 1);
    }

    return [startPage, endPage];
  };

  // 페이지 범위 계산
  const [startPage, endPage] = calculatePageRange(currentPage, totalPages);
  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 페이지네이션이 한 페이지일 때는 비활성화
  if (totalPages <= 1) {
    return null; // 페이지네이션이 필요 없으면 null 반환
  }

  return (
    <ul className="pagination">
      {/* 첫 페이지 버튼 */}
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          &laquo;&laquo; {/* 두 개의 화살표로 첫 페이지 */}
        </button>
      </li>

      {/* 이전 페이지 버튼 */}
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
      </li>

      {/* 페이지 번호 버튼 */}
      {pageNumbers.map((pageNumber) => (
        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        </li>
      ))}

      {/* 다음 페이지 버튼 */}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </li>

      {/* 마지막 페이지 버튼 */}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          &raquo;&raquo; {/* 두 개의 화살표로 마지막 페이지 */}
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
