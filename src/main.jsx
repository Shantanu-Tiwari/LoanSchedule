import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ClerkProvider publishableKey='pk_test_Y2VydGFpbi1nYXplbGxlLTg5LmNsZXJrLmFjY291bnRzLmRldiQ'>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <SignedIn>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </SignedIn>
                <SignedOut>
                    <RedirectToSignIn />
                </SignedOut>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    </StrictMode>
);
