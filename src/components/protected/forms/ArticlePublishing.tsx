'use client'
import axiosInstance from "@/utils/axiosInstance";
import { Button, DateInput, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";
import { Control, Controller, FieldValues, useController, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
const animals = [
    {key: "1", label: "https://rias-aero.com"},
  ];



 
export default function ArticlePublishingForm({article}:{article:any}){
    
      const publishMutation = useMutation(
        (data: any) => axiosInstance.post("/article/publish", data),
        {
          onSuccess(data, variables, context) {
            toast.success('Article Published Successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            console.log("publish", data.data);
          },
          onError(error:any) {
            toast.error('Error In Publishing Data', {
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
        }
      );
    const {register:secondRegister,handleSubmit:secondHandleSubmit,formState:{errors:secondErrors},control,setValue}=useForm({
        defaultValues:{
            domain:"1",
            title:"",
            article:""
        }
    })
    useEffect(()=>{
        setValue('article',article)
    },[article])

    const publishSubmit = (data: FieldValues) => {
        console.log("publishData", data);
        publishMutation.mutate(data);
      };
    return (
        <>
         <form onSubmit={secondHandleSubmit(publishSubmit)} className="flex items-start gap-1 flex-col">
                                        {/* <button className="px-8 py-2 rounded-lg bg-blue-500 min-w-[15rem] text-white">Publish</button> */}
                                        <div className="flex flex-wrap items-end gap-4">
                                        <Select
                                                items={animals}
                                                label="Select Domain"
                                                {...secondRegister('domain',{required:"Select A Domain"})}
                                                errorMessage={secondErrors.domain?.message as any}
                                                isInvalid={!!secondErrors.domain}
                                                labelPlacement="outside"
                                                // placeholder="Select an animal"
                                                defaultSelectedKeys={'1'}
                                                className="max-w-xs"
                                                classNames={{
                                                    label:"font-semibold"
                                                }}
                                                >
                                                {(animal) => <SelectItem key={animal.key}>{animal.label}</SelectItem>}
                                            </Select>
                                            
                                            <Input errorMessage={secondErrors.title?.message as any}
                                                isInvalid={!!secondErrors.title} className="w-max" classNames={{
                                                    label:"font-semibold"
                                                }} label="Title Of Article" labelPlacement="outside" placeholder="Enter Title" {...secondRegister('title',{required:"Enter Article Title"})}/>
                                        
                                        <Button isLoading={publishMutation.isLoading} disabled={publishMutation.isLoading} className="px-8 py-2 rounded-lg bg-blue-500 min-w-[15rem] text-white" type="submit">Publish</Button>
                                        </div>
                                    </form>
        </>
    )
}