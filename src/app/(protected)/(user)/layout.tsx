import Navbar from "@/components/protected/layout/Navbar"

export default function ProtectedLayout({ children }:{children:React.ReactNode}){
    return (
        <div className="flex min-h-[100vh] flex-col gap-8 text-white px-8">
            <Navbar/>
            <div>
                {children}
            </div>
        </div>
    )
}