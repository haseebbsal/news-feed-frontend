'use client'

// wdwf
import axiosInstance from "@/utils/axiosInstance";
import { Button, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { FieldValues, useController, useForm } from "react-hook-form"
import { FiUpload } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
export default function Profile() {
    const { handleSubmit, control, formState: { errors } ,setValue} = useForm()
    const [imageSrc, setImageSrc] = useState<any>()
    const queryClient = useQueryClient()
    const updateProfileMutation = useMutation((data: any) => axiosInstance.putForm('/user/profile', data), {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries('profile')
            toast.success('Profile Updated Successfully', {
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
        onError(error: any) {
            toast.error('Error in Updating Profile', {
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
    function profileSubmit(e: FieldValues) {
        console.log(e)
        const formData = new FormData()
        Object.entries(e).filter((p)=>!!p[1]).forEach((j)=>{
            formData.append(j[0], j[1])
        })
        // console.log([...formData.entries()])
        updateProfileMutation.mutate(formData)
    }

    const getProfileQuery = useQuery(['profile'], () => axiosInstance.get('/user/profile'),{
        onSuccess(data) {
            setValue('defaultDomain',data.data.data.defaultDomain)
        },
    })
    const getDomainsQuery = useQuery(['domains'], () => axiosInstance.get('/admin/domains'))

    // console.log(getProfileQuery.data?.data.data)

    const { fieldState: { error }, field } = useController({ name: "file", control, rules: {} })
    const { fieldState: { error: error2 }, field: field2 } = useController({ name: "defaultDomain", control, rules: { required: "Select Domain" } })
    return (
        <div className="flex flex-col gap-4">
            <h1>Profile</h1>
            <form onSubmit={handleSubmit(profileSubmit)} className="flex flex-col gap-4 sm:w-1/2 w-full">
                <div className="flex flex-col gap-4 relative w-max">
                    <div className="h-[12rem] w-[12rem] border-2 text-4xl rounded-lg flex justify-center items-center">
                        {!getProfileQuery.isLoading && <>
                            {!getProfileQuery.data?.data.data.defaultImage && !imageSrc && <FiUpload className="text-white" />}
                            {(getProfileQuery.data?.data.data.defaultImage || imageSrc) && <Image src={`${imageSrc ? imageSrc : `${process.env.NEXT_PUBLIC_BUCKET_URL}/${getProfileQuery.data?.data.data.defaultImage}`}`} alt="profile" className="h-full w-full object-contain" width={100} height={100} />}
                        </>}
                    </div>
                    {error && <p className="text-red-400">{error.message}</p>}

                    <input accept=".jpeg,.png,.jpg" className="absolute z-10 h-full w-full opacity-0 cursor-pointer" type="file" {...field} onChange={(e: any) => {
                        if (e.target.files.length > 0) {
                            field.onChange(e.target.files[0])
                            setImageSrc(URL.createObjectURL(e.target.files[0]))
                        }
                    }} value={undefined} />
                </div>
                {!getProfileQuery.isLoading && !getDomainsQuery.isLoading && <>
                    <Select errorMessage={error2?.message} isInvalid={!!error2} classNames={{ label: '!text-white' }} label="Domain" labelPlacement="outside" placeholder="Select Domain"    {...field2}  defaultSelectedKeys={[getProfileQuery.data?.data.data.defaultDomain]} >
                        {getDomainsQuery.data?.data.data.domains.map((e: any, index: number) => <SelectItem key={index+1}>{e.domain}</SelectItem>)}
                    </Select>
                </>}
                <Button isLoading={updateProfileMutation.isLoading} isDisabled={updateProfileMutation.isLoading} type="submit" className="w-max bg-blue-400 text-white">Update Profile</Button>
            </form>
        </div>
    )
}