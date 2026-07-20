// import { createSlice } from "@reduxjs/toolkit";

// const getInitialLanguage = () => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("lang") || "en";
//   }
//   return "en";
// };

// const languageSlice = createSlice({
//   name: "language",
//   initialState: {
//     current: getInitialLanguage(),
//   },
//   reducers: {
//     setLanguage: (state, action) => {
//       state.current = action.payload;
//       if (typeof window !== "undefined") {
//         localStorage.setItem("lang", action.payload);
//       }
//     },
//   },
// });

// export const { setLanguage } = languageSlice.actions;
// export default languageSlice.reducer;