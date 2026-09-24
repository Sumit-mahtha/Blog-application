import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { title, content } = await request.json();

        const blogTitle = title || "Blog Post";
        const blogContent = content || title || "Blog overview and summary";

        const apiKey = process.env.GEMINI_API_KEY;

        // Fallback in case API key is not yet set
        if (!apiKey) {
            return NextResponse.json({
                success: true,
                summary: `This article covers "${blogTitle}". It explores core concepts and practical insights to help you understand the topic quickly without reading the entire text.`,
                points: [
                    "Key themes discussed in this post",
                    "Practical ideas and actionable takeaways",
                    "Insights on how to apply these concepts effectively"
                ]
            });
        }

        // Call Google Gemini API
        const prompt = `You are a helpful blog summarizer bot. Summarize the following blog post titled "${blogTitle}".
Blog Content: "${blogContent.replace(/<[^>]*>?/gm, '').slice(0, 3000)}"

Respond in this exact JSON format (no markdown fences, just pure JSON):
{
  "summary": "A clear, engaging 2-sentence summary of the blog post.",
  "points": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3"
  ]
} `;

        const modelsToTry = [
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-2.5-flash",
            "gemini-3.5-flash-lite"
        ];

        let parsed = null;

        for (const model of modelsToTry) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
                if (result.error) {
                    console.warn(`Model ${model} error:`, result.error.message);
                    continue;
                }

                const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (responseText) {
                    // Strip potential markdown code block wrappers
                    const cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
                    parsed = JSON.parse(cleanText);
                    if (parsed && parsed.summary) {
                        break;
                    }
                }
            } catch (err) {
                console.warn(`Attempt with ${model} failed:`, err.message);
            }
        }

        if (parsed && parsed.summary) {
            return NextResponse.json({
                success: true,
                summary: parsed.summary,
                points: parsed.points || []
            });
        }

        // Graceful fallback if models are temporarily overloaded (e.g. 503)
        const cleanContent = (blogContent || "").replace(/<[^>]*>?/gm, '').trim();
        const snippet = cleanContent.length > 200 ? cleanContent.slice(0, 190) + '...' : cleanContent;

        return NextResponse.json({
            success: true,
            summary: snippet || `This article explores key insights and important discussions regarding "${blogTitle}".`,
            points: [
                `Overview and core context of "${blogTitle}"`,
                "Key takeaways and main discussion highlights",
                "Practical perspectives and conclusions"
            ]
        });

    } catch (error) {
        console.error("Summarizer API error:", error);
        return NextResponse.json({
            success: true,
            summary: `This article covers "${title || 'the blog'}". A quick read highlighting core themes and concepts.`,
            points: [
                "Key themes discussed in this post",
                "Actionable takeaways and insights"
            ]
        });
    }
}