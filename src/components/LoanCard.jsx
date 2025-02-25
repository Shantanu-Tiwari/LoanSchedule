import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Trash } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api.js";
import { Button } from "@/components/ui/button";

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case "active":
            return "bg-[#6361f1] text-white";
        case "paid":
            return "bg-[#6EE7B7] text-gray-900";
        case "overdue":
            return "bg-red-500 text-white";
        default:
            return "bg-gray-500 text-white";
    }
};

const formatCurrency = (value) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(numericValue);
};

const formatDate = (date) => {
    try {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch (error) {
        console.error("Invalid date format:", date);
        return "Invalid Date";
    }
};

const LoanCard = ({ loan }) => {
    const removeLoan = useMutation(api.loans.remove);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this loan?")) {
            await removeLoan({ loanId: loan._id });
        }
    };

    return (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Card className="border border-gray-700 shadow-lg bg-gray-900 text-white rounded-xl p-4 h-full">
                <CardHeader className="p-0">
                    <CardTitle className="flex items-center justify-between">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="text-left" aria-label={`Loan name: ${loan.name}`}>
                                    <span className="text-lg font-semibold truncate max-w-[12rem] md:max-w-[16rem]">
                                        {loan.name}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{loan.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(loan.status || "active")}`} role="status">
                            {loan.status || "Active"}
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-400">Amount</p>
                            <p className="font-semibold">{formatCurrency(Number(loan.amount) || 0)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">EMI</p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="flex items-center gap-1" aria-label="Monthly EMI amount">
                                        <p className="font-semibold">{formatCurrency(Number(loan.emi) || 0)}</p>
                                        <Info className="w-4 h-4 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Monthly installment amount</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Interest Rate</p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="flex items-center gap-1">
                                        <p className="font-semibold">{(Number(loan.interestRate) || 0).toFixed(2)}%</p>
                                        <Info className="w-4 h-4 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Annual interest rate applied to the loan</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Start Date</p>
                            <p className="font-semibold">{formatDate(loan.startDate)}</p>
                        </div>
                    </div>

                    {/* Keep only the delete button */}
                    <div className="flex justify-end mt-4">
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

LoanCard.propTypes = {
    loan: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        interestRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        startDate: PropTypes.string.isRequired,
        tenure: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        emi: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        status: PropTypes.string,
    }).isRequired,
};

export default LoanCard;
