import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {
        isLogin: null,
        isDarkTheme: true,
        isSelectedUrdu: false,
    },
}

export const userSlice: any = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state: { user: {} }, action) => {
            state.user = {
                ...state?.user, ...action.payload, isLogin: true
            }
        },
        logout: (state: { user: {} | null }) => {
            state.user = { ...state?.user, isLogin: false }
        },
        setDarkTheme: (state: { user: {} | null }, action: any) => {
            state.user = { ...state.user, isDarkTheme: action.payload }
        },
        toggleLanguage: (state: { user: {} | null }, action: any) => {
            state.user = { ...state.user, isSelectedUrdu: action.payload }
        },
    }
})

export const { login, logout, setDarkTheme, toggleLanguage } = userSlice.actions

export default userSlice.reducer