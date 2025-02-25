import { useState } from "react";
import { useQuery } from "convex/react";
import { api} from "../../convex/_generated/api.js";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LoanCard from "@/components/LoanCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Tooltip, ResponsiveContainer, XAxis, YAxis, Legend, Cell } from "recharts";
import AddLoanForm from "@/components/AddLoan";

const COLORS = ['#6361F1', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B6B9E'];

// Custom tooltip component for the bar chart
const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                <p className="text-white font-medium">{label}</p>
                <p className="text-[#6361F1]">
                    EMI: {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export default function OverviewPage() {
    // Fetch loans from Convex
    const loans = useQuery(api.loans.getAll) || [];

    const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalEMI = loans.reduce((sum, loan) => sum + loan.emi, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Loan Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage and track all your loans in one place</p>
                </div>
                <AddLoanForm />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Total Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {formatCurrency(totalAmount)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Monthly EMI: {formatCurrency(totalEMI)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loans.length > 0 ? (
                    loans.map((loan) => <LoanCard key={loan._id} loan={loan} />)
                ) : (
                    <p className="text-gray-400">No loans found.</p>
                )}
            </div>
            {loans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={loans}>
                            <XAxis dataKey="name" tick={{ fill: 'gray' }} />
                            <YAxis tick={{ fill: 'gray' }} />
                            <Tooltip content={<CustomBarTooltip />} />
                            <Legend />
                            <Bar dataKey="emi" fill="#6361F1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={loans}
                                dataKey="amount"
                                nameKey="name"
                                fill="#4f4bd4"
                                label
                            >
                                {loans.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
