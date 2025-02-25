import { httpRouter } from "convex/server";
import { v } from "convex/values";
import { httpAction } from "./_generated/server.js";

const http = httpRouter();

// ✅ Fetch loans (only those created by the logged-in user)
http.route({
    path: "/loans",
    method: "GET",
    handler: async ({ db, auth }) => {
        const user = await auth.getUserIdentity();
        console.log("GET /loans - User Identity:", user); // Debugging log

        if (!user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const loans = await db
            .query("loans")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", user.subject))
            .collect();

        return new Response(JSON.stringify(loans), {
            headers: { "Content-Type": "application/json" },
        });
    },
});

// ✅ Add a new loan (only if user is logged in)
http.route({
    path: "/loans",
    method: "POST",
    handler: async ({ db, auth }, req) => {
        try {
            const user = await auth.getUserIdentity();
            console.log("POST /loans - User Identity:", user); // Debugging log

            if (!user) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
            }

            const args = await req.json();
            const { name, amount, interestRate, startDate, tenure, emi, status } = args;

            if (!name || !amount || !interestRate || !startDate || !tenure || !emi || !status) {
                return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
            }

            if (!user.subject) {
                return new Response(JSON.stringify({ error: "User ID (clerkId) is missing" }), { status: 500 });
            }

            const loanId = await db.insert("loans", {
                name,
                amount,
                interestRate,
                startDate,
                tenure,
                emi,
                status,
                clerkId: user.subject, // Associate the loan with the user
            });

            console.log("POST /loans - Loan Inserted with ID:", loanId);
            return new Response(JSON.stringify({ loanId }), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("POST /loans - Error:", error);
            return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
        }
    },
});

// ✅ Delete a loan (only if it belongs to the user)
http.route({
    path: "/loans/:id",
    method: "DELETE",
    handler: async ({ db, auth, params }) => {
        const user = await auth.getUserIdentity();
        console.log("DELETE /loans - User Identity:", user);

        if (!user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const { id } = params;
        const loan = await db.get(id);
        if (!loan) {
            return new Response(JSON.stringify({ error: "Loan not found" }), { status: 404 });
        }

        if (loan.clerkId !== user.subject) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        await db.delete(id);
        console.log("DELETE /loans - Loan Deleted:", id);
        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    },
});

export default http;
