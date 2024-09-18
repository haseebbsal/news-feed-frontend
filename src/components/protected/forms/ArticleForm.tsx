'use client'
import { Button, DateInput, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";
import { Control, Controller, useController, useForm } from "react-hook-form";
const animals = [
    {key: "1", label: "https://rias-aero.com"},
  ];



 
export default function ArticleForm({scheduleSubmit,article}:{scheduleSubmit:any,article:any}){
    const {register:secondRegister,handleSubmit:secondHandleSubmit,formState:{errors:secondErrors},control,setValue}=useForm({
        defaultValues:{
            date:null,
            domain:"1",
            article:"",
            title:""
        }
    })
    const {field,fieldState}=useController({
        name:"date",
        control,
        // defaultValue:""
        rules:{
            required:"Enter Date and Time"
        }
    })

    useEffect(()=>{
        setValue('article',article)
    },[article])
    return (
        <>
         <form onSubmit={secondHandleSubmit(scheduleSubmit)} className="flex items-start gap-1 flex-col">
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
                                            <Controller
                                            name="date"
                                            control={control}
                                            rules={{required:"Enter Date And Time"}}
                                            render={({field,fieldState})=><DateInput
                                            {...field}
                                            
                                            // {secondRegister('date',{required:"Enter Date And Time"})}
                                                granularity="second"
                                                label="Date and time"
                                                className="w-max"
                                                classNames={{
                                                    label:"font-semibold"
                                                }}
                                                labelPlacement="outside"
                                                errorMessage={fieldState.error?.message}
                                                isInvalid={!!fieldState.error}
                                                // value={date}
                                                // onChange={(e)=>{
                                                //     console.log(e)
                                                // }}
                                            />}
                                            />
                                            <Input errorMessage={secondErrors.title?.message as any}
                                                isInvalid={!!secondErrors.title} className="w-max" classNames={{
                                                    label:"font-semibold"
                                                }} label="Title Of Article" labelPlacement="outside" placeholder="Enter Title" {...secondRegister('title',{required:"Enter Article Title"})}/>
                                        
                                        <Button className="px-8 py-2 rounded-lg bg-blue-500 min-w-[15rem] text-white" type="submit">Schedule</Button>
                                        </div>
                                    </form>
        </>
    )
}