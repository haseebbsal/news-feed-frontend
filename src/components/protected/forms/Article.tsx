'use client'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import ArticlePublishingForm from './ArticlePublishing';
import { useMutation } from 'react-query';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { FieldValues, useController, useForm } from 'react-hook-form';
import { Button } from '@nextui-org/react';

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

export default function Article({ value, articleUrl, text, title, publishType }: { value: string, articleUrl: string, text: string, title: string, publishType: string }) {
  const publishMutation = useMutation(
    (data: any) => axiosInstance.post("/article/publish", data),
    {
      onSuccess(data, variables, context) {
        toast(<div className='flex flex-col gap-2 items-center  p-4'>
          <p className=' text-green-400'>Article Published Successfully</p>
          <a target='_blank' className="px-8 py-2 rounded-lg bg-blue-500 w-max text-white" href={`${data.data.data}`}>Visit Site</a>
        </div>)
        // toast.success('Article Published Successfully', {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // })
        console.log("publish", data.data);
      },
      onError(error: any) {
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

  const { control, handleSubmit } = useForm()

  const publishSubmit = (data: FieldValues) => {
    console.log("publishData", data);
    publishMutation.mutate({ ...data, articleUrl, publishType });
  };

  const { field, fieldState } = useController({ control, name: "article", defaultValue: value })
  return (
    <>
      <form onSubmit={handleSubmit(publishSubmit)} className="flex p-4 rounded-lg bg-white text-black w-full sm:flex-nowrap flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full sm:w-1/2">
          <p>{text}</p>
          <ReactQuill
            theme="snow"
            {...field}
            onChange={field.onChange}
            formats={formats}
            modules={modules}
            defaultValue={value}
          />
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-1/2">
          <div className="flex items-start gap-1  pb-4 flex-col">
            <h1 className="font-semibold">Publish Now</h1>
            <ArticlePublishingForm
              link={title}
              control={control}
              publishMutation={publishMutation}
            />
          </div>
        </div>
      </form>
    </>
  )
}