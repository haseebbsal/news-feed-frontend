// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RegisterForm from "@/components/protected/forms/registerForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function Register() {
    // const session = await getServerSession(authOptions)
    // if (session) {
    //     redirect('/')
    // }

    return (
        <>
            {/* <RegisterForm/> */}
        </>
    )
}