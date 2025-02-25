import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Settings from "@/pages/Settings.jsx";
import { useQuery, useMutation } from "convex/react";
import { api } from "/convex/_generated/api.js";
import { useUser } from "@clerk/clerk-react";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, isSignedIn } = useUser();
    const syncUser = useMutation(api.users?.syncUser);
    const loans = useQuery(api.loans.getAll);

    // Sync user to Convex when they log in
    useEffect(() => {
        if (user && syncUser) {
            syncUser({
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || "unknown",
                name: user.fullName || "Unnamed User",
            });
        }
    }, [user, syncUser]);

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-900 text-gray-100 flex">
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div
                className={`flex-1 transition-all duration-300 ease-in-out p-6 ${
                    isSidebarOpen ? "ml-64" : "ml-20"
                }`}
            >
                <Routes>
                    <Route path="/" element={<OverviewPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
