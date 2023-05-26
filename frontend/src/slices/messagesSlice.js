import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, { payload }) => ({ ...state, messages: payload }),
    addMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
    extraReducers: (builder) => {
      builder.addCase(removeChannel, (state, action) => {
        const channelId = action.payload.id;
        const newList = state.messages.filter((message) => message.channelId !== channelId);
        return newList;
      });
    },
  },
});

export const {
  setMessages,
  addMessage,
} = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
