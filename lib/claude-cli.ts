import { execSync } from 'child_process'
import path from 'path'

// Claude CLI est installé globalement dans le container
// Les credentials sont montés depuis le host via volume /root/.claude
function findClaudePath(): string {
  const candidates = [
    '/usr/local/bin/claude',
    '/usr/bin/claude',
    '/root/.nvm/versions/node/v24.13.1/bin/claude',
    'claude', // fallback PATH
  ]
  for (const p of candidates) {
    try {
      execSync(`${p} --version`, { stdio: 'ignore', timeout: 5000 })
      return p
    } catch {}
  }
  return 'claude'
}

const CLAUDE_BIN = findClaudePath()

export async function askClaude(prompt: string): Promise<string> {
  // Échapper les guillemets simples
  const escaped = prompt.replace(/'/g, `'"'"'`)

  try {
    const result = execSync(
      `${CLAUDE_BIN} --print '${escaped}'`,
      {
        timeout: 120000,
        maxBuffer: 10 * 1024 * 1024,
        encoding: 'utf8',
        env: {
          ...process.env,
          HOME: '/root',  // pointe vers les credentials montés
        },
      }
    )
    return result.trim()
  } catch (err: any) {
    const msg = err.stderr || err.message || 'Unknown error'
    console.error('Claude CLI error:', msg)
    throw new Error(`Claude CLI failed: ${msg}`)
  }
}
