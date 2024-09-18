import AdminNavbar from "@/components/protected/layout/AdminNavbar"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-[100vh] gap-8 text-white px-8">
            <AdminNavbar />
            <div>
                {children}
            </div>
        </div>
    )
}