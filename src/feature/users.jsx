import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        setAppUser:(state, action) => {
            state.user = action.payload;
        }
    }
})

export const {setAppUser} = userSlice.actions;
export default userSlice.reducer;
