import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../feature/users';
import projectReducer from '../feature/project';

export default configureStore({
    reducer: {
        user: userReducer,
        project: projectReducer
    }    
})
