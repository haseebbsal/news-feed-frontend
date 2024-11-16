'use client'

import axiosInstance from "@/utils/axiosInstance"
import { Button, Input } from "@nextui-org/react"
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues, useController, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query"
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';


const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default function Edit({ searchParams: { id } }: { searchParams: { id: string } }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const getPublishedData = useQuery(['singlePublished', id], ({ queryKey }) => axiosInstance.get(`/article/publishedArticle?id=${queryKey[1]}`), {
    onSuccess(data) {
      field.onChange(data.data.data.article)
      field1.onChange(data.data.data.title)
    },

  })
  const updateMutation = useMutation((data: FieldValues) => axiosInstance.put(`/article/update?id=${id}`, data), {
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries('scheduledArticles')
      router.push('/scheduled-articles')
    },
  })
  const { handleSubmit, control } = useForm()
  function Submit(e: FieldValues) {
    console.log(e)
    updateMutation.mutate(e)
  }
  const { field, fieldState: { error } } = useController({ control: control, name: 'content' })
  const { field: field1, fieldState: { error: error1 } } = useController({ control: control, name: 'title' })
  return (
    <>
      <div className="w-full  h-auto flex flex-col gap-2 pb-4">
        <h1>Edit Published Article</h1>
        <form onSubmit={handleSubmit(Submit)} className="flex flex-col gap-4 edit">
          <Input {...field1} type="text" />
          <ReactQuill
            {...field}
            onChange={field.onChange}
            theme="snow"
            className="text-black bg-white w-full"
            formats={formats}
            modules={modules}
          />
          <div className="flex gap-4 flex-wrap">
            <Button className="bg-blue-400 sm:w-[10rem] w-full text-white" type="submit" isLoading={updateMutation.isLoading} isDisabled={updateMutation.isLoading}>Update Article</Button>
            <Link className="bg-blue-400 sm:w-[10rem] w-full text-white flex justify-center items-center rounded-xl" href={'/scheduled-articles'}>Cancel</Link>
          </div>
        </form>
      </div>

    </>
  )
}