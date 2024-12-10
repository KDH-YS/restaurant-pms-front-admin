import {create} from 'zustand';

const usePaginationStore = create((set) => ({
  currentPage: 1,
  totalPages: 1,
  pageGroup: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  setPageGroup: (group) => set({ pageGroup: group }),
}));

export default usePaginationStore;