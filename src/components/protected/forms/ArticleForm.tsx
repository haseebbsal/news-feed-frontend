'use client'
import axiosInstance from "@/utils/axiosInstance";
import { Button, DateInput, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";
import { Control, Controller, FieldValues, useController, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
const animals = [
    { key: "1", label: "https://rias-aero.com" },
];



type ScheduleData = {
    title: String;
    domain: string;
    article: String;
    scheduleDate: string
};
export default function ArticleForm({ article }: { article: any }) {
    const { register: secondRegister, handleSubmit: secondHandleSubmit, formState: { errors: secondErrors }, control, setValue } = useForm({
        defaultValues: {
            date: null,
            domain: "1",
            article: "",
            title: ""
        }
    })
    const { field, fieldState } = useController({
        name: "date",
        control,
        // defaultValue:""
        rules: {
            required: "Enter Date "
        }
    })

    const scheduleMutation = useMutation((data: ScheduleData) =>
        axiosInstance.post("/article/schedule", data),
        {
            onSuccess(data) {
                toast.success('Article Scheduled Successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
                console.log('Schedule', data.data)
            },
            onError(error: any) {
                console.log(error)
                toast.error('Error In Scheduling Data', {
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

    function scheduleSubmit(data: FieldValues) {
        const date = new Date(
            data.date.year,
            data.date.month - 1,
            data.date.day
        ).toLocaleDateString()
        const payload = {
            ...data,
            scheduleDate: date,
        } as ScheduleData;
        scheduleMutation.mutate(payload);
        console.log("schedule", payload);
    }
    useEffect(() => {
        setValue('article', article)
    }, [article])
    return (
        <>
            <form onSubmit={secondHandleSubmit(scheduleSubmit)} className="flex items-start gap-1 flex-col">
                {/* <button className="px-8 py-2 rounded-lg bg-blue-500 min-w-[15rem] text-white">Publish</button> */}
                <div className="flex flex-wrap items-end gap-4">
                    <Select
                        items={animals}
                        label="Select Domain"
                        {...secondRegister('domain', { required: "Select A Domain" })}
                        errorMessage={secondErrors.domain?.message as any}
                        isInvalid={!!secondErrors.domain}
                        labelPlacement="outside"
                        // placeholder="Select an animal"
                        defaultSelectedKeys={'1'}
                        className="max-w-xs"
                        classNames={{
                            label: "font-semibold"
                        }}
                    >
                        {(animal) => <SelectItem key={animal.key}>{animal.label}</SelectItem>}
                    </Select>
                    <Controller
                        name="date"
                        control={control}
                        rules={{ required: "Enter Date And Time" }}
                        render={({ field, fieldState }) =>
                            <DateInput label={"Date"} {...field} classNames={{
                                label: "font-semibold"
                            }} labelPlacement="outside" className="w-max" errorMessage={fieldState.error?.message}
                                isInvalid={!!fieldState.error} />
                            // <DateInput
                            // {...field}

                            // // {secondRegister('date',{required:"Enter Date And Time"})}
                            //     granularity="second"
                            //     label="Date and time"
                            //     className="w-max"
                            // classNames={{
                            //     label:"font-semibold"
                            // }}
                            //     labelPlacement="outside"
                            // errorMessage={fieldState.error?.message}
                            // isInvalid={!!fieldState.error}
                            //     // value={date}
                            //     // onChange={(e)=>{
                            //     //     console.log(e)
                            //     // }}
                            // />
                        }
                    />
                    <Input errorMessage={secondErrors.title?.message as any}
                        isInvalid={!!secondErrors.title} className="w-max" classNames={{
                            label: "font-semibold"
                        }} label="Title Of Article" labelPlacement="outside" placeholder="Enter Title" {...secondRegister('title', { required: "Enter Article Title" })} />

                    <Button isLoading={scheduleMutation.isLoading} disabled={scheduleMutation.isLoading} className="px-8 py-2 rounded-lg bg-blue-500 min-w-[15rem] text-white" type="submit">Schedule</Button>
                </div>
            </form>
        </>
    )
}