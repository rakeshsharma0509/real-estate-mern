import { create } from "zustand";
import apiRequest from "./apiRequest";

//create store bana ne ke kaam aata hai  jsimein actions and states are held
// set function is an argument that is used to chaange the state.
export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    const res = await apiRequest("/users/notification");
    set({ number: res.data });
  },
  //actions
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  //actions
  reset: () => {
    set({ number: 0 });
  },
}));
