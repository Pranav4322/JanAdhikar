import 'dotenv/config';

const GROQ_API_KEY = process.env.GROQ_API_KEY as string;

const CATEGORIES = [
  'Roads & Potholes',
  'Sanitation & Garbage',
  'Water Supply',
  'Electricity',
  'Public Safety',
  'Parks & Public Spaces',
  'Other',
];

const URGENCY_OVERRIDE_KEYWORDS = [
  'open manhole', 'live wire', 'fire', 'gas leak', 'building collapse', 'electrocution',
];

interface CategorizationResult {
  category: string;
  urgency: 'low' | 'medium' | 'high';
}

export async function categorizeComplaint(description: string): Promise<CategorizationResult> {
  const prompt = `You are a civic complaint classifier. Given a citizen's complaint description, respond with ONLY a JSON object, no other text, no markdown formatting, in exactly this format:
{"category": "one of: ${CATEGORIES.join(', ')}", "urgency": "low, medium, or high"}

Complaint: "${description}"`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    console.log('RAW AI RESPONSE:', JSON.stringify(data, null, 2));

    const rawText = data.choices?.[0]?.message?.content ?? '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    let category = CATEGORIES.includes(parsed.category) ? parsed.category : 'Other';
    let urgency: 'low' | 'medium' | 'high' = ['low', 'medium', 'high'].includes(parsed.urgency)
      ? parsed.urgency
      : 'low';

    const lowerDesc = description.toLowerCase();
    if (URGENCY_OVERRIDE_KEYWORDS.some((kw) => lowerDesc.includes(kw))) {
      urgency = 'high';
    }

    return { category, urgency };
  } catch (error) {
    console.error('AI categorization error:', error);
    return { category: 'Other', urgency: 'low' };
  }
}