import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";

// Sync user from Clerk to Convex
export const syncUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .first();

        if (existingUser) {
            // Update user info if it has changed
            await ctx.db.patch(existingUser._id, {
                email: args.email,
                name: args.name,
            });
        } else {
            // Insert new user
            await ctx.db.insert("users", {
                clerkId: args.clerkId,
                email: args.email,
                name: args.name,
            });
        }
    },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .first();

        return user || null;
    },
});
