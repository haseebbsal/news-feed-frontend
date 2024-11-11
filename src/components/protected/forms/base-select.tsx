'use client'

import { Select, SelectItem, SelectProps } from "@nextui-org/react"
import { FieldValues, InputValidationRules, RegisterOptions, useController, } from "react-hook-form"

interface SelectPropss extends Omit<SelectProps,'children'> {
    control: any,
    rules: Omit<RegisterOptions<FieldValues, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined,
    name: string,
    children?:any
}
export default function BaseSelect({ control, name, rules, items, label, placeholder,defaultSelectedKeys,selectedKeys }: SelectPropss) {
    const { field, fieldState: { error } } = useController({ control, name, rules,defaultValue:defaultSelectedKeys })
    return (
        <>
            <Select
                items={items}
                label={label}
                // {...field}
                placeholder={placeholder}
                errorMessage={error?.message as any}
                isInvalid={!!error}
                {...field}
                labelPlacement="outside"
                // selectedKeys={}
                // selectedKeys={selectedKeys}
                defaultSelectedKeys={defaultSelectedKeys}
                classNames={{
                    label: "font-semibold !text-white"
                }}
            >
                {(animal: any) => <SelectItem key={animal.key}>{animal.label}</SelectItem>}
            </Select>
        </>
    )
}