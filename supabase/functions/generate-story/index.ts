// Generate a scene-based story using Lovable AI Gemini
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAME: Record<string, string> = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  te: "Telugu (Telugu script)",
};

const LEVEL_DESC: Record<string, string> = {
  child: "Explain like I'm 5. Super simple, fun, vivid metaphors.",
  student: "Curious teen / college student. Clear, smart, engaging.",
  developer: "Advanced learner. Sharp, precise, slightly technical.",
};

const STYLE_DESC: Record<string, string> = {
  story: "warm narrative storytelling",
  funny: "witty, playful, with light jokes",
  cinematic: "dramatic, vivid, movie-like",
  teacher: "calm, kind teacher giving an aha moment",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, language = "en", level = "student", style = "story" } = await req.json();
    if (!topic || typeof topic !== "string") {
      return new Response(JSON.stringify({ error: "topic is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const langName = LANG_NAME[language] ?? "English";
    const levelDesc = LEVEL_DESC[level] ?? LEVEL_DESC.student;
    const styleDesc = STYLE_DESC[style] ?? STYLE_DESC.story;

    const systemPrompt = `You are StorySnap AI — a master storyteller who explains anything as a short, vivid, ${styleDesc} story.

RULES:
- Write 100% in ${langName}. Do not mix languages.
- ${levelDesc}
- Generate 5 scenes. Each scene must MOVE the story forward and teach one clear idea.
- Keep characters consistent across scenes (give them names).
- Each narration: 2-3 short sentences. Conversational, human, warm.
- Image prompts: vivid visual scene description in English (always English for image gen), 1-2 sentences, focus on character action + setting + mood.
- Quiz must directly test the topic. Make it interesting, not trivial.`;

    const userPrompt = `Topic: "${topic}"

Create the story now. Make me say "wow, I finally get it".`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_story",
            description: "Return the structured scene-based story.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: `Catchy title in ${langName}` },
                scenes: {
                  type: "array",
                  minItems: 5,
                  maxItems: 5,
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: `Short scene title in ${langName}` },
                      narration: { type: "string", description: `2-3 sentence narration in ${langName}` },
                      imagePrompt: { type: "string", description: "Vivid English visual prompt for image generation" },
                    },
                    required: ["title", "narration", "imagePrompt"],
                    additionalProperties: false,
                  },
                },
                keyLesson: { type: "string", description: `One-line takeaway in ${langName}` },
                realLifeExample: { type: "string", description: `Concrete real-world example in ${langName}` },
                quiz: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                    correct: { type: "integer", minimum: 0, maximum: 3 },
                  },
                  required: ["question", "options", "correct"],
                  additionalProperties: false,
                },
                nextTopics: {
                  type: "array", minItems: 3, maxItems: 4,
                  items: { type: "string" },
                  description: `Related topics in ${langName}`,
                },
              },
              required: ["title", "scenes", "keyLesson", "realLifeExample", "quiz", "nextTopics"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_story" } },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No structured response from AI");
    const story = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ story, language }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-story error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
