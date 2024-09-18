// import { getToken } from "next-auth/jwt"
// import { withAuth } from "next-auth/middleware"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"


export default async function middleware(request: NextRequest) {
    console.log('pathname', request.nextUrl.pathname)
    const cookiesIntialise = cookies()
    const accessToken: string | undefined = cookiesIntialise.get('accessToken')?.value
    const refreshToken: string | undefined = cookiesIntialise.get('accessToken')?.value
    if (!accessToken) {
        return NextResponse.redirect(new URL('/login',request.nextUrl.origin))
    }
    else {
        try {
            const fetchVerify = await fetch(`${process.env.BACKEND_URL}/user/individual`, {
                headers: {
                    "Authorization": `${accessToken}`
                }
            })
            const { data:{_id} } = await fetchVerify.json()
            console.log('access token verify ', _id)
            const userData= JSON.parse(cookiesIntialise.get('userData')!.value)
            if (userData.role == 2 && request.nextUrl.pathname=='/') {
                const response = NextResponse.redirect(new URL('/admin', request.nextUrl.origin))
                return response
            }
            else if (userData.role == 1 && request.nextUrl.pathname == '/admin') {
                const response = NextResponse.redirect(new URL('/', request.nextUrl.origin))
                return response
            }
        }
        catch(e) {
            console.log('access token expired',e)
            try {
                const fetchNewTokens:any = await fetch(`${process.env.BACKEND_URL}/tokens`, {
                    headers: {
                        "Authorization": `${refreshToken}`
                    }
                })
                const {accessToken,refreshToken:newRefreshToken,user}=await fetchNewTokens.json()
                const userData = JSON.parse(cookiesIntialise.get('userData')!.value)
                if (userData.role == 2 && request.nextUrl.pathname == '/') {
                    const response = NextResponse.redirect(new URL('/admin',request.nextUrl.origin))
                    response.cookies.set('accessToken', accessToken)
                    response.cookies.set('refreshToken', newRefreshToken)
                    response.cookies.set('userData', JSON.stringify(user))
                    return response
                }
                else if (userData.role == 1 && request.nextUrl.pathname == '/admin') {
                    const response = NextResponse.redirect(new URL('/', request.nextUrl.origin))
                    response.cookies.set('accessToken', accessToken)
                    response.cookies.set('refreshToken', newRefreshToken)
                    response.cookies.set('userData', JSON.stringify(user))
                    return response
                }
                else {
                    const response = NextResponse.next()
                    response.cookies.set('accessToken',accessToken)
                    response.cookies.set('refreshToken',newRefreshToken)
                    response.cookies.set('userData',JSON.stringify(user))
                    return response
                }
            }
            catch {
                const response = NextResponse.redirect(new URL('/login', request.nextUrl.origin))
                response.cookies.delete('accessToken')
                response.cookies.delete('refreshToken')
                response.cookies.delete('userData')
                return response
            }
        }
    }
    
}


export const config = {
    matcher: [
        '/',
        '/admin'
    ]
}