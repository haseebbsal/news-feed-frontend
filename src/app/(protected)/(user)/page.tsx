"use client";
import axiosInstance from "@/utils/axiosInstance";
import { useState } from "react";
import { useMutation } from "react-query";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';
import {
  FieldValues,
  useForm,
} from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import ArticlePublishingForm from "@/components/protected/forms/ArticlePublishing";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Article from "@/components/protected/forms/Article";

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

const websiteLinkMutation: any = {
  data: {
    data: {
      link: "yessir",
      title: "yessir",
      summary: {
        relevanceIndex: "0.95",
      },
      rewriteArticle: {
        relevanceIndex: "0.95",
      },
      relevanceIndex: 0.7
    },
  },
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

const animals = [{ key: "1", label: "https://rias-aero.com" }];



export default function Home() {
  const [data, setData] = useState<any>()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();


  const websiteLinkMutation = useMutation((data: any) => axiosInstance.post('/url', data), {
    onSuccess(data) {
      console.log(data.data)
      setData(data.data)
    },
    onError(error: any) {
      const { message, data } = error.response.data
      console.log(data)
      if (!message) {
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
      else {
        toast.error('Article Relevance Index is Low', {
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
    },
  })

  function onSubmit(data: FieldValues) {
    websiteLinkMutation.mutate(data);
    // form.reset()
  }

  return (
    <>
      <div className="w-full  h-auto flex items-center justify-center pb-4">
        {!data && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full items-center gap-8"
          >
            <Input
              isInvalid={!!errors.keywords}
              errorMessage={errors.keywords?.message as any}
              label="Keywords"
              labelPlacement="outside"
              classNames={{ label: "!text-white" }}
              type="text"
              {...register("keywords", { required: "Enter Keywords" })}
              id="url"
              placeholder="Enter Keywords"
            />
            <Input
              isInvalid={!!errors.url}
              errorMessage={errors.url?.message as any}
              label="Article Url"
              labelPlacement="outside"
              classNames={{ label: "!text-white" }}
              type="text"
              {...register("url", { required: "Enter Article Url" })}
              id="url"
              placeholder="Enter Article URL"
            />
            <Input
              isInvalid={!!errors.relevanceIndex}
              errorMessage={errors.relevanceIndex?.message as any}
              label="Relevance Index Score"
              labelPlacement="outside"
              classNames={{ label: "!text-white" }}
              type="number"
              min="0"
              max={"1"}
              step={"0.01"}
              {...register("relevanceIndex", { required: "Enter Relevance Index Score" })}
              id="url"
              placeholder="Enter Relevance Index Score"
            />
            <Button
              isLoading={websiteLinkMutation.isLoading}
              isDisabled={websiteLinkMutation.isLoading}
              type="submit"
              className="w-full  px-4  bg-white rounded-xl text-black "
            >
              Submit
            </Button>
          </form>
        )}
        {data && <div className="w-full">
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between w-full items-center flex-wrap gap-4 ">
                <a
                  className="underline"
                  target="_blank"
                  href={`${data.link}`}
                >
                  {data.title}
                </a>
                <Button onClick={() => setData(null)} className="bg-blue-400 sm:w-max w-full text-white">Back</Button>
              </div>
              <div className="flex gap-4 flex-wrap">
                <p>
                  Keywords:
                </p>
                <p>{getValues().keywords}</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <p>
                  Calculated Relevance Index:
                </p>
                <p>{data.relevanceIndex}</p>
              </div>
            </div>
            <Article publishType="1" text="Original Article" title={data.title} articleUrl={data.link} value={data.original} />
            <Article publishType="2" text="Rewritten Article" title={data.title} articleUrl={data.link} value={data.rewritten} />
            <Article publishType="3" text="Summary Article" title={data.title} articleUrl={data.link} value={data.summary} />
          </div>
        </div>}
      </div>
    </>
  );
}
