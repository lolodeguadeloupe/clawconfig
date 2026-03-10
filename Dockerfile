FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Installer Claude Code CLI
RUN npm install -g @anthropic-ai/claude-code

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN mkdir -p ./public

# Script de démarrage : decode les credentials Claude depuis env var
RUN printf '#!/bin/sh\n\
if [ -n "$CLAUDE_CREDENTIALS_B64" ]; then\n\
  mkdir -p /root/.claude\n\
  echo "$CLAUDE_CREDENTIALS_B64" | base64 -d > /root/.claude/.credentials.json\n\
fi\n\
exec node server.js\n' > /start.sh && chmod +x /start.sh

EXPOSE 3000
CMD ["/start.sh"]
