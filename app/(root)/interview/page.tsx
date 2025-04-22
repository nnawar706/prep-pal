import React from 'react'
import {getCurrentUser} from "@/lib/actions/auth.actions";
import Interviewer from "@/components/Interviewer";

const Page = async () => {
    const user = await getCurrentUser()

    console.log(user)

    return (
        <div>
            <Interviewer
                id={user?.id}
                name={user?.name!}
                type={"generate"}
            />
        </div>
    )
}
export default Page
