import {createSlice} from '@reduxjs/toolkit';

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState: {
        feedbacks: []
    },

    reducers: {
        setFeedbacks: (state,action) => {
            state.feedbacks = state.feedbacks.concat(action.payload);
        },

        clearFeedbacks: (state, action) => {
            state.feedbacks = [];
        },

        updateFeedback: (state, action) => {
            const index = state.feedbacks.findIndex((f) => f.id == action.payload.id);
            state.feedbacks = state.feedbacks.filter((f) => f.id != action.payload.id);
            state.feedbacks.splice(index, 0, action.payload);
        },

        removeFeedback: (state, action) => {
            state.feedbacks = state.feedbacks.filter((f) => f.id != action.payload.id);
        }
    }
})

export const {setFeedbacks, clearFeedbacks, updateFeedback, removeFeedback} = feedbackSlice.actions;
export default feedbackSlice.reducer;
