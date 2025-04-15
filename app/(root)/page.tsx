import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/InterviewCard";

const Main = () => {
    const interviewCount = 0

    return (
        <>
            <section className={"card-cta"}>
                <div className={"flex flex-col gap-6 max-w-lg"}>
                    <h2>Get Interview-Ready with Your AI-Powered Buddy</h2>
                    <p className={"text-lg"}>Practice real interview questions & get instant feedback from your buddy</p>

                    <Button asChild className={"btn-primary max-sm:w-full"}>
                        <Link href={"/interview"}>Start an Interview</Link>
                    </Button>
                </div>

                <Image src={"/robot.png"} alt={"robot"} width={400} height={400} className={"max-sm:hidden"}/>
            </section>

            <section className={"flex flex-col gap-6 mt-8"}>
                <h2>Previous Interviews</h2>

                <div className={"interviews-section"}>
                    {dummyInterviews.map((interview) => (
                        <InterviewCard key={interview.id} {...interview}/>
                    ))}
                    <p>You haven't taken any interviews yet.</p>
                </div>
            </section>

            <section className={"flex flex-col gap-6 mt-8"}>
                <h2>Scheduled Interviews</h2>

                <div className={"interviews-section"}>
                    <p>There is no interview available.</p>
                </div>
            </section>
        </>
    )
}
export default Main
