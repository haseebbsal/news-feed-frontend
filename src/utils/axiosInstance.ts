import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { error } from "console";
import Cookies from 'js-cookie'
const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`
})

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!config.url?.includes('/login') || !config.url?.includes('/register')) {
        config.headers.Authorization = `Bearer ${Cookies.get('accessToken')}`
        return config
    }
    else if (config.url?.includes('/tokens')) {
        config.headers.Authorization = `Bearer ${Cookies.get('refreshToken')}`
        return config
    }
    return config
})

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
    // console.log('axios response', response)
    if (response.config.url?.includes('/login')) {
        const { data } = response
        Cookies.set('accessToken', data.accessToken)
        Cookies.set('refreshToken', data.refreshToken)
        Cookies.set('userData', JSON.stringify(data.user))
    }
    else if (response.config.url?.includes('/logout')) {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('userData')
    }
    return response
}, async (error: AxiosError) => {
    const message = (error.response?.data as any).message
    if (message == "UnAuthorized") {
        console.log('token expired')
        // const refreshToken = Cookies.get('refreshToken')
        try {
            const refreshTokenFetch = await axiosInstance.get('/tokens')
            const { data } = refreshTokenFetch
            console.log(data.user._id)
            Cookies.set('accessToken', data.accessToken)
            Cookies.set('refreshToken', data.refreshToken)
            Cookies.set('userData', JSON.stringify(data.user))
            return axiosInstance({
                ...error.config
                })
        }
        catch (e) {
            console.log('refresh token error')
            window.location.href = '/login'
            Cookies.remove('userData')
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
        }
    }
    console.log('interceptor error', error)
    return Promise.reject(error);
})


export default axiosInstance