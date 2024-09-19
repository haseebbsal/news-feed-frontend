'use client'
import RegisterForm from "@/components/protected/forms/registerForm";
import axiosInstance from "@/utils/axiosInstance";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { FaExchangeAlt } from "react-icons/fa";
export default function AdminPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const { isOpen: isOpen1, onOpen: onOpen1, onOpenChange: onOpenChange1,onClose:onClose1} = useDisclosure();
    const [page, setPage] = useState(1)
    const queryClient=useQueryClient()
    const deleteUserMutation = useMutation((data: string) => axiosInstance.delete(`/user/delete?id=${data}`), {
        onSuccess(data) {
            queryClient.invalidateQueries('user')
        },
    })
    const updateUserMutation = useMutation((data: string) => axiosInstance.put(`/user/block?id=${data}`), {
        onSuccess(data) {
            queryClient.invalidateQueries('user')
        },
    })

    const updateRollUserMutation = useMutation((data: string) => axiosInstance.put(`/user/updateRole?id=${data}`), {
        onSuccess(data) {
            queryClient.invalidateQueries('user')
        },
    })
    const searchUsersQuery=useQuery(['user',searchQuery,page],({queryKey})=>axiosInstance.get(`/user/search?name=${queryKey[1]}&page=${queryKey[2]}`))
    return (
        <>
            <div>
                <div className="flex justify-between flex-wrap gap-4 items-center">
                    <Input
                        // label="Available Breweries"
                        placeholder="Search users"
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setPage(1)
                        }}
                        // labelPlacement="outside"
                        classNames={{ label: "font-semibold text-lg" }}
                        className="w-full sm:w-1/2"
                    />

                    <button
                        onClick={() => {
                            onOpen1()
                        }}
                        className="px-4 w-full sm:w-max py-2 bg-white text-black rounded-lg ">
                        Add New User
                    </button>
                </div>
                <table className="p-4 w-full block sm:table overflow-auto mt-4">
                    <thead>
                        <tr className="bg-white text-black">
                            <th className="p-2 rounded-l-md text-left text-sm">S.No</th>
                            <th className="p-2 text-sm text-left">User Name</th>
                            <th className="p-2 text-sm text-left ">Email</th>
                            <th className="p-2 text-sm text-left ">Is Admin</th>
                            <th className="p-2 text-sm text-left ">Is Blocked</th>
                            <th className="p-2 text-sm text-left ">Change Role</th>
                            <th className="p-2 text-sm text-left rounded-r-md ">Delete user</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchUsersQuery.data?.data.data.users.map((e: any, index: number) => (
                            <tr
                                // onClick={() => navigate.push(`/brewery?id=${e._id}`)}
                                className="border-b-2  border-solid border-gray-200"
                                key={index + 1}
                            >
                                <td className="p-2 text-sm">{index + 1 < 10 ? `0${index + 1}` : `${index + 1}`}</td>
                                <td className="p-2 text-sm">{e.username}</td>
                                <td className="p-2 text-sm">{e.email}</td>
                                <td className="p-2 text-sm">{e.role==1?"No":"Yes"}</td>
                                <td className="p-2 text-sm">{e.isBlocked?"Yes":"No"}</td>
                                <td className="p-2 text-sm ">
                                <FaExchangeAlt onClick={() => {
                                        // setHuntId(e._id)
                                        updateRollUserMutation.mutate(e._id)
                                    // onOpen2()
                                    }} className="cursor-pointer bg-[#d0f5e6] text-4xl text-green-600 rounded-lg p-2 " />
                                </td>
                                <td className="p-2 text-sm flex gap-2">
                                    <AiOutlineDelete onClick={() => {
                                        // setHuntId(e._id)
                                        deleteUserMutation.mutate(e._id)
                                    // onOpen2()
                                    }} className="cursor-pointer bg-[#f5d0e1] text-4xl text-red-600 rounded-lg p-2 " />
                                    {e.isBlocked && <CgUnblock onClick={() => {
                                        updateUserMutation.mutate(e._id)
                                    }}
                                        className="cursor-pointer bg-green-100 text-4xl text-green-600 rounded-lg p-2 " />}
                                    {!e.isBlocked &&
                                        <MdBlock
                                            onClick={() => {
                                                updateUserMutation.mutate(e._id)
                                            }}
                                            className="cursor-pointer bg-yellow-100 text-4xl text-yellow-600 rounded-lg p-2 " />
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {<div className="flex flex-wrap py-4 justify-center gap-4">
                    {!!searchUsersQuery.data?.data.data.nextPage && searchUsersQuery.data?.data.data.nextPage != page && <button className="px-16 py-2 bg-[#A92223] flex justify-center rounded text-white w-max " type="button" onClick={() => {
                        setPage((prev) => prev + 1)
                    }}>Next Page</button>}

                    {
                        page != 1 && <button className="px-16 py-2 bg-[#A92223] flex justify-center rounded text-white w-max " type="button" onClick={() => {
                            setPage((prev) => prev - 1)
                        }}>Previous Page</button>
                    }
                </div>}
            </div>

            <Modal
                size={"xl"}
                isOpen={isOpen1}
                backdrop="blur"
                onOpenChange={onOpenChange1}
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col text-xl gap-1">Add New User</ModalHeader>
                            <ModalBody className="flex flex-col gap-4 pb-8">
                                <RegisterForm onClose={onClose1} />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}