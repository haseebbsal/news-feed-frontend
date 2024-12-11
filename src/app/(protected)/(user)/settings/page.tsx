'use client'

import BaseSelect from "@/components/protected/forms/base-select"
import axiosInstance from "@/utils/axiosInstance"
import { Button, Checkbox, Input, Textarea, TimeInput } from "@nextui-org/react"
import { useState } from "react"
import { FieldValues, useController, useForm } from "react-hook-form"
import { ImSpinner10 } from "react-icons/im"
import { MdAdd, MdDelete } from "react-icons/md"
import { useMutation, useQuery } from "react-query"
import { toast } from "react-toastify"
import { Time } from "@internationalized/date";
import { animals } from "@/utils"

const timeOfCheck = {
    "1": "Once Per Day",
    "2": "Once Per 3 Days",
    "3": "Once Per Week",
    "4": "Once Per 2 Weeks",
    "5": "Once Per Month",
    "6": "Once Per 3 months",
    "7": "Once Per 6 months",
    "8": "Once Per Year"
}

const items = [
    {  domain: "Once Per Day" },
    {  domain: 'Once Per 3 Days' },
    {  domain: 'Once Per Week' },
    {  domain: 'Once Per 2 Weeks' },
    {  domain: 'Once Per Month' },
    {  domain: 'Once Per 3 Months' },
    {  domain: 'Once Per 6 Months' },
    {  domain: 'Once Per Year' },
]


