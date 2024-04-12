import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../feature/users';
import projectReducer from '../feature/project';
import feedbackReducer from '../feature/feedback';

export default configureStore({
    reducer: {
        user: userReducer,
        project: projectReducer,
        feedback: feedbackReducer
    }    
})
