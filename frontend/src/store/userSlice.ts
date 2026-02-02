import {createSlice, type PayloadAction} from "@reduxjs/toolkit"

type AuthState = {
    status: boolean;
    userData: string | null;
}

const initialState: AuthState = {
    status: false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state,action: PayloadAction<string>) => {
            state.status = true,
            state.userData = action.payload
        },
        logout: (state) => {
            state.status = false,
            state.userData = null
        }
    }
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer;