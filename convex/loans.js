import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";

// ✅ Fetch loans for the authenticated user
export const getAll = query({
    handler: async (ctx) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error("User not authenticated");
        }

        return await ctx.db.query("loans")
            .filter(q => q.eq(q.field("clerkId"), user.subject)) // Ensure filtering by clerkId
            .collect();
    },
});

// ✅ Insert a new loan (linked to the user)
export const insert = mutation({
    args: {
        name: v.string(),
        amount: v.number(),
        interestRate: v.number(),
        startDate: v.string(),
        tenure: v.number(),
        emi: v.number(),
        status: v.union(v.literal("active"), v.literal("closed")),
        clerkId: v.string(), // ✅ Add this
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error("User not authenticated");
        }

        return await ctx.db.insert("loans", {
            ...args,
            clerkId: user.subject, // ✅ Store the authenticated user's Clerk ID
        });
    },
});

// ✅ Delete a loan (only if it belongs to the user)
export const remove = mutation({
    args: { loanId: v.id("loans") },
    handler: async (ctx, { loanId }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const loan = await ctx.db.get(loanId);
        if (!loan) {
            throw new Error("Loan not found");
        }
        if (loan.clerkId !== user.subject) {
            throw new Error("Unauthorized: Cannot delete someone else's loan");
        }

        await ctx.db.delete(loanId);
    },
});

// ✅ Update a loan (only if it belongs to the user)
export const update = mutation({
    args: {
        loanId: v.id("loans"),
        name: v.optional(v.string()),
        amount: v.optional(v.number()),
        interestRate: v.optional(v.number()),
        startDate: v.optional(v.string()),
        tenure: v.optional(v.number()),
        emi: v.optional(v.number()),
        status: v.optional(v.union(v.literal("active"), v.literal("closed"))),
    },
    handler: async (ctx, { loanId, ...updates }) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const loan = await ctx.db.get(loanId);
        if (!loan) {
            throw new Error("Loan not found");
        }
        if (loan.clerkId !== user.subject) {
            throw new Error("Unauthorized: Cannot update someone else's loan");
        }

        await ctx.db.patch(loanId, updates);
    },
});
