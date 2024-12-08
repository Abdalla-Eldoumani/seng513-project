import { AuthProvider } from "@/context/AuthContext";

const DashboardLayout = ({ children }: {children: React.ReactNode}) => {

    return (
        <AuthProvider>
            <div className="h-full relative">
                <div className="h-full">
                    {children}
                </div>
            </div>
        </AuthProvider>
    );
}
 
export default DashboardLayout;