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
            .filter(q => q.eq(q.field("userId"), user.subject))
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
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error("User not authenticated");
        }

        return await ctx.db.insert("loans", {
            ...args,
            userId: user.subject, // Store the authenticated user's ID
        });
    },
});
