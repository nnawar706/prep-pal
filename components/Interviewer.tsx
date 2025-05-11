"use client"

import React, {useEffect, useState} from 'react'
import {AgentProps, SavedMessageProps} from "@/types";
import {useRouter} from "next/navigation";
import {CallStatus, interviewer} from "@/constants";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {vapi} from "@/lib/vapi.sdk";
import {toast} from "sonner";

const Interviewer = ({
    name,
    id,
    interviewId,
    feedbackId,
    type,
    questions
                     }: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [lastMessage, setLastMessage] = useState<string>("");
    const [messages, setMessages] = useState<SavedMessageProps[]>([]);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: Message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = {
                    role: message.role,
                    content: message.transcript
                };

                setMessages((prev) => [...prev, newMessage]);
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);

        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (e: Error) => {
            console.log("Error:", e);
            toast.error("Caution: Something went wrong.");
        }

        vapi.on("call-start", onCallStart);

        vapi.on("call-end", onCallEnd);

        vapi.on("message", onMessage);

        vapi.on("speech-start", onSpeechStart);

        vapi.on("speech-end", onSpeechEnd);

        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) setLastMessage(messages[messages.length - 1].content);

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

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === "generate") {
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    name: name,
                    userid: id
                }
            });
        } else {
            const formattedQuestions = questions ?
                questions.map((q) => `- ${q}`).join("\n")
                : "";

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions
                }
            });
        }
    }

    const handleCallDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }

    const latestMessage = messages[messages.length - 1]?.content;

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
                            {latestMessage}
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
                    <button className={"btn-disconnect"} onClick={handleCallDisconnect}>End</button>
                )}
            </div>
        </div>
    )
}
export default Interviewer
