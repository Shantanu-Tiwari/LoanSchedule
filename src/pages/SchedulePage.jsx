import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AddLoanForm from "@/components/AddLoan";

const SchedulePage = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loans, setLoans] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

    // Load loans from localStorage on mount
    useEffect(() => {
        const savedLoans = JSON.parse(localStorage.getItem("loans") || "[]");
        setLoans(savedLoans);
    }, []);

    // Generate schedule whenever loans, month, or year changes
    useEffect(() => {
        generateSchedule();
    }, [selectedMonth, selectedYear, loans]);

    const isLoanActive = (loan, currentDate) => {
        const startDate = new Date(loan.startDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + loan.tenure);

        return currentDate >= startDate && currentDate <= endDate;
    };

    const getDueDateFromStartDate = (startDate) => {
        return new Date(startDate).getDate();
    };

    const generateSchedule = () => {
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        const schedule = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const currentDate = new Date(selectedYear, selectedMonth, day);

            const dueLoanPayments = loans.filter(loan => {
                const startDate = new Date(loan.startDate);
                const dueDay = startDate.getDate();
                return dueDay === day && isLoanActive(loan, currentDate);
            });

            return {
                day,
                loans: dueLoanPayments,
                totalEMI: dueLoanPayments.reduce((sum, loan) => sum + loan.emi, 0),
            };
        });

        setScheduleData(schedule);
    };

    const handleAddLoan = (newLoan) => {
        const updatedLoans = [...loans, { ...newLoan, id: Date.now() }];
        setLoans(updatedLoans);
        localStorage.setItem("loans", JSON.stringify(updatedLoans));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const getTotalEMIsForMonth = () => {
        return scheduleData.reduce((total, day) => total + day.totalEMI, 0);
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Payment Schedule</h1>
                    <p className="text-muted-foreground mt-1 text-base">Track your upcoming loan payments</p>
                </div>
                <AddLoanForm onAddLoan={handleAddLoan} />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">Monthly Overview</CardTitle>
                        <div className="flex gap-4">
                            {/* Month Selection */}
                            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                                <SelectTrigger className="w-40 bg-background border-2 hover:bg-accent hover:text-accent-foreground">
                                    <SelectValue placeholder="Select month">{months[selectedMonth]}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-background border-2">
                                    {months.map((month, index) => (
                                        <SelectItem
                                            key={index}
                                            value={index.toString()}
                                            className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                        >
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Year Selection */}
                            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                                <SelectTrigger className="w-32 bg-background border-2 hover:bg-accent hover:text-accent-foreground">
                                    <SelectValue placeholder="Select year">{selectedYear}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-background border-2">
                                    {years.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={year.toString()}
                                            className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total EMIs this month</p>
                                        <h2 className="text-2xl font-bold mt-1">{formatCurrency(getTotalEMIsForMonth())}</h2>
                                    </div>
                                    <Calendar className="w-8 h-8 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Schedule Data */}
                    <div className="space-y-4">
                        {scheduleData.map((day) => (
                            day.loans.length > 0 && (
                                <div key={day.day} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-lg font-semibold">{day.day}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Payment Due</h3>
                                            <div className="flex gap-2 mt-1">
                                                {day.loans.map((loan) => (
                                                    <Badge key={loan.id} variant="secondary" className="bg-[#6361F1]/20">
                                                        {loan.name} - {formatCurrency(loan.emi)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total Due</p>
                                        <p className="text-lg font-semibold">{formatCurrency(day.totalEMI)}</p>
                                    </div>
                                </div>
                            )
                        ))}
                        {!scheduleData.some(day => day.loans.length > 0) && (
                            <div className="text-center py-8 text-muted-foreground">
                                No payments scheduled for this month
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SchedulePage;