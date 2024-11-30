'use client'
import axiosInstance from "@/utils/axiosInstance";
import { Button, DateInput, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";
import { Control, FieldValues, useController, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
const animals = [
  { key: "1", label: "https://news.rias-aero.com" },
];




export default function ArticlePublishingForm({control,publishMutation,link}:{control:Control<FieldValues>,publishMutation:any,link:string}) {

  const {field,fieldState:{error}}=useController({control:control,name:'domain',rules:{required:"Select A Destination URL"},defaultValue:'1'})
  const {field:field1,fieldState:{error:error1}}=useController({control:control,name:'title',rules:{required:"Enter Article Title"},defaultValue:link})
  

 
  return (
    <>
      <div className="flex items-start gap-1 flex-col">
        <div className="flex flex-wrap items-end gap-4">
          <Select
            items={animals}
            label="Select Destination URL"
            {...field}
            errorMessage={error?.message as any}
            isInvalid={!!error}
            labelPlacement="outside"
            defaultSelectedKeys={'1'}
            className="max-w-xs"
            classNames={{
              label: "font-semibold"
            }}
          >
            {(animal) => <SelectItem key={animal.key}>{animal.label}</SelectItem>}
          </Select>

          <Input {...field1} errorMessage={error1?.message as any}
          defaultValue={link}
            isInvalid={!!error1} className="w-max" classNames={{
              label: "font-semibold"
            }} label="Title Of Article" labelPlacement="outside" placeholder="Enter Title" />

          <Button isLoading={publishMutation.isLoading} disabled={publishMutation.isLoading} className="px-8 py-2 rounded-lg bg-blue-500 min-w-[15rem] text-white" type="submit">Publish</Button>
        </div>
      </div>
    </>
  )
}