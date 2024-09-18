'use client';
import axiosInstance from "@/utils/axiosInstance";
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";
import { ImSpinner2 } from "react-icons/im";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Controller, ControllerFieldState, Field, FieldValues, useController, useForm } from "react-hook-form";
import {Button, DateInput, Select, SelectItem} from "@nextui-org/react";
import ArticleForm from "@/components/protected/forms/ArticleForm";
import ArticlePublishingForm from "@/components/protected/forms/ArticlePublishing";

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
}

const websiteLinkMutation:any={
    data:{
        data:{
            link:"yessir",
            title:"yessir",
            summary:{
                relevanceIndex:"0.95"
            },
            rewriteArticle:{
                relevanceIndex:"0.95"
            }
        }
    }
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
]

const animals = [
    {key: "1", label: "https://rias-aero.com"},
  ];


  
export default function Home() {
    // const session = useSession()
    // console.log(session)
    const [originalArticle, setOriginalArticle] = useState('')
    const [rewrittenArticle, setRewrittenArticle] = useState('')
    const [summaryArticle, setSummaryArticle] = useState('')
    const {register,handleSubmit,formState:{errors}}=useForm({
        defaultValues:{
            url:"",
            keywords:""
        }
    })
    
    const publishMutation=useMutation((data:any)=>axiosInstance.post('/article/publish',data),{
        onSuccess(data, variables, context) {
            console.log('publish',data.data)
        },
    })
    // const websiteLinkMutation = useMutation((data: any) => axiosInstance.post('/url', data), {
    //     onSuccess(data) {
    //         console.log(data.data)
    //         setSummaryArticle(data.data.summary.rewrittenArticle)
    //         setRewrittenArticle(data.data.rewriteArticle.rewrittenArticle)
    //         setOriginalArticle(data.data.originalArticle)
    //         // console.log(data.data.)
    //     },
    // })

    function onSubmit(data:FieldValues) {
        websiteLinkMutation.mutate(data)
        // form.reset()
        
    }

    function scheduleSubmit(data:FieldValues){
        const date=new Date(data.date.year,data.date.month,data.date.day,data.date.hour)
        const payload={
            ...data,
            date
        }
        console.log('schedule',payload)
    }

    const publishSubmit=(data:FieldValues)=>{
        console.log('publishData',data)
        publishMutation.mutate(data)

    }

    
    return (
        <>
            <div className="w-full m-auto h-auto flex items-center pb-4">
                {!websiteLinkMutation.data && <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-8">
                    {!websiteLinkMutation.isLoading && <>
                        <div className="flex flex-col  gap-4">
                            <h1 >Keywords</h1>
                            <div className="flex flex-col gap-2">
                            <input type="text" {...register('keywords',{required:"Enter Keywords"})} id="url" className="text-black py-2 " placeholder="Enter Keywords" />
                            <p className="text-red-500">{errors.keywords?.message} </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 >Website Url</h1>
                            <div className="flex flex-col gap-2">
                            <input type="text" {...register('url',{required:"Enter Website Url"})} id="url" className="text-black py-2 " placeholder="Enter Website News URL" />
                            <p className="text-red-500">{errors.url?.message} </p>
                            </div>
                        </div>
                        <button type="submit" className="w-full  px-4 py-2 bg-white rounded-xl text-black ">Submit</button>
                    </>}
                    {websiteLinkMutation.isLoading && < ImSpinner2 className="animate-spin text-[8rem] m-auto" />}
                </form>}
                           
                <div>
                    {websiteLinkMutation.data?.data && 
                        <div className="flex gap-4 flex-wrap">
                            <a className="underline" target="_blank" href={`${websiteLinkMutation.data.data.link}`}>{websiteLinkMutation.data.data.title}</a>
                            <div className="flex p-4 rounded-lg bg-white text-black w-full sm:flex-nowrap flex-wrap gap-4">
                                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                                <p>Original Article</p>
                                <ReactQuill theme="snow" formats={formats} modules={modules} value={originalArticle} onChange={(e) => {
                                    setOriginalArticle(e)
                                }} />
                                </div>
                                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                                    <div className="flex items-start gap-1 border-b-2 pb-4 flex-col">
                                        <h1 className="font-semibold">Publish Now</h1>
                                        <ArticlePublishingForm isSubmitting={publishMutation.isLoading} article={originalArticle} publishSubmit={publishSubmit}/>
                                    </div>
                                    <div>
                                        <h1 className="font-semibold">Schedule For Publishing</h1>
                                        <ArticleForm article={originalArticle} scheduleSubmit={scheduleSubmit}/>
                                    </div>
                                    
                                </div>
                                {/* <p id="article" contentEditable className=" h-[20rem] p-4 overflow-auto">{websiteLinkMutation.data.data.originalArticle}</p> */}
                            </div>
                            <div className="flex sm:flex-nowrap flex-wrap p-4 rounded-lg bg-white w-full text-black gap-4">
                            <div className="flex flex-col gap-2 w-full sm:w-1/2">
                                    <p>Rewritten Article</p>
                                    <div className="flex gap-2">
                                        <p>Relevance Index :</p>
                                        <p>{websiteLinkMutation.data.data.rewriteArticle.relevanceIndex}</p>
                                    </div>
                                    <ReactQuill theme="snow" formats={formats} modules={modules} value={rewrittenArticle} onChange={(e) => {
                                   setRewrittenArticle(e)
                                }}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                                    <div className="flex items-start gap-1 border-b-2 pb-4 flex-col">
                                        <h1 className="font-semibold">Publish Now</h1>
                                        <ArticlePublishingForm isSubmitting={publishMutation.isLoading} article={rewrittenArticle} publishSubmit={publishSubmit}/>
                                    </div>
                                    <div>
                                        <h1 className="font-semibold">Schedule For Publishing</h1>
                                        <ArticleForm article={rewrittenArticle} scheduleSubmit={scheduleSubmit}/>
                                    </div>
                                </div>
                                    
                                {/* <p id="rewritten_article" contentEditable className=" h-[20rem] p-4 overflow-auto ">{websiteLinkMutation.data.data.rewriteArticle.rewrittenArticle}</p> */}
                                
                            </div>
                            <div className="flex sm:flex-nowrap flex-wrap p-4 rounded-lg bg-white w-full text-black gap-4">
                                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                                <div className="flex  gap-4">
                                    <p>Summary Article</p>
                                    <div className="flex  gap-2">
                                        <p>Relevance Index: </p>
                                        <p>{websiteLinkMutation.data.data.summary.relevanceIndex}</p>
                                    </div>
                                </div>
                                <ReactQuill theme="snow" formats={formats} modules={modules} value={summaryArticle} onChange={(e) => {
                                    setSummaryArticle(e)
                                }} />
                                </div>
                                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                                    <div className="flex items-start gap-1 border-b-2 pb-4 flex-col">
                                        <h1 className="font-semibold">Publish Now</h1>
                                        <ArticlePublishingForm isSubmitting={publishMutation.isLoading} article={summaryArticle} publishSubmit={publishSubmit}/>
                                    </div>
                                    <div>
                                        <h1 className="font-semibold">Schedule For Publishing</h1>
                                        <ArticleForm article={summaryArticle} scheduleSubmit={scheduleSubmit}/>
                                    </div>
                                </div>

                                {/* <p id="summary_article" contentEditable className=" h-[20rem] p-4 overflow-auto">{websiteLinkMutation.data.data.summary.rewrittenArticle}</p> */}
                               
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}
