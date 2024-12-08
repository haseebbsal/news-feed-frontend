'use client';

import axiosInstance from "@/utils/axiosInstance";
import { FormEvent, useState } from "react";
import { Input } from "@nextui-org/react";
import { GiNewspaper } from "react-icons/gi";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";
import { useRouter } from "next/navigation";
import { IoIosLock } from "react-icons/io";
import { BsEyeFill, BsEyeSlash } from "react-icons/bs";
import { CiMail, CiUser } from "react-icons/ci";
import ReactInputVerificationCode from 'react-input-verification-code';
import { FieldValues, useController, useForm } from "react-hook-form";

export default function RegisterForm({ onClose }: { onClose: any }) {
    const navigate = useRouter()
    const queryClient = useQueryClient()
    const [isVisible, toggleVisibility] = useState(false)
    const [verificationCode, setVerificationCode] = useState<any>()
    const [timer,setTimer]=useState<any>(30)

    const timerResend=()=>{
        const intervalId=setInterval(()=>{
            setTimer((prev:any)=>{
                if(!prev){
                    clearInterval(intervalId)
                    return prev
                }
                return prev-1
            })
        },1000)
    }


    const registerMutation = useMutation((data: any) => axiosInstance.post('/register', data), {
        onSuccess(data, variables, context) {
            // queryClient.invalidateQueries('user')
            // onClose()
            // console.log(data.data)
            timerResend()
            // navigate.replace('/login')

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
    const [username, setUsername] = useState<any>()

    const { control, handleSubmit, setError } = useForm()
    const verifyCodeMutation = useMutation((data: any) => axiosInstance.post('/verify', data), {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries('user')
            onClose()
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

    const resendVerifyMutation = useMutation((data: any) => axiosInstance.post('/resend', data), {
        onSuccess(data) {

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

    function handleSubmitt(e: FormEvent) {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        }
        setUsername(formData.get('username'))
        registerMutation.mutate(data)
    }

    function handleVerifySubmit(e: FieldValues) {
        const { code } = e
        if (!code || code.includes('·')) {
            setError('code', { message: "Enter Verification Code" })
        }
        const data = {
            code,
            username
        }
        verifyCodeMutation.mutate(data)
    }



    const { field, fieldState } = useController({ name: 'code', control, rules: { required: "Enter Verification Code" } })
    return (
        <>
            <div className="flex justify-center items-center w-full">
                <div className="m-auto  text-gray-900 w-full bg-white flex flex-col items-center gap-2 rounded-xl p-2">
                    {/* <GiNewspaper className="text-[3rem]" /> */}
                    {!registerMutation.data && <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmitt}>
                        <div className="flex flex-wrap gap-4 items-center w-full">
                            <label htmlFor="username" className="min-w-[23%]">Username</label>
                            <Input
                                required
                                name="username"
                                className="w-full"
                                type="username"

                                classNames={{ label: 'font-semibold' }}
                                // isInvalid={email === '' && loginMutation.isError}
                                // errorMessage="Please Enter Email"
                                // onChange={(e) => {
                                //     setEmail(e.target.value);
                                // }}
                                // label="Email"
                                placeholder="johnTheGreat12"
                                // labelPlacement="outside"
                                startContent={
                                    <CiUser className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                            />
                            {/* <input required type="username" name="username" placeholder="johnTheGreat12" id="username" className="border-2 sm:w-max w-full border-gray-900 rounded p-2" /> */}
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <label htmlFor="email" className="min-w-[23%]">Email</label>
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
                            {/* <input required type="email" name="email" placeholder="john@gmail.com" id="email" className="border-2 sm:w-max w-full border-gray-900 rounded p-2" /> */}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">

                            <label htmlFor="password" className="min-w-[23%]">Password</label>
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
                            {/* <input required type="password" name="password" placeholder="Enter Password" id="password" className="border-2 sm:w-max w-full border-gray-900 rounded p-2" /> */}
                        </div>
                        <button type="submit" className="bg-gray-900 p-2 text-white flex justify-center rounded">{registerMutation.isLoading ? <ImSpinner2 className="text-lg animate-spin" /> : "Add User"}</button>
                    </form>}

                    {registerMutation.data && <form onSubmit={handleSubmit(handleVerifySubmit)} className="flex flex-col items-center gap-4">
                        <h1 className="text-center font-semibold text-lg">Verifiy Email</h1>
                        <div className="flex flex-col gap-4">
                            {fieldState.error && <p className="text-red-600 text-sm">{fieldState.error.message}</p>}
                            <ReactInputVerificationCode length={6} {...field} />
                            <button disabled={!!timer} type="button" onClick={() => {
                                resendVerifyMutation.mutate({username})
                                setTimer(30)
                                timerResend()
                            }} className="text-gray-900">resend code in {timer}</button>
                        </div>
                        <button type="submit" className="bg-gray-900 p-2 text-white flex justify-center rounded w-full">{verifyCodeMutation.isLoading ? <ImSpinner2 className="text-lg animate-spin" /> : "Submit"}</button>
                    </form>}
                </div>

            </div>
        </>
    )
}