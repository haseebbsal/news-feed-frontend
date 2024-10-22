'use client';

import axiosInstance from "@/utils/axiosInstance";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import Cookies from "js-cookie";
import { ImSpinner2 } from "react-icons/im";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
type UserInfo = {
    _id: string,
    email: string,
    username: string
}
export default function AdminNavbar() {
    const navigate = useRouter()
    let userData: UserInfo = { username: '', email: "", _id: "" }
    if (Cookies.get('userData')) {
        userData = JSON.parse(Cookies.get('userData')!)
    }
    // console.log('user data',userData)
    const individualQuery = useQuery(['individual'], () => axiosInstance.get('/user/individual'))
    const logoutMutation = useMutation(() => axiosInstance.post('/logout'), {
        onSuccess(data) {
      window.location.href='/login'

            // navigate.replace('/login')
        },
    })
    function Logout() {
        logoutMutation.mutate()
    }
    return (
        <>
            <div className="mt-2">
                <div className="bg-blue-400 rounded-xl justify-end items-center flex gap-8 px-8 py-4 text-white box-border">
                    <div className="sm:w-[55%] flex sm:justify-between sm:flex-nowrap flex-wrap w-full gap-4 items-center justify-center">
                        <Link href={'/admin'} className="sm:text-start text-center sm:mr-auto">News Article Admin</Link>
                        <div className="flex items-center gap-4">
                            {userData &&
                                <div className="flex gap-4 items-center">
                                    <p>{userData.username}</p>
                                    <CiUser className="p-2 bg-black rounded-full text-4xl" />
                                </div>
                            }
                            <button className="hover:bg-gray-900 hover:p-2 flex justify-center hover:text-white "
                                onClick={Logout}
                            >
                                {logoutMutation.isLoading ? <ImSpinner2 className="text-xl animate-spin" /> : "Log Out"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}