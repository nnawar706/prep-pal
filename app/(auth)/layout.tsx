import React from 'react'
import {LayoutProp} from "@/types";
import {isAuthenticated} from "@/lib/actions/auth.actions";
import {redirect} from "next/navigation";

const AuthLayout = async ({ children }: LayoutProp) => {
    const isLoggedIn = await isAuthenticated();

    if (isLoggedIn) redirect("/");
    
    return (
        <div className={"auth-layout"}>
            {children}
        </div>
    )
}
export default AuthLayout
