import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { logoutAction } from '../actions/AuthActions';

export enum OverlayName {
  Loading = 'loading',
  Lobby = 'lobby',
  Answer = 'answer',
}

export type OverlayState = {
  open: boolean,
};

export type OverlaysState = Record<OverlayName, OverlayState>;

const initialState: OverlaysState = {
  [OverlayName.Loading]: {
    open: false,
  },
  [OverlayName.Lobby]: {
    open: false,
  },
  [OverlayName.Answer]: {
    open: false,
  },
};



export const overlaysSlice = createSlice({
  name: 'overlays',
  initialState,
  reducers: {
    openOverlay: (state, action: PayloadAction<OverlayName>) => {
      state[action.payload].open = true;
    },
    closeOverlay: (state, action: PayloadAction<OverlayName>) => {
      state[action.payload].open = false;
    },
    closeAllOverlays: (state) => {
      Object.keys(state).forEach(key => {
        state[key as OverlayName].open = false;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Reset state on logout, no matter if successful or not
      .addCase(logoutAction.fulfilled, () => initialState)
      .addCase(logoutAction.rejected, () => initialState);
    },
});

export const { openOverlay, closeOverlay, closeAllOverlays } = overlaysSlice.actions;

export default overlaysSlice.reducer;