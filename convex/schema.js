import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    loans: defineTable({
        name: v.string(),              // Loan type or name (e.g., "Home Loan", "Car Loan")
        amount: v.number(),            // Total loan amount
        interestRate: v.number(),      // Annual interest rate in percentage
        startDate: v.string(),         // Start date of the loan (ISO 8601 string)
        tenure: v.number(),            // Loan tenure in months
        emi: v.number(),               // Monthly EMI amount
        status: v.union(v.literal("active"), v.literal("closed")), // Loan status
        clerkId: v.string(),
    }).index("by_clerkId", ["clerkId"]),
    users: defineTable({
        name: v.string(),
        email: v.string(),
        clerkId: v.string(),
    }).index("by_clerkId", ["clerkId"]),
    })