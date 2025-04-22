"use client"

import React, {useEffect, useState} from 'react'
import {AgentProps, SavedMessageProps} from "@/types";
import {useRouter} from "next/navigation";
import {CallStatus} from "@/constants";
import Image from "next/image";
import {cn} from "@/lib/utils";

const Interviewer = ({
    name,
    id,
    interviewId,
    feedbackId,
    type,
    questions
                     }: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, SetIsSpeaking] = useState<boolean>(false);
    const [lassMessage, setLastMessage] = useState<string>("");
    const [messages, setMessages] = useState<SavedMessageProps[]>([]);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

    useEffect(() => {
        if (messages.length > 0) {
            setLastMessage(messages[messages.length - 1].content)
        }

        const generateAIFeedback = async (messages: SavedMessageProps[]) => {

        }

        if (callStatus === CallStatus.FINISHED) {
            if (type === "generate") {
                router.push("/");
            } else {
                generateAIFeedback(messages)
            }
        }
    }, [messages, callStatus, feedbackId, interviewId, router, type, id]);

    const handleCall = () => {
        
    }

    const handleDisconnect = () => {

    }

    return (
        <div>
            <div className={"call-view"}>
                <div className={"card-interviewer"}>
                    <div className={"avatar"}>
                        <Image src={"/ai-avatar.png"} alt={"interviewer"}
                            height={54} width={65} className={"object-cover"} />
                        {isSpeaking && <span className={"animate-speak"}/>}
                    </div>
                    <h3>PrepPal</h3>
                </div>

                <div className={"card-border"}>
                    <div className={"card-content"}>
                        <Image src={"/user-avatar.png"} alt={"user-profile"}
                               width={539} height={539} className={"rounded-full object-cover size-[120px]"} />
                        <h3>{name}</h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className={"transcript-border"}>
                    <div className={"transcript"}>
                        <p className={"transition-opacity duration-500 opacity-0 animate-fadeIn opacity-100"}>
                            {lassMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className={"w-full flex justify-center"}>
                {callStatus !== "ACTIVE" ? (
                    <button className={"mt-5 relative btn-call"} onClick={handleCall}>
                        <span className={cn("absolute animate-ping rounded-full opacity-75",
                        callStatus !== "CONNECTING" && "hidden")}/>
                        <span className={"relative"}>
                            {["INACTIVE", "FINISHED"].includes(callStatus) ? "Call" : ". . ."}
                        </span>
                    </button>
                ): (
                    <button className={"btn-disconnect"} onClick={handleDisconnect}>End</button>
                )}
            </div>
        </div>
    )
}
export default Interviewer
