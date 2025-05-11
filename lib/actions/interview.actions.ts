"use server";

import {CreateFeedbackParams} from "@/types";

export const createAIFeedback = async (params: CreateFeedbackParams) => {
    const { interviewId, userId, transcript, feedbackId } = params;

    try {
        const formattedTranscript = transcript
            .map(
                (sentence: {role: string, content: string}) => `${sentence.role}: (${sentence.content})`
            )
            .join('');
    } catch (e) {
        console.error("Error:", e);

        return {
            success: false,
        }
    }
}