import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const restaurantStore = create(
  persist(
    (set) => ({
        restaurant: null,
        setRestaurant: (restaurantData) => set({ restaurant: restaurantData }),
    }),
    {
      name: 'restaurant-storage', // 로컬 스토리지에 저장될 키 이름
      getStorage: () => localStorage, // 로컬 스토리지 사용
    }
  )
);