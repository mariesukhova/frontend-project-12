/* eslint-disable no-param-reassign */
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
    addChannel: (state, { payload }) => {
      state.channels.push(payload);
      state.currentChannelId = payload.id;
    },
    renameChannel: (state, { payload }) => {
      state.channels.map((channel) => {
        if (channel.id === payload.id) {
          return Object.assign(channel, payload);
        }
        return channel;
      });
    },
    removeChannel: (state, { payload }) => {
      const newList = state.channels.filter((channel) => channel.id !== payload.id);
      return { ...state, channels: newList, currentChannelId: 1 };
    },
  },
});

export const {
  setChannels,
  setCurrentChannelId,
  addChannel,
  renameChannel,
  removeChannel,
} = channelsSlice.actions;
export const channelsReducer = channelsSlice.reducer;
