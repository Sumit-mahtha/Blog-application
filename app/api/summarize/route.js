import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { title, content } = await request.json();

        if (!content) {
            return NextResponse.json({ success: false, msg: "Content is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // Fallback in case API key is not yet set
        if (!apiKey) {
            return NextResponse.json({
                success: true,
                summary: `This article covers "${title}". It explores core concepts and practical insights to help you understand the topic quickly without reading the entire text.`,
                points: [
                    "Key themes discussed in this post",
                    "Practical ideas and actionable takeaways",
                    "Insights on how to apply these concepts effectively"
                ]
            });
        }

        // Call Google Gemini API
        const prompt = `You are a helpful blog summarizer bot. Summarize the following blog post titled "${title}".
Blog Content: "${content.replace(/<[^>]*>?/gm, '').slice(0, 3000)}"

Respond in this exact JSON format (no markdown fences, just pure JSON):
{
  "summary": "A clear, engaging 2-sentence summary of the blog post.",
  "points": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3"
  ]
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            }
        );

        const result = await response.json();
        const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = JSON.parse(responseText);

        return NextResponse.json({
            success: true,
            summary: parsed.summary,
            points: parsed.points || []
        });

    } catch (error) {
        console.error("Summarizer API error:", error);
        return NextResponse.json(
            { success: false, msg: error.message || "Failed to generate summary" },
            { status: 500 }
        );
    }
}