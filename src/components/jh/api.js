// src/api.js
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_BASE_URL;



//레스토랑 리스트 반환
export const fetchRestaurants = async (page = 1, size = 24) => {
  try {
    const response = await axios.get(`${apiUrl}/api/restaurant`, { params: { page, size } });
    return response.data;  // 응답 데이터 그대로 반환
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

// 레스토랑 검색 및 전체 검색 API 통합
export const searchRestaurants = async (searchParams) => {
  try {
    // query가 존재하면 전체 검색을, 없으면 일반 검색을 처리
    const endpoint = `${BASE_URL}/restaurant/search`;

    const response = await axios.get(endpoint, {
      params: searchParams,  // 검색 조건을 params로 전달
    });

    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('레스토랑 검색에 실패했습니다.');
  }
};


// 레스토랑 상세 정보를 가져오는 함수
export const fetchRestaurantDetail = async (restaurantId,token) => {
  const restaurantIdString = String(restaurantId);
  try {
    const response = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}`,{
      method:'get',
      headers:{
        'Authorization': `Bearer ${token}`, // 인증 토큰을 추가
        'Content-Type': 'application/json'
      }
    });
    return response.data;  // 서버에서 반환한 레스토랑 정보
  } catch (error) {
    console.error('레스토랑 상세 정보를 가져오는 데 실패했습니다:', error);
    throw error;  // 에러를 다시 던짐
  }
};

//메뉴 가져옥api
export const fetchRestaurantMenu = async (restaurantId,token) => {
  try {
    const response = await axios.get(`${apiUrl}/api/restaurant/menu/${restaurantId}`,{
      method:'get',
      headers:{
        'Authorization': `Bearer ${token}`, // 인증 토큰을 추가
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('레스토랑 메뉴를 가져오는 데 실패했습니다.');
  }
}

//레스토랑 등록하
export const registerRestaurant = async (restaurantData) => {
  try {
    // 'totalSeats'는 숫자로 변환해줍니다.
    const dataToSend = {
      ...restaurantData,
      totalSeats: parseInt(restaurantData.totalSeats, 10), // totalSeats를 숫자로 변환
    };

    console.log("전송할 레스토랑 데이터:", dataToSend); // 데이터 확인

    const response = await axios.post(`${apiUrl}/api/restaurant/create`, dataToSend);
    
    // 서버 응답 메시지 로그 출력
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    // 에러 메시지 출력
    console.error('레스토랑 등록 실패:', error.response?.data?.error || error.message);
    console.log('Full error:', error);  // 전체 오류 확인

  }
};


//레스토랑 수정하기

export const updateRestaurant = async (restaurantId, updatedData) => {
  try {
    const response = await axios.put(`${apiUrl}/api/restaurant/update/${restaurantId}`, updatedData);

    // 응답에서 message를 안전하게 반환
    if (response && response.data && response.data.message) {
      return response.data; // 응답 데이터 반환
    } else {
      throw new Error('서버에서 message를 반환하지 않았습니다.');
    }
  } catch (error) {
    console.error('레스토랑 수정 실패:', error.response?.data?.error || error.message);
    throw error; // 에러를 외부로 던져서 상위에서 처리하도록 함
  }
};


//레스토랑 지우기 삭제

export const deleteRestaurant = async (restaurantId) => {
  try {
    const response = await axios.delete(`${apiUrl}/api/restaurant/delete/${restaurantId}`);
    console.log(response.data.message);
  } catch (error) {
    console.error('레스토랑 삭제 실패:', error.response?.data?.error || error.message);
  }
};

//스케줄 가져옥api
export const fetchRestaurantSchedule = async (restaurantId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/schedule/${restaurantId}`,{
      method:'get',
      headers:{
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('레스토랑 스케줄을 가져오는 데 실패했습니다.');
  }
}

// 메뉴 등록 함수
export const insertMenu = async (restaurantId, menuData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/restaurant/menu/${restaurantId}/insert`, menuData);
    return response;
  } catch (error) {
    console.error('메뉴 등록 실패:', error);
    throw error; // 호출한 곳에서 예외를 처리할 수 있도록 오류를 던집니다.
  }
};

// 메뉴 삭제 함수
export const deleteMenu = async (restaurantId, menuId) => {
  try {
    const response = await axios.delete(`${apiUrl}/api/restaurant/menu/${restaurantId}/${menuId}/delete`);
    return response;
  } catch (error) {
    console.error('메뉴 삭제 실패:', error);
    throw error; // 호출한 곳에서 예외를 처리할 수 있도록 오류를 던집니다.
  }
};

// 1. 레스토랑 이미지 조회
export const getRestaurantImages = async (restaurantId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}/image`);
    return response.data; // 이미지 목록 반환
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const insertImage = async (restaurantId, formData) => {
  try {
    // POST 요청 (multipart/form-data로 전송)
    const response = await axios.post(`${apiUrl}/api/restaurant/${restaurantId}/image/insert`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 필수로 명시
      },
    });
    return response;
  } catch (error) {
    console.error('Error inserting image:', error);
    throw error;
  }
};


// 3. 이미지 삭제
export const deleteImage = async (restaurantId, imageId) => {
  try {
    const response = await axios.delete(`${apiUrl}/api/restaurant/${restaurantId}/image/${imageId}/delete`);
    return response;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// 대표 이미지 설정 API 호출 함수
export const setMainImage = async (restaurantId, imageDTO) => {
  try { console.log(restaurantId);
    // PUT 요청으로 대표 이미지 설정
    const response = await axios.put(`${apiUrl}/api/restaurant/setMain`, imageDTO, {
      params: { restaurantId: Number(restaurantId) } // 여기서 int로 변환
    });

    // 요청이 성공하면 응답 데이터 처리
    return response.data;  // "대표 이미지가 설정되었습니다."
  } catch (error) {
    // 에러 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error('Error response:', error.response.data);
      return `오류: ${error.response.data}`;
    } else if (error.request) {
      // 요청이 서버로 전송되었으나 응답을 받지 못한 경우
      console.error('Error request:', error.request);
      return '서버에서 응답을 받지 못했습니다.';
    } else {
      // 기타 오류
      console.error('Error:', error.message);
      return `오류: ${error.message}`;
    }
  }
};