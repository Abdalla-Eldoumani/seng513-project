const LandingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#F5F5DC]">
            <main className="flex-grow pt-20 w-full">
                {children}
            </main>
        </div>
    );
};

export default LandingLayout;