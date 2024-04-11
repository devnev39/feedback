import {createSlice} from '@reduxjs/toolkit';

const projectSlice = createSlice({
    name: 'project',
    initialState: {
        projects: []
    },
    reducers: {
        setProjects: (state, action) => {
            state.projects = state.projects.concat(action.payload);
        },

        updateProject: (state, action) => {
            const ind = state.projects.findIndex((p) => p.id == action.payload.id);
            state.projects = state.projects.filter((p) => p.id != action.payload.id);
            state.projects.splice(ind, 0, action.payload);
        },

        removeProject: (state, action) => {
            state.projects = state.projects.filter((p) => p.id != action.payload.id);
        },

        clearProjects: (state, action) => {
            state.projects = [];
        }
    }
})

export const {setProjects, updateProject, removeProject, clearProjects} = projectSlice.actions;
export default projectSlice.reducer;
