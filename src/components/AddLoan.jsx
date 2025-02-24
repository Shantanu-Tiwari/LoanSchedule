import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const AddLoanForm = ({ onAddLoan }) => {
    const [open, setOpen] = useState(false);
    const initialLoanState = {
        name: "",
        amount: "",
        interestRate: "",
        startDate: "",
        tenure: "",
        emi: "",
    };

    const [newLoan, setNewLoan] = useState(initialLoanState);

    const handleSubmit = () => {
        // Check if all required fields are filled
        if (Object.values(newLoan).some(value => value === "")) {
            alert("Please fill in all fields.");
            return;
        }

        // Convert numeric fields to numbers and add status
        const processedLoan = {
            ...newLoan,
            amount: Number(newLoan.amount),
            interestRate: Number(newLoan.interestRate),
            tenure: Number(newLoan.tenure),
            emi: Number(newLoan.emi),
            status: "active"
        };

        onAddLoan(processedLoan);
        setNewLoan(initialLoanState); // Reset form
        setOpen(false); // Close dialog after submission
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-[#6361F1] text-white hover:bg-[#4f4bd4]">
                    <Plus className="w-4 h-4" />
                    Add New Loan
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>Add a New Loan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Loan Name"
                        value={newLoan.name}
                        onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={newLoan.amount}
                        onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Interest Rate (%)"
                        value={newLoan.interestRate}
                        onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })}
                    />
                    <Input
                        type="date"
                        value={newLoan.startDate}
                        onChange={(e) => setNewLoan({ ...newLoan, startDate: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Tenure (months)"
                        value={newLoan.tenure}
                        onChange={(e) => setNewLoan({ ...newLoan, tenure: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="EMI"
                        value={newLoan.emi}
                        onChange={(e) => setNewLoan({ ...newLoan, emi: e.target.value })}
                    />
                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-[#6361F1] hover:bg-[#4f4bd4]"
                    >
                        Add Loan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddLoanForm;