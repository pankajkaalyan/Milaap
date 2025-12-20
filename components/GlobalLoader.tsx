import { useLoader } from "../context/LoaderContext";

const GlobalLoader = () => {
    const { loading } = useLoader();

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="relative h-14 w-14">
                    <div className="absolute inset-0 rounded-full border-4 border-orange-500/30 animate-ping"></div>
                    <div className="h-14 w-14 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
                </div>


                {/* Optional text */}
                <p className="text-sm font-medium text-white tracking-wide">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default GlobalLoader;
