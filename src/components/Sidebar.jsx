import { BarChart2, Settings, Calendar, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
    { name: "Overview", icon: BarChart2, color: "#6361f1", href: "/" },
    { name: "Schedule", icon: Calendar, color: "#3B82F6", href: "/schedule" },
    { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
    return (
        <motion.div
            className={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out flex-shrink-0 bg-gray-800 border-r border-gray-700`}
            animate={{ width: isOpen ? 256 : 80 }}
            style={{ backgroundColor: "#1F2937" }} // Ensure background covers full height
        >
            <div className="h-full p-4 flex flex-col">
                {/* Toggle Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
                >
                    <Menu size={24} />
                </motion.button>

                {/* Sidebar Links */}
                <nav className="mt-8 flex-grow">
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.span
                                            className="ml-4 whitespace-nowrap"
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.2 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};

export default Sidebar;
