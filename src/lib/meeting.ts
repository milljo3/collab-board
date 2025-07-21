import {ResponseMeetingSummary, transcriptSchema} from "@/types/meeting";
import {summarizeMeeting} from "@/lib/openrouter";
import {prisma} from "@/lib/prisma";

export async function validateAndSummarizeTranscript(input: unknown) {
    const parsed = transcriptSchema.safeParse(input);
    if (!parsed.success) {
        throw new Error("Invalid transcript schema: " + parsed.error.message);
    }

    const summary = await summarizeMeeting(parsed.data.transcript);
    return { transcript: parsed.data.transcript, summary };
}

export async function saveMeetingToDB(
    {
        transcript,
        summary,
        userId
}: {
        transcript: string;
        summary: ResponseMeetingSummary;
        userId: string;
}) {
    return prisma.meeting.create({
        data: {
            title: summary.title,
            transcript,
            summary: summary.summary,
            actions: {
                create: summary.actions.map(action => ({
                    task: action.task,
                    responsible: action.responsible,
                    deadline: action.deadline,
                }))
            },
            questions: summary.questions,
            decisions: summary.decisions,
            tags: summary.tags,
            userId,
        },
    });
}