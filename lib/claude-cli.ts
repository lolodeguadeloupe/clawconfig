import { execSync } from 'child_process'

const CLAUDE_PATH = '/root/.nvm/versions/node/v24.13.1/bin/claude'
const NVM_ENV = {
  ...process.env,
  NVM_DIR: '/root/.nvm',
  PATH: `/root/.nvm/versions/node/v24.13.1/bin:${process.env.PATH}`,
  HOME: '/root',
}

export async function askClaude(prompt: string): Promise<string> {
  try {
    const escaped = prompt.replace(/'/g, `'\\''`)
    const result = execSync(
      `${CLAUDE_PATH} --print '${escaped}'`,
      {
        env: NVM_ENV,
        timeout: 120000, // 2 min max
        maxBuffer: 10 * 1024 * 1024, // 10MB
        encoding: 'utf8',
      }
    )
    return result.trim()
  } catch (err: any) {
    console.error('Claude CLI error:', err.message)
    throw new Error('Claude CLI failed: ' + err.message)
  }
}
