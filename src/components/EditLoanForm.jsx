import { useState } from "react";
import { useMutation } from "convex/react";
import { api} from "../../convex/_generated/api.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const EditLoanForm = ({ loan, onClose }) => {
    const updateLoan = useMutation(api.loans.update);
    const [formData, setFormData] = useState({
        name: loan.name,
        amount: loan.amount,
        interestRate: loan.interestRate,
        tenure: loan.tenure,
        emi: loan.emi,
        startDate: loan.startDate,
        status: loan.status || "active",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateLoan({ loanId: loan._id, ...formData });
        onClose(); // Close modal after saving
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                    <DialogTitle>Edit Loan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Loan Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="interestRate">Interest Rate (%)</Label>
                        <Input id="interestRate" name="interestRate" type="number" value={formData.interestRate} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="tenure">Tenure (Months)</Label>
                        <Input id="tenure" name="tenure" type="number" value={formData.tenure} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="emi">EMI</Label>
                        <Input id="emi" name="emi" type="number" value={formData.emi} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditLoanForm;