export default function Settings() {
    const getSettingsQuery = useQuery(['settings'], () => axiosInstance.get('/article/scheduledArticle'), {
        onSuccess(data) {
            setUrls(data.data.data.urls)
            setValue('time', new Time(data.data.data.periodicity.hour, data.data.data.periodicity.minute))
        },
        refetchOnWindowFocus: false
    })
    const [urls, setUrls] = useState<any>([])
    const { handleSubmit, register, setValue, formState: { errors }, control, getValues } = useForm()
    const updateSettings = useMutation((data: any) => axiosInstance.post('/article/schedule', data), {
        onSuccess(data, variables, context) {
            console.log('updated', data.data)
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

        }, onError(error: any) {
            const { message, data } = error.response.data
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
        }
    })

    const uploadSearch = useMutation(() => axiosInstance.post('/article/launchSearch'), {
        onSuccess(data, variables, context) {
            toast(<div className="flex flex-col gap-4">
                <p className="text-green-400">Search Completed Successfully!</p>
                <p>Total Articles Published: {data.data.totalPublished}/{data.data.totalArticles}</p>
            </div>)
        },
        onError(error: any) {
            const { message, data } = error.response.data
            toast.error(message, {
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
    function Submit(e: FieldValues) {
        console.log('values', e)
        const hour = e.time.hour
        const minute = e.time.minute
        // const time = `${hour >= 12 ? `${hour == 12 ? '12' : `${hour - 12}`}` : !hour ? '12' : hour}:${minute < 10 ? `0${minute}` : minute} ${hour >= 12 ? "pm" : "am"}`
        // console.log('time', time)
        let timeOfCheck = Number(e.timeOfCheck)
        const data = {
            ...e,
            timeOfCheck,
            periodicity: {
                hour, minute
            }
        }
        updateSettings.mutate(data)
    }

    const { field, fieldState: { error } } = useController({ control, name: 'time', rules: { required: true } })

    const getDomainsQuery=useQuery(['domains'],()=>axiosInstance.get('/admin/domains'))

    // console.log(errors)
    return (
        <>
            {!getSettingsQuery.isLoading && !getDomainsQuery.isLoading && <div className="flex flex-col gap-4 w-full">
                <h1 className="text-3xl">Settings</h1>
                <form onSubmit={handleSubmit(Submit)} className="flex flex-col gap-4 sm:w-1/2 w-full">
                    <div className="flex gap-4 items-center">
                        <BaseSelect name="domain" defaultSelectedKeys={getSettingsQuery.data?.data.data.domain} rules={{ required: "Select Destination URL" }} items={getDomainsQuery.data?.data.data.domains} label="Destination URL" placeholder="Select Destination URL" control={control} />

                        <BaseSelect defaultSelectedKeys={getSettingsQuery.data?.data.data.timeCheckType ? `${getSettingsQuery.data?.data.data.timeCheckType}` : getSettingsQuery.data?.data.data.timeCheckType} name="timeOfCheck" rules={{ required: "Select Time Of Check" }} items={items} label="Periodicity" placeholder="Select Time Of Check" control={control} />

                    </div>
                    <div className="flex gap-4 items-center">
                        <BaseSelect defaultSelectedKeys={getSettingsQuery.data?.data.data.publishType} name="publishType" rules={{ required: "Select Publish Type" }} items={[{  domain: "Original" }, { domain: "Rewrite" }, { domain: "Summary" }]} label="Publish Type" placeholder="Select Publish Type" control={control} />
                        <Input
                            label="Relevance Index Score"
                            labelPlacement="outside"
                            {...register('relevanceIndex', { required: "Select Relevance Index", min: { value: 0, message: "Minimum Value is 0" }, max: { value: 1, message: "Maximum Value Is 1" } })}
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
                        <TimeInput labelPlacement="outside"  {...field} isInvalid={!!error} errorMessage={error?.message} label="Time Of Check" classNames={{ label: "!text-white" }} />
                    </div>

                    <div className="flex flex-col gap-4 items-center">
                        <Textarea label="Keywords"
                            defaultValue={getSettingsQuery.data?.data.data.keywords}
                            {...register('keywords', { required: "Enter Keywords" })}
                            errorMessage={errors.keywords?.message as any}
                            isInvalid={!!errors.keywords}
                            classNames={{ label: "!text-white" }}
                            labelPlacement="outside" placeholder="Enter Keywords..." />
                        <Input
                            label="Article Limit"
                            labelPlacement="outside"
                            {...register('limit', { required: "Enter Article Limit", min: { value: 0, message: "Minimum Value is 0" } })}
                            defaultValue={getSettingsQuery.data?.data.data.limit}
                            errorMessage={errors.relevanceIndex?.message as any}
                            isInvalid={!!errors.relevanceIndex}
                            classNames={{ label: "!text-white" }}
                            type="number"
                            min="0"
                            step={"1"}
                            placeholder="Enter Article limit"
                        />
                        <Checkbox className="self-start" {...register('generateImages')} defaultSelected={getSettingsQuery.data?.data.data.generateImages}><p className="text-white">Generate Images</p></Checkbox>

                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                            <h1>RSS FEEDS</h1>
                            <Button onClick={() => setUrls((prev: any) => [...prev, ''])} className="bg-green-100">
                                <MdAdd className="text-xl text-green-600" /></Button>
                        </div>
                        {urls.map((e: string, index: number) => <div className="flex gap-4 justify-between">
                            <Input
                                {...register(`urls.${index}`, { required: "Enter RSS Feed" })}
                                defaultValue={e}
                                errorMessage={(errors as any).urls?.[index]?.message as any}
                                isInvalid={!!(errors as any).urls?.[index]}
                                classNames={{ label: "!text-white" }}
                                type="text"
                                id="url"
                                placeholder="Enter RSS Feed URL"
                            /><Button onClick={() => {
                                setUrls(urls.filter((_: any, i: number) => i != index))
                                setValue('urls', urls.filter((_: any, i: number) => i != index))
                            }
                            } className="bg-red-100">
                                <MdDelete className="text-xl text-red-600" /></Button>
                        </div>)}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        <Button className="bg-blue-400 sm:w-[10rem] w-full text-white" type="submit" isLoading={updateSettings.isLoading} isDisabled={updateSettings.isLoading} >Update Settings</Button>
                        <Button className="bg-blue-400 sm:w-[10rem] w-full text-white" type="button" onClick={() => uploadSearch.mutate()} isLoading={uploadSearch.isLoading} isDisabled={uploadSearch.isLoading} >Launch Search</Button>

                    </div>

                </form>
            </div>}
            {getSettingsQuery.isLoading &&
                <div className="flex justify-center items-center min-h-80">
                    <ImSpinner10 className="animate-spin text-7xl" />
                </div>
            }
        </>
    )
}