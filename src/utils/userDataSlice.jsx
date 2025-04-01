import { createSlice } from "@reduxjs/toolkit";

const UserDataSlice=createSlice({
    name:"userData",
    initialState:{
        userName:null,
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
        }
    }
});
export default UserDataSlice.reducer;
export const {addUserId,addUserName,addUserScore}=UserDataSlice.actions;