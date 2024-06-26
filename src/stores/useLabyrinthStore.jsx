import { create } from "zustand";

const startUrl = "https://labyrinth.technigo.io/start";
const actionUrl = "https://labyrinth.technigo.io/action";

export const useLabyrinthStore = create((set, get) => ({
  playerJoinIn: false,
  userName: "",
  levelDescription: "",
  actions: "",
  coordinates: "",
  isEnd: false,

  setUserName: (newUserName) => set({ userName: newUserName }),

  fetchStart: async (userName) => {
    try {
      const response = await fetch(startUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to Start your adventure. Please reload the page."
        );
      }

      const data = await response.json();

      set({ levelDescription: data.description });
      set({ actions: data.actions });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      set({ playerJoinIn: true });
      set({ loading: false });
    }
  },

  fetchLevel: async (direction) => {
    try {
      const response = await fetch(actionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: get().userName,
          type: "move",
          direction: direction,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch level data.");
      }

      const levelData = await response.json();
      set({ levelDescription: levelData.description });
      set({ actions: levelData.actions });
      set({ coordinates: levelData.coordinates });

      const [x, y] = levelData.coordinates.split(",");
      if (x === "1" && y === "3") {
        set({ isEnd: true });
      } else {
        set({ isEnd: false });
      }
    } catch (Error) {
      console.error("Failed to get next step.");
    }
  },

  restart: () => {
    set({
      playerJoinIn: false,
      userName: "",
      levelDescription: "",
      actions: "",
      coordinates: "",
      isEnd: false,
    });
  },
}));
