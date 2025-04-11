import { createSlice } from "@reduxjs/toolkit";

const UserDataSlice=createSlice({
    name:"userData",
    initialState:{
        userName:null,
        email:null,
        score:null,
        id:null
    },
    reducers:{
        addUserName:(state,action)=>{
            state.userName=action.payload;
        },
        addUserScore:(state,action)=>{
            state.score=action.payload;
        },
        addUserId:(state,action)=>{
            state.id=action.payload;
        },
        addUserEmail:(state,action)=>{
            state.email=action.payload;
        }
    }
});
export default UserDataSlice.reducer;
export const {addUserId,addUserName,addUserScore,addUserEmail}=UserDataSlice.actions;