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
} from "@nextui-org/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const rows = [
  {
    key: "1",
    Sr_no: "1",
    Article_Title: "Understanding React Components",
    Creation_Date: "2023-09-01",
    Actions: "Edit",
  },
  {
    key: "2",
    Sr_no: "2",
    Article_Title: "Building a Table in NextUI",
    Creation_Date: "2023-09-05",
    Actions: "Edit",
  },
  {
    key: "3",
    Sr_no: "3",
    Article_Title: "JavaScript Best Practices",
    Creation_Date: "2023-09-10",
    Actions: "Edit",
  },
  {
    key: "4",
    Sr_no: "4",
    Article_Title: "Next.js Guide for Beginners",
    Creation_Date: "2023-09-15",
    Actions: "Edit",
  },
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
    key: "createdAt",
    label: "CREATION DATE",
  },
  {
    key: "domain",
    label: "Domain",
  },
  {
    key: "scheduleDate",
    label: "Schedule Date",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

export default function App() {
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const queryClient=useQueryClient()
  const deleteScheduleMutation=useMutation((id:string)=>axiosInstance.delete(`/article/scheduleArticle?id=${id}`),{
    onSuccess(data, variables, context) {
      toast.success('Article Schedule Deleted Successfully', {
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
    onError(error:any) {
      toast.error('Error In Deleting Scheduled Article', {
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
        `/article/scheduledArticles?page=${queryKey[1]}&limit=6`
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
  console.log(tableData);
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
                  // console.log(columnKey, item);
                  if(columnKey=='actions'){
                    return (
                      <TableCell className="text-black">
                        <Button isLoading={deleteScheduleMutation.isLoading} disabled={deleteScheduleMutation.isLoading} onClick={()=>deleteScheduleMutation.mutate(item._id)} className="bg-red-100">
                        <MdDelete className="text-xl text-red-600" /></Button>
                       {/* {item._id} */}
                        {/* {getKeyValue(item, columnKey)} */}
                      </TableCell>
                    );
                  }
                  if (item[columnKey]) {
                    return (
                      <TableCell className="text-black">
                        {item[columnKey]}
                        {/* {getKeyValue(item, columnKey)} */}
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
      <div className="mt-8  flex justify-center gap-4">
        {!!data?.data.lastPage && (
          <Button
            onClick={() => {
              setPage(page + 1);
            }}
            className="bg-blue-600 p-2 text-white min-w-[10rem] "
          >
            Next Page
          </Button>
        )}
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
      </div>
    </>

    // {}
  );
}
