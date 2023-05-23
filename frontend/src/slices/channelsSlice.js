import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, { payload }) => ({ ...state, channels: payload }),
    setCurrentChannelId: (state, { payload }) => ({ ...state, currentChannelId: payload }),
  },
});

export const {
  setChannels,
  setCurrentChannelId,
} = channelsSlice.actions;
export const channelsReducer = channelsSlice.reducer;
