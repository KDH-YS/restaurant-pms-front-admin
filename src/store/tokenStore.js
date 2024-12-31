import { create } from "zustand";

export const tokenStore = create((set)=>({
    isTokenValid : null,
    setIsTokenValid : (newIsTokenValid) => set({isTokenValid: newIsTokenValid})
}));
export default tokenStore