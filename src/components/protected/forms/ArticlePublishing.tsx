'use client'
import { Button, DateInput, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";
import { Control, Controller, useController, useForm } from "react-hook-form";
const animals = [
    {key: "1", label: "https://rias-aero.com"},
  ];



 
export default function ArticlePublishingForm({publishSubmit,article,isSubmitting}:{publishSubmit:any,article:any,isSubmitting:boolean}){
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
                                        
                                        <Button isLoading={isSubmitting} disabled={isSubmitting} className="px-8 py-2 rounded-lg bg-blue-500 min-w-[15rem] text-white" type="submit">Publish</Button>
                                        </div>
                                    </form>
        </>
    )
}