// OverviewPage.jsx
import { useState, useEffect } from "react";
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
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        const savedLoans = JSON.parse(localStorage.getItem("loans") || "[]");
        if (savedLoans.length === 0) {
            const mockLoans = [
                {
                    id: 1,
                    name: "Home Loan",
                    amount: 250000,
                    interestRate: 3.5,
                    startDate: "2024-01-15",
                    tenure: 360,
                    emi: 1122.61,
                    status: "active",
                },
                {
                    id: 2,
                    name: "Car Loan",
                    amount: 35000,
                    interestRate: 4.5,
                    startDate: "2024-02-01",
                    tenure: 60,
                    emi: 652.4,
                    status: "active",
                },
            ];
            localStorage.setItem("loans", JSON.stringify(mockLoans));
            setLoans(mockLoans);
        } else {
            setLoans(savedLoans);
        }
    }, []);

    const handleAddLoan = (newLoan) => {
        const updatedLoans = [...loans, { ...newLoan, id: Date.now() }];
        setLoans(updatedLoans);
        localStorage.setItem("loans", JSON.stringify(updatedLoans));
    };

    const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalEMI = loans.reduce((sum, loan) => sum + loan.emi, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Loan Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage and track all your loans in one place</p>
                </div>
                <AddLoanForm onAddLoan={handleAddLoan} />
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
                {loans.map((loan) => (
                    <LoanCard key={loan.id} loan={loan} />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {loans.length > 0 && (
                    <>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={loans}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'gray' }}
                                    interval={0}
                                    style={{
                                        '& .recharts-text:hover': {
                                            fill: 'white'
                                        }
                                    }}
                                />
                                <YAxis tick={{ fill: 'gray' }} />
                                <Tooltip
                                    content={<CustomBarTooltip />}
                                    cursor={{ fill: 'rgba(99, 97, 241, 0.1)' }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="emi"
                                    fill="#6361F1"
                                    radius={[4, 4, 0, 0]}
                                />
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
                    </>
                )}
            </div>
        </div>
    );
}