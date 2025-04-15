"use client"

import React from 'react'
import {AuthFormProp, FormType} from "@/types";
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
            if (type === "sign-up") {
                const {name, email, password} = data;

                toast.success("Account created successfully.");
                router.push("/sign-in");
            }
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
