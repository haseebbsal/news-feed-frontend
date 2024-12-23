"use client";
import axiosInstance from "@/utils/axiosInstance";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { CiEdit } from "react-icons/ci";
import Link from "next/link";
import DeleteArticle from "@/components/protected/PublishedArticleRow";
import { Domains } from "@/utils";
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });


enum Publish {
  "Original" = 1,
  "ReWrite",
  "Summary",
  "Custom"
}


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

const columns = [
  {
    key: "no",
    label: "SR.NO",
  },
  {
    key: "title",
    label: "ARTICLE TITLE",
  },
  {
    key: "article",
    label: "Article"
  },
  {
    key: "createdAt",
    label: "Published Date",
  },
  {
    key: "domain",
    label: "Domain"
  },
  {
    key: "publishType",
    label: "Publish Type"
  },
  {
    key: "actions",
    label: "Actions",
  },
];


export default function App() {
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);
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
  const { isLoading, data, isFetching } = useQuery(
    ["scheduledArticles", page],
    ({ queryKey }) =>
      axiosInstance.get(
        `/article/publishedArticles?page=${queryKey[1]}&limit=6`
      ),
    {
      onSuccess(data) {
        const newData = data.data.data.map((e: any, index: number) => {
          return {
            ...e,
            scheduleDate: new Date(e.scheduleDate).toLocaleDateString(),
            createdAt: new Date(e.createdAt).toLocaleDateString(),
            no: index + 1 < 10 ? `0${index + 1}` : index + 1,
          };
        });
        setTableData(newData);
      },
    }
  );
  return (
    <>
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        {
          <TableBody items={tableData}>
            {(item: any) => (
              <TableRow key={item.no}>
                {(columnKey) => {
                  if (columnKey == 'actions') {
                    return (
                      <TableCell className="text-black w-max">
                        <div className="flex gap-2 w-max">
                          <Link href={`/scheduled-articles/edit?id=${item.articleId}`} className="bg-blue-100 px-8 flex items-center rounded-xl">
                            <CiEdit className="text-xl text-blue-600" /></Link>
                          <DeleteArticle item={item} />

                        </div>

                      </TableCell>
                    );
                  }
                  if (columnKey == 'article') {
                    return (
                      <TableCell className="publish w-[40rem]">
                        <ReactQuill
                          theme="snow"
                          className="text-black w-full"
                          formats={formats}
                          modules={modules}
                          value={item[columnKey]}
                        />
                      </TableCell>
                    )
                  }

                  if (columnKey == 'domain') {
                    return (
                      <TableCell className="text-black">
                        {Domains[item[columnKey]]}
                      </TableCell>
                    );
                  }
                  if (columnKey == 'publishType') {
                    return (
                      <TableCell className="text-black">
                        {Publish[item[columnKey] as '1' | '2' | '3']}
                      </TableCell>
                    );
                  }


                  if (item[columnKey]) {
                    return (
                      <TableCell className="text-black">
                        {item[columnKey]}
                      </TableCell>
                    );
                  }
                  return <></>;
                }}
              </TableRow>
            )}
          </TableBody>
        }
      </Table>
      <div className="mt-8 mb-8 flex justify-center gap-4">
        {page != 1 && (
          <Button
            onClick={() => {
              setPage(page - 1);
            }}
            className="bg-blue-600 p-2 text-white min-w-[10rem] "
          >
            Previous Page
          </Button>
        )}
        
        {!!data?.data.nextPage && (
          <Button
            onClick={() => {
              setPage(page + 1);
            }}
            className="bg-blue-600 p-2 text-white min-w-[10rem] "
          >
            Next Page
          </Button>
        )}
      </div>
    </>
  );
}
