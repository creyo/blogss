import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: true,
  seo: true,
  seoTitle: true,
  seoBody: true,
  tag: true,
  keyword: true,
  featuredImage: true,
  author: true,
  subTitle: true,
  note: true,
  image_alt : true
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
