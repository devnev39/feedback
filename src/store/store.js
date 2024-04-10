import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../feature/users';

export default configureStore({
    reducer: {
        user: userReducer
    }    
})
