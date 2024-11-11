'use client'

import BaseSelect from "@/components/protected/forms/base-select"
import axiosInstance from "@/utils/axiosInstance"
import { Button, Input,Textarea } from "@nextui-org/react"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { ImSpinner10 } from "react-icons/im"
import { MdAdd, MdDelete } from "react-icons/md"
import { useMutation, useQuery } from "react-query"
import { toast } from "react-toastify"

export default function Settings() {
    const getSettingsQuery = useQuery(['settings'], () => axiosInstance.get('/article/scheduledArticle'),{
        onSuccess(data) {
            setUrls(data.data.data.urls)
        },
        refetchOnWindowFocus:false
    })
    const [urls, setUrls] = useState<any>([])
    const{handleSubmit,register,setValue,formState:{errors},control,getValues} =useForm()
    const updateSettings=useMutation((data:any)=>axiosInstance.post('/article/schedule',data),{onSuccess(data, variables, context) {
        console.log('updated',data.data)
        toast.success('Settings Updated Successfully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
        
    },onError(error:any) {
      const {message,data}=error.response.data
        toast.error(data[0], {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
    }})
    function Submit(e:FieldValues){
        console.log('values',e)
        let timeOfCheck=Number(e.timeOfCheck)
        const data={
            ...e,
            timeOfCheck
        }
        updateSettings.mutate(data)
    }
    // console.log(errors)
    return (
        <>
        {!getSettingsQuery.isLoading &&  <div className="flex flex-col gap-4 w-full">
                <h1 className="text-3xl">Settings</h1>
                <form onSubmit={handleSubmit(Submit)} className="flex flex-col gap-4 sm:w-1/2 w-full">
                    <div className="flex gap-4">
                        <BaseSelect name="domain" defaultSelectedKeys={getSettingsQuery.data?.data.data.domain} rules={{required:"Select Domain"}} items={[{ key: '1', label: "https://rias-aero.com" }]} label="Domain" placeholder="Select Domain" control={control}/>

                        <BaseSelect defaultSelectedKeys={getSettingsQuery.data?.data.data.timeCheckType?`${getSettingsQuery.data?.data.data.timeCheckType}`:getSettingsQuery.data?.data.data.timeCheckType} name="timeOfCheck" rules={{required:"Select Time Of Check"}} items={[{ key: 1, label: "Once Per Day" }, { key: 2, label: 'Once Per Week' }, { key: 3, label: "Once Per Month" }, { key: 4, label: "Once Per Year" }]} label="Time Of Check" placeholder="Select Time Of Check" control={control}/>
                  
                    </div>
                    <div className="flex gap-4">
                    <BaseSelect defaultSelectedKeys={getSettingsQuery.data?.data.data.publishType} name="publishType" rules={{required:"Select Publish Type"}} items={[{ key: '1', label: "Original" }, { key: '2', label: "Rewrite" }, { key: '3', label: "Summary" }]} label="Publish Type" placeholder="Select Publish Type" control={control}/>
                        <Input
                            label="Relevance Index Score"
                            labelPlacement="outside"
                            {...register('relevanceIndex',{required:"Select Relevance Index",min:{value:0,message:"Minimum Value is 0"},max:{value:1,message:"Maximum Value Is 1"}})}
                            defaultValue={getSettingsQuery.data?.data.data.relevanceIndex}
                            errorMessage={errors.relevanceIndex?.message as any}
                            isInvalid={!!errors.relevanceIndex}
                            classNames={{ label: "!text-white" }}
                            type="number"
                            min="0"
                            max={"1"}
                            step={"0.01"}
                            id="url"
                            placeholder="Enter Relevance Index Score"
                        />
                    </div>

                    <div className="flex gap-4">
                        <Textarea label="Keywords"
                        defaultValue={getSettingsQuery.data?.data.data.keywords}
                        {...register('keywords',{required:"Enter Keywords"})}
                        errorMessage={errors.keywords?.message as any}
                        isInvalid={!!errors.keywords}
                            classNames={{ label: "!text-white" }}
                            labelPlacement="outside" placeholder="Enter Keywords..." />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                            <h1>RSS FEEDS</h1>
                            <Button onClick={()=>setUrls((prev:any)=>[...prev,''])} className="bg-green-100">
                                <MdAdd className="text-xl text-green-600" /></Button>
                        </div>
                        {urls.map((e:string,index:number) => <div className="flex gap-4 justify-between">
                            <Input
                            {...register(`urls.${index}`,{required:"Enter RSS Feed"})}
                            defaultValue={e}
                            errorMessage={(errors as any).urls?.[index]?.message as any}
                            isInvalid={!!(errors as any).urls?.[index]}
                                classNames={{ label: "!text-white" }}
                                type="text"
                                id="url"
                                placeholder="Enter RSS Feed URL"
                            /><Button onClick={()=>{
                                setUrls(urls.filter((_:any,i:number)=>i!=index))
                                setValue('urls',urls.filter((_:any,i:number)=>i!=index))
                            }
                            } className="bg-red-100">
                                <MdDelete className="text-xl text-red-600" /></Button>
                        </div>)}
                    </div>
                <Button className="bg-blue-400 sm:w-[10rem] w-full text-white" type="submit" isLoading={updateSettings.isLoading} isDisabled={updateSettings.isLoading} >Update Settings</Button>

                </form>
            </div>}
        {getSettingsQuery.isLoading && 
        <div className="flex justify-center items-center min-h-80">
            <ImSpinner10 className="animate-spin text-7xl"/>
        </div>
        }
        </>
    )
}