import {GenerateBoardPromptSchema} from "@/types/board";

export const generateBoard = async (prompt: GenerateBoardPromptSchema) => {
    const response = await fetch("/api/boards/generate", {
        method: "POST",
        body: JSON.stringify(prompt),
        headers: {"content-type": "application/json"}
    });

    if (!response.ok) throw new Error("Failed to generate board");

    return await response.json();
}