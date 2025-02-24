import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import Sidebar from "./components/Sidebar.jsx";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                </Routes>
            </div>
        </div>
    );
}

export default App;
