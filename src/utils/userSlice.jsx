import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice=createSlice({
    name:"userInfoSlice",
    initialState:[],
    reducers:{
        addAlluser:(state,action)=>{
            state.push(action.payload);
        }
    }
})
export default userInfoSlice.reducer;
export const {addAlluser} =userInfoSlice.actions;