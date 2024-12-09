'use client'
import axiosInstance from "@/utils/axiosInstance";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function Domains() {
    const [domains, setDomains] = useState<any>([])
    const {register,handleSubmit,formState:{errors},setValue}=useForm()
    const queryClient=useQueryClient()
    const addDomainMutation=useMutation((data:any)=>axiosInstance.post('/admin/domains',data),{
        onSuccess(data, variables, context) {
            console.log('added domain',data.data.data)
            toast.success('Domains Updated Successfully')
        },
    })

    const deleteDomainMutation=useMutation((data:string)=>axiosInstance.delete(`/admin/domain?id=${data}`),{
        onSuccess(data, variables, context) {
            console.log('deleted',data)
        },
    })

    // wwfww

    const getDomainsQuery=useQuery(['domains'],()=>axiosInstance.get('/admin/domains'),{
        onSuccess(data) {
            setDomains(data.data.data.domains)
        },
    })
    function DomainSubmit(e:FieldValues){
        console.log(e)
        addDomainMutation.mutate(e)
    }

    console.log('erros',errors)
    return (
        <>
            <div className="flex flex-col w-full gap-4 sm:w-1/2 ">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-xl">Domains</h1>
                    <Button onClick={()=>setDomains([...domains,''])} className="bg-blue-400 text-white">Add Domain</Button>
                </div>
                {!getDomainsQuery.isLoading && <form onSubmit={handleSubmit(DomainSubmit)} className="flex flex-col gap-4">
                    {domains.map((e: any,index:number) => <div className="flex gap-4">
                        <Input defaultValue={e.domain} isInvalid={!!(errors?.domains as any)?.[index]?.domain.message} errorMessage={(errors?.domains as any)?.[index]?.domain.message} {...register(`domains.${index}.domain`,{required:"Enter Domain"})}/> 
                        <Button type="button" onClick={() => {
                        setDomains(domains.filter((_: any, i: number) => i != index))
                        setValue('domains', domains.filter((_: any, i: number) => i != index))
                    }
                    } className="bg-red-100">
                        <MdDelete className="text-xl text-red-600" /></Button></div>)}

                        {domains.length>0 && <Button isLoading={addDomainMutation.isLoading} isDisabled={addDomainMutation.isLoading} className="bg-blue-400 sm:w-[10rem] w-full text-white" type="submit"  >Update Domains</Button>}
                        
                </form>}
                
            </div>
        </>
    )
}