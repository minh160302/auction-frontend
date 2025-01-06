"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";


export default function Header() {
    const { isSignedIn, user } = useUser();
    const authStore = useAuthStore();

    useEffect(() => {
        if (isSignedIn && user) {
            const currentUserEmail = user.primaryEmailAddress?.emailAddress ?? "";
            if (!authStore.user || authStore.user.email !== currentUserEmail)
                authStore.setUser(currentUserEmail);
        }
    }, [isSignedIn, user])

    return (
        <div className="navbar">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" href="/">daisyUI</a>
            </div>
            <div className="flex-none">
                {isSignedIn ? <UserButton /> : <SignUpButton />}
            </div>
        </div>
    )
}