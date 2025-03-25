import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) =>{  // Triggered when the sign-in process starts
            state.loading = true; // set loading to true

        },
        signInSuccess: (state, action) => { // Triggered when sign-in is successful
            state.currentUser = action.payload; // Set the logged-in user's data
            state.loading = false;  // Stop the loading state
            state.error = null;   // Clear any previous errors
        },
        signInFailure: (state, action) => {  // Triggered when sign-in fails
            state.error = action.payload;  // Set the error message
            state.loading = false;  // Stop the loading state
        },
        updateUserStart: (state) => {
            state.loading = true;

        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        SignOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        SignOutUserStart: (state) => {
            state.loading = true;
        },
        SignOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const {signInStart,signInSuccess, signInFailure , updateUserStart, updateUserSuccess ,updateUserFailure, deleteUserSuccess, deleteUserFailure, deleteUserStart, SignOutUserFailure,SignOutUserStart,SignOutUserSuccess} = userSlice.actions;

export default userSlice.reducer;