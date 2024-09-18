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
import { useQuery } from "react-query";

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
];

export default function App() {
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const { isLoading, data, isFetching } = useQuery(
    ["scheduledArticles", page],
    ({ queryKey }) =>
      axiosInstance.get(
        `/article/scheduledArticles?page=${queryKey[1]}&limit=6`
      ),
    {
      onSuccess(data) {
        //         _id: "66eb046bb695682b3455d314"
        // title: "My Article"
        // scheduleDate: "2024-09-17T19:00:00.000Z"
        // content: "This is Article"
        // domain: "domain@domain.com"
        // createdAt: "2024-09-18T16:48:43.987Z"
        // updatedAt: "2024-09-18T16:48:43.987Z"
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
