import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    loginData: Cookies.get('loginData') ? JSON.parse(Cookies.get('loginData')) : null,
    userId: Cookies.get('userId') ? JSON.parse(Cookies.get('userId')) : null,
    signupData: Cookies.get('signupData') ? JSON.parse(Cookies.get('signupData')) : null,
}

export const user_information = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSignupData(state, action) {
            state.signupData = action.payload;
            Cookies.set('signupData', JSON.stringify(state.signupData));
        },
        logout(state) {
            state.loginData = null;
            state.userId = null;
            Cookies.remove('loginData');
            // localStorage.removeItem("signupData");
            Cookies.remove("userId");
            localStorage.removeItem("signupData");
            // localStorage.clear();
        },
        setLoginData(state, action) {
            const loginPayload = action.payload;
            state.loginData = loginPayload;
            Cookies.set('loginData', JSON.stringify(state.loginData));
        
            // ✅ Extract and store userId (customer_id)
            const userId = loginPayload?.data?.customer_id || null;
            state.userId = userId;
            Cookies.set('userId', JSON.stringify(userId));
        },
        
        // setLoginData(state, action) {
        //     state.loginData = action.payload;
        //     Cookies.set('loginData', JSON.stringify(state.loginData));
        // },
        setuserId(state, action) {
            console.log("action payload : ", action.payload);
            state.userId = action.payload;
            Cookies.set('userId', JSON.stringify(state.userId));
            console.log("userId in state : ", state.userId);
        }
    }
});

export const { setSignupData, logout, setLoginData, setuserId } = user_information.actions;
export default user_information.reducer;
