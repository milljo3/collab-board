import { GenerateBoard, generateBoardSchema } from "@/types/board";

const url = "https://openrouter.ai/api/v1/chat/completions";
const headers = {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.LOCAL_URL || "https://collab-board-five.vercel.app",
    "X-Title": "Board Generator"
};

export async function generateBoard(prompt: string, includeTasks: boolean): Promise<GenerateBoard> {
    try {
        const systemPrompt = `
            You are an assistant that generates Trello-style boards in JSON format based on a user's request.
            
            The output must follow this EXACT structure:
            
            {
              "title": string,
              "categories": [
                {
                  "title": string,
                  "tasks": [
                    {
                      "title": string,
                      "details": string | null
                    }
                  ]
                }
              ]
            }
            
            Rules:
            - If the user request is irrelevant, trolling, or nonsensical, respond with:
              {
                "title": "Untitled Board",
                "categories": []
              }
            - Categories should be relevant to the board topic. If the user specifies categories, use those exactly. Otherwise, create 3–5 relevant categories.
            ${includeTasks
            ? "- Tasks should have a short, clear title (max 600 characters) and may optionally include a longer details field for extra context (max 2000 characters)."
            : "- Do not generate any tasks — return an empty array for each category's tasks."}
            - Do not include extra fields or metadata not defined in the schema.
            - Output must be plain JSON with no markdown/code fences.
            - Be strict — never fabricate structure if prompt is clearly unrelated.
        `.trim();

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify({
                model: "mistralai/mistral-small-3.2-24b-instruct:free",
                messages: [
                    { role: "system", content: systemPrompt },
                    {
                        role: "user",
                        content: `
                        Generate a board based on this request:
                        "${prompt}"
                        
                        The board should include:
                        - A title based on the request.
                        - Categories (use user-provided ones if present, otherwise generate relevant ones).
                        ${includeTasks
                            ? "- Tasks (if the user provides them, place them in the correct categories; otherwise, generate reasonable tasks for each category). Each task should have a short title and may optionally have a details field for extra context."
                            : "- No tasks should be generated — leave all category tasks arrays empty."}
                        `.trim()
                    }
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "BoardGeneration",
                        strict: true,
                        schema: {
                            type: "object",
                            properties: {
                                title: {
                                    type: "string",
                                    description: "Board title"
                                },
                                categories: {
                                    type: "array",
                                    description: "List of categories in the board",
                                    items: {
                                        type: "object",
                                        properties: {
                                            title: {
                                                type: "string",
                                                description: "Category title"
                                            },
                                            tasks: {
                                                type: "array",
                                                description: "Tasks inside the category",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        title: {
                                                            type: "string",
                                                            description: "Short, clear title of the task"
                                                        },
                                                        details: {
                                                            type: ["string", "null"],
                                                            description: "Optional longer details about the task"
                                                        }
                                                    },
                                                    required: ["title"],
                                                    additionalProperties: false
                                                }
                                            }
                                        },
                                        required: ["title", "tasks"],
                                        additionalProperties: false
                                    }
                                }
                            },
                            required: ["title", "categories"],
                            additionalProperties: false
                        }
                    }
                },
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content returned from API");
        }

        let jsonContent: unknown;
        try {
            jsonContent = JSON.parse(content.trim());
        }
        catch (e) {
            throw new Error(`Failed to parse API response: ${e instanceof Error ? e.message : String(e)}`);
        }

        const parsed = generateBoardSchema.safeParse(jsonContent);
        if (!parsed.success) {
            console.warn("Invalid API response format, using fallback:", parsed.error);
            return {
                title: "Untitled Board",
                categories: []
            };
        }

        return parsed.data;
    }
    catch (error) {
        console.error("Error occurred while generating the board", error);
        return {
            title: "Untitled Board",
            categories: []
        };
    }
}