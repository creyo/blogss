import { createSlice } from '@reduxjs/toolkit';

// Create a slice for settings
const initialState = {
  selectedPostTypeId: 2,
  selectedPublicationId: 1,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSelectedPostTypeId: (state, action) => {
      state.selectedPostTypeId = action.payload;
    },
    setSelectedPublicationId: (state, action) => {
      state.selectedPublicationId = action.payload;
    },
  },
});

export const { setSelectedPostTypeId, setSelectedPublicationId } = settingsSlice.actions;

export default settingsSlice.reducer;   
