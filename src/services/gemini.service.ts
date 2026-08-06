import OpenAI from 'openai';

// OpenRouter - uses OpenAI-compatible API
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://github.com/Pranav4322/JanAdhikar',
    'X-Title': 'JanAdhikar',
  },
});

export interface AIComplaintAnalysis {
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
}

const VALID_CATEGORIES = [
  'Road',
  'Water Supply',
  'Sanitation',
  'Electricity',
  'Public Safety',
  'Healthcare',
  'Education',
  'Drainage',
  'Green Spaces',
  'Other',
];

/**
 * Calls OpenRouter (auto-selects best available free model) to
 * categorize a complaint, set urgency, and generate a summary.
 */
export async function analyzeComplaint(
  title: string,
  description: string,
): Promise<AIComplaintAnalysis> {
  const response = await client.chat.completions.create({
    model: 'openrouter/free', // auto-picks best free model available
    messages: [
      {
        role: 'user',
        content: `You are an AI assistant for a civic grievance platform.
Analyze this citizen complaint and respond ONLY with a valid JSON object — no markdown, no explanation.

Title: "${title}"
Description: "${description}"

Return exactly this JSON:
{
  "category": "<Road | Water Supply | Sanitation | Electricity | Public Safety | Healthcare | Education | Drainage | Green Spaces | Other>",
  "urgency": "<low | medium | high | critical>",
  "summary": "<1-2 sentence actionable summary for a government official>"
}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 300,
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? '';

  // Strip <think>...</think> tags that reasoning models add
  const withoutThink = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Strip markdown code fences if present
  const jsonText = withoutThink
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  let parsed: AIComplaintAnalysis;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    console.error('[OpenRouter] Non-JSON response:', raw);
    return { category: 'Other', urgency: 'low', summary: description };
  }

  // Sanitize category
  if (!VALID_CATEGORIES.includes(parsed.category)) {
    parsed.category = 'Other';
  }
  // Sanitize urgency
  if (!['low', 'medium', 'high', 'critical'].includes(parsed.urgency)) {
    parsed.urgency = 'low';
  }

  return parsed;
}
