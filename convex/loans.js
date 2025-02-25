import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";

// ✅ Fetch all loans
export const getAll = query({
    handler: async (ctx) => {
        return await ctx.db.query("loans").collect();
    },
});

// ✅ Insert a new loan
export const insert = mutation({
    args: {
        name: v.string(),
        amount: v.number(),
        interestRate: v.number(),
        startDate: v.string(),
        tenure: v.number(),
        emi: v.number(),
        status: v.union(v.literal("active"), v.literal("closed")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("loans", args);
    },
});
