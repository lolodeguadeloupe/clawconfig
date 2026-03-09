import { askClaude } from './claude-cli'

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

Generate this exact JSON structure (valid JSON only, no markdown wrapper):
{
  "soul": "content of SOUL.md",
  "identity": "content of IDENTITY.md",
  "user": "content of USER.md",
  "heartbeat": "content of HEARTBEAT.md",
  "tools": "content of TOOLS.md",
  "guide": "content of GUIDE.md"
}

FILE SPECS — write in ${lang}, very specific to their answers:

SOUL.md: AI personality for this profession — name, values, proactive behaviors, communication tone, 3-5 expertise areas.
IDENTITY.md: Role card — name, description, 5-7 key responsibilities, tech stack from answers, emoji.
USER.md: Human profile — name: ${nom}, profession, context from answers, goals, pain points.
HEARTBEAT.md: 4-6 periodic checks specific to their profession — daily vs weekly, what to alert on.
TOOLS.md: Notes on their selected tools — API endpoints, credential placeholders with [REPLACE] markers.
GUIDE.md: 1-page quick start — 3 first steps, key commands, 5 example prompts for their profession.

Be VERY specific. No generic content. JSON only.`

  const text = await askClaude(prompt)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse AI response')
  return JSON.parse(jsonMatch[0])
}
