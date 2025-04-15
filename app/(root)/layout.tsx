import React from 'react'
import {LayoutProp} from "@/types";

const RootLayout = ({ children }: LayoutProp) => {
    return (
        <div>
            {children}
        </div>
    )
}
export default RootLayout
