import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "" ? "dark" : "";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
