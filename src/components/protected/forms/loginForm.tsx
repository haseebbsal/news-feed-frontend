'use client';

import axiosInstance from "@/utils/axiosInstance";
import { Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BsEyeFill, BsEyeSlash } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { GiNewspaper } from "react-icons/gi";
import { ImSpinner2 } from "react-icons/im";
import { IoIosLock } from "react-icons/io";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
type LoginData = {
    email: string,
    password:string
}
export default function LoginForm() {
    const navigate = useRouter()
    const [isVisible, toggleVisibility] = useState(false)
    const loginMutation = useMutation((data: LoginData) => axiosInstance.post('/login', data), {
        onSuccess(data) {
            console.log(data.data)
            if (data.data.user.isBlocked) {
                toast.error('Account Is Blocked', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }
            else {
                if (data.data.user.role == 2) {
                    navigate.replace('/admin')
                }
                else {
                    navigate.replace('/')
                }   
            }
        },
        onError(error: any) {
            toast.error(error.response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        },
    })
    async function handleSubmit(e:FormEvent) {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const email = formData.get('email')
        const password = formData.get('password')
        const data: LoginData = {
            email: email as any as string,
            password:password as any as string
        }
        loginMutation.mutate(data)
        // await signIn('credentials', {
        //     email,
        //     password,
        //     redirect: true,
        //     callbackUrl:'/'
        // })
        // form.reset()
    }
    return (
        <>
            <div className="h-[100vh] flex justify-center items-center">
                <div className="w-1/2 m-auto min-h-1/2 text-gray-900 bg-white flex flex-col items-center gap-4 rounded-xl p-8">
                    <GiNewspaper className="text-[3rem]" />
                    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                        <div className="flex flex-wrap gap-4 items-center">
                            <label htmlFor="email" className="min-w-[22.5%]">Email</label>
                            <Input
                                required
                                name="email"
                                className="w-full"
                                type="email"
                                classNames={{ label: 'font-semibold' }}
                                // isInvalid={email === '' && loginMutation.isError}
                                // errorMessage="Please Enter Email"
                                // onChange={(e) => {
                                //     setEmail(e.target.value);
                                // }}
                                // label="Email"
                                placeholder="you@example.com"
                                // labelPlacement="outside"
                                startContent={
                                    <CiMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                            />
                            {/* <input required type="email" name="email" placeholder="john@gmail.com" id="email" className="border-2 border-gray-900 rounded p-2 w-full" /> */}
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <label htmlFor="password" className="min-w-[21%]">Password</label>
                            <Input
                                name="password"
                                required
                                classNames={{ label: 'font-semibold' }}
                                // isInvalid={passwordError !== ''}
                                // errorMessage={passwordError}
                                // onChange={(e) => {
                                //     setPassword(e.target.value);
                                // }}
                                // label="Password"
                                className="w-full"
                                placeholder="Enter your password"
                                // labelPlacement="outside"
                                startContent={
                                    <IoIosLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={() => {
                                        toggleVisibility(!isVisible);
                                    }}>
                                        {isVisible ? (
                                            <BsEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <BsEyeFill className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                type={isVisible ? "text" : "password"}
                            />
                            {/* <input required type="password" name="password" placeholder="Enter Password" id="password" className="border-2 border-gray-900 rounded p-2 w-full" /> */}
                        </div>
                        <div className="flex items-center flex-col gap-4">
                            <button type="submit" className="w-full bg-gray-900 p-2 flex justify-center text-white rounded">{loginMutation.isLoading ? <ImSpinner2 className="text-xl animate-spin" /> : "Log In"}</button>
                            {/* <p>or</p>
                            <Link href={'/register'} className="w-full bg-gray-900 p-2 text-white rounded text-center">Register</Link> */}
                        </div>
                    </form>
                </div>

            </div>
            {/* <p onClick={()=>{signIn('credentials',{redirect:true,callbackUrl:'/'})}}>Login</p> */}
        </>
    )
}
