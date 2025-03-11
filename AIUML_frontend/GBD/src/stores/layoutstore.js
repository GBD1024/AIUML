import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => {
    return {
      isCollapse: true,
    };
  },
  actions: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
});
