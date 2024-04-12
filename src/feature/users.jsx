import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        users: []
    },
    reducers: {
        setAppUser:(state, action) => {
            state.user = action.payload;
        },

        setUsers: (state, action) => {
            state.users = state.users.concat(action.payload);
        },

        clearUsers: (state, action) => {
            state.users = [];
        }
    }
})

export const {setAppUser, setUsers, clearUsers} = userSlice.actions;
export default userSlice.reducer;
