import { httpRouter } from "convex/server";
import { v } from "convex/values";
import { httpAction } from "./_generated/server.js";

const http = httpRouter();

// ✅ Fetch all loans
http.route({
    path: "/loans",
    method: "GET",
    handler: async ({ db }) => {
        const loans = await db.query("loans").collect();
        return new Response(JSON.stringify(loans), {
            headers: { "Content-Type": "application/json" },
        });
    },
});

// ✅ Add a new loan
http.route({
    path: "/loans",
    method: "POST",
    handler: async ({ db }, req) => {
        try {
            const args = await req.json();
            const { name, amount, interestRate, startDate, tenure, emi, status } = args;

            // Validate required fields
            if (!name || !amount || !interestRate || !startDate || !tenure || !emi || !status) {
                return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
            }

            const loanId = await db.insert("loans", { name, amount, interestRate, startDate, tenure, emi, status });
            return new Response(JSON.stringify({ loanId }), { headers: { "Content-Type": "application/json" } });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
        }
    },
});

// ✅ Update a loan by ID
http.route({
    path: "/loans/:id",
    method: "PATCH",
    handler: async ({ db, req, params }) => {
        try {
            const updates = await req.json();
            const { id } = params; // Extract ID from URL

            await db.patch(id, updates);
            return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Update failed" }), { status: 400 });
        }
    },
});

// ✅ Delete a loan by ID
http.route({
    path: "/loans/:id",
    method: "DELETE",
    handler: async ({ db, params }) => {
        try {
            const { id } = params; // Extract ID from URL
            await db.delete(id);
            return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Delete failed" }), { status: 400 });
        }
    },
});

// ✅ Fetch user details by Clerk ID
http.route({
    path: "/users/:clerkId",
    method: "GET",
    handler: async ({ db, params }) => {
        try {
            const { clerkId } = params; // Extract clerkId from URL

            const user = await db
                .query("users")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
                .first();

            if (!user) {
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
            }

            return new Response(JSON.stringify(user), { headers: { "Content-Type": "application/json" } });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Request failed" }), { status: 400 });
        }
    },
});

export default http;
