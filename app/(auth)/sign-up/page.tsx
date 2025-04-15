import React from 'react'
import {AuthFormProp} from "@/types";
import AuthForm from "@/components/AuthForm";

const SignUp = ({type}: AuthFormProp) => (
    <AuthForm type={"sign-up"}/>
)
export default SignUp
