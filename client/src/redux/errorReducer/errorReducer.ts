import { createSlice } from '@reduxjs/toolkit';

interface ErrorState {
  errorMessage: string | null;
}

const initialState: ErrorState = {
  errorMessage: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    clearErrorMessage: state => {
      state.errorMessage = null;
    },
  },
});

export const { setErrorMessage, clearErrorMessage } = errorSlice.actions;
export default errorSlice.reducer;
