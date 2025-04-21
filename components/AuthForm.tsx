"use client"

import React from 'react'
import {AuthFormProp, FormType, ResultProps} from "@/types";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Form} from "@/components/ui/form";
import FormField from "@/components/FormField";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.actions";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    });
};

const AuthForm = ({type}: AuthFormProp) => {
    const router = useRouter();

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            let result: ResultProps;

            if (type === "sign-up") {
                const {name, email, password} = data;

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                result = await signUp({
                    uid: userCredential.user.uid,
                    name: name!,
                    email,
                    password
                })
            } else {
                const { email, password } = data;

                const userCredential = await signInWithEmailAndPassword(auth, email, password)

                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    toast.error("Sign in failed. Please try again.")
                    return;
                }

                result = await signIn({email, idToken});
            }

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);

            type === "sign-up" ? router.push("/sign-in") : router.push("/");
        } catch (e) {
            console.log(e);
            toast.error(`Caution: ${e}`);
        }
    }

    return (
        <div className={"card-border lg:min-w-[566px]"}>
            <div className={"flex flex-col gap-6 card py-14 px-10"}>
                <div className={"flex flex-row gap-2 justify-center"}>
                    <Image src={"/logo.svg"} alt={"logo"} height={32} width={38}/>
                    <h2 className={"text-primary-100"}>PrepPal</h2>
                </div>

                <h6>Your friendly interview preparation buddy!</h6>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                          className={"w-full space-y-6 mt-4 form"}>
                        {type === "sign-up" && (
                            <FormField
                                control={form.control}
                                name={"name"}
                                label={"Name"}
                                placeholder={"Your Name"}
                                type={"text"}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name={"email"}
                            label={"Email"}
                            placeholder={"Your Email"}
                            type={"email"}
                        />

                        <FormField
                            control={form.control}
                            name={"password"}
                            label={"Password"}
                            placeholder={"Your Password"}
                            type={"password"}
                        />

                        <Button className={"btn"} type={"submit"}>
                            {type === "sign-up" ? "Create an Account" : "Sign In"}
                        </Button>
                    </form>
                </Form>

                <p className={"text-center"}>
                    {type === "sign-up" ? "Have an account already?" : "No account yet?"}
                    <Link href={type === "sign-up" ? "/sign-in" : "/sign-up"}
                          className={"font-bold text-user-primary ml-1"}>
                        {type === "sign-up" ? "Sign In" : "Sign Up"}
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default AuthForm
