import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface GenerateInput {
  metier: string
  nom: string
  answers: Record<string, string | string[]>
  langue: 'fr' | 'en'
}

function formatAnswers(answers: Record<string, string | string[]>): string {
  return Object.entries(answers)
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n')
}

export async function generateConfig(input: GenerateInput) {
  const { metier, nom, answers, langue } = input
  const answersText = formatAnswers(answers)
  const lang = langue === 'fr' ? 'French' : 'English'

  const prompt = `You are an expert OpenClaw AI assistant configurator. Generate a complete, personalized OpenClaw configuration for a professional.

PROFESSION: ${metier}
USER NAME: ${nom}
LANGUAGE PREFERENCE: ${lang}
USER ANSWERS:
${answersText}

Generate ALL of the following files. Be specific, practical, and tailored to their exact situation. Use their answers to personalize every detail.

---

Generate this exact JSON structure (valid JSON, no markdown around it):
{
  "soul": "content of SOUL.md",
  "identity": "content of IDENTITY.md", 
  "user": "content of USER.md",
  "heartbeat": "content of HEARTBEAT.md",
  "tools": "content of TOOLS.md",
  "guide": "content of GUIDE.md (quick start guide for this specific setup)"
}

FILE SPECS:

SOUL.md — The AI's personality and operating principles for THIS profession:
- Define who the AI is (give it a name, personality)
- Core values for this profession (efficiency, precision, empathy depending on job)
- What it proactively does (suggest actions without being asked)
- How it communicates (tone adapted to the profession)
- 3-5 specific expertise areas based on their answers
- Write in ${lang}

IDENTITY.md — The AI's role card:
- Name (creative, profession-related)
- Role description
- Key responsibilities (5-7 specific to their answers)
- Tech stack / tools they use (from answers)
- Emoji and avatar description
- Write in ${lang}

USER.md — Profile of the human:
- Name: ${nom}
- Profession: ${metier}
- Key context from answers
- Communication preferences
- Goals and pain points (from answers)
- Write in ${lang}

HEARTBEAT.md — Proactive tasks the AI should check periodically:
- 4-6 specific checks relevant to their profession and answers
- Daily vs weekly checks
- What to look for and when to alert
- Write in ${lang}

TOOLS.md — Tool-specific notes:
- Based on their selected tools/software
- API endpoints if applicable
- Credentials format (placeholder with [REPLACE] markers)
- Specific notes for each tool
- Write in ${lang}

GUIDE.md — Getting started guide (1 page):
- Step 1: Complete these 3 things first
- Key commands / prompts to use with this setup
- 5 example prompts tailored to their profession
- Tips specific to their situation
- Write in ${lang}

Make everything VERY specific to their answers. No generic content. This should feel like it was hand-crafted for them.`

  const msg = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse AI response')
  return JSON.parse(jsonMatch[0])
}
