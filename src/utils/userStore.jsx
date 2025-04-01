import { configureStore } from "@reduxjs/toolkit";
import userInfoSliceReducer from "./userSlice"
import userDataReducer from "./userDataSlice";
const userStore=configureStore({
    reducer:{
        userInfoSlice:userInfoSliceReducer,
        userData:userDataReducer
    }
});
export default userStore;