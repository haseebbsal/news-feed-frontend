'use client'
import axiosInstance from "@/utils/axiosInstance";
import { Button, TableCell } from "@nextui-org/react";

import { MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";




export default function DeleteArticle({  item }: { item: any }) {
    const queryClient = useQueryClient()
    const deleteScheduleMutation = useMutation((id: string) => axiosInstance.delete(`/article/deleteArticle?id=${id}`), {
        onSuccess(data, variables, context) {
            toast.success('Article Deleted Successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            queryClient.invalidateQueries('scheduledArticles')
        },
        onError(error: any) {
            toast.error('Error In Deleting  Article', {
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


    return (
        <Button isLoading={deleteScheduleMutation.isLoading} disabled={deleteScheduleMutation.isLoading} onClick={() => deleteScheduleMutation.mutate(item.articleId)} className="bg-red-100">
            <MdDelete className="text-xl text-red-600" /></Button>
    )

}