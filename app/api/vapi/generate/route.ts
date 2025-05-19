import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomCoverImage} from "@/lib/utils";
import {db} from "@/firebase/admin";

export async function POST(req: Request) {
    const { type, role, level, techstack, amount, userid } = await req.json();

    try {
        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
                Job role: ${role}
                Job experience level: ${level},
                Tech stack used in the job: ${techstack},
                Focus between behavioural and technical questions should lean towards: ${type}
                Amount of questions: ${amount}
                Return only the questions without any additional text.
                A voice assistant will be reading the questions, so do not use any special characters which might break the voice assistant.
                Return the questions formatted like this:
                ["Question 1", "Question 2", "Question 3"]`
        });

        const interview = {
            role, type, level,
            techstack: techstack.split(','),
            questions: JSON.parse(questions),
            userId: userid,
            finalised: true,
            coverImage: getRandomCoverImage(),
            createdAt: new Date().toISOString(),
        };

        await db.collection("interviews").add(interview);

        return Response.json({ success: true }, { status: 200 });
    } catch (e) {
        await db.collection("errors").add({"error": e});

        return Response.json({
            success: false,
            error: e
        }, { status: 500 });
    }
}