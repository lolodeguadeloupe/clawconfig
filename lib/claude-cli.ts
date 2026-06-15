import { spawn, execFileSync } from 'child_process'

function findClaudePath(): string {
  const candidates = [
    process.env.CLAUDE_BIN,
    '/usr/local/bin/claude',
    '/usr/bin/claude',
    '/root/.nvm/versions/node/v24.13.1/bin/claude',
    'claude',
  ].filter(Boolean) as string[]

  for (const p of candidates) {
    try {
      execFileSync(p, ['--version'], { stdio: 'ignore', timeout: 5000 })
      return p
    } catch {}
  }
  return 'claude'
}

const CLAUDE_BIN = findClaudePath()
const TIMEOUT_MS = 120_000
const MAX_OUTPUT_BYTES = 10 * 1024 * 1024

export async function askClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(CLAUDE_BIN, ['--print'], {
      env: { ...process.env, HOME: '/root' },
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    let killed = false
    let bytes = 0

    const timer = setTimeout(() => {
      killed = true
      child.kill('SIGKILL')
      reject(new Error(`Claude CLI timed out after ${TIMEOUT_MS}ms`))
    }, TIMEOUT_MS)

    child.stdout.on('data', (chunk: Buffer) => {
      bytes += chunk.length
      if (bytes > MAX_OUTPUT_BYTES) {
        killed = true
        child.kill('SIGKILL')
        clearTimeout(timer)
        reject(new Error('Claude CLI output exceeded buffer'))
        return
      }
      stdout += chunk.toString('utf8')
    })

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8')
    })

    child.on('error', (err) => {
      clearTimeout(timer)
      reject(new Error(`Claude CLI spawn failed: ${err.message}`))
    })

    child.on('close', (code) => {
      clearTimeout(timer)
      if (killed) return
      if (code !== 0) {
        console.error('Claude CLI stderr:', stderr)
        reject(new Error(`Claude CLI exited ${code}: ${stderr || 'no stderr'}`))
        return
      }
      resolve(stdout.trim())
    })

    child.stdin.end(prompt, 'utf8')
  })
}
