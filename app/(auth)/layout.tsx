import React from 'react'
import {LayoutProp} from "@/types";

const AuthLayout = ({ children }: LayoutProp) => {
    return (
        <div className={"auth-layout"}>
            {children}
        </div>
    )
}
export default AuthLayout
