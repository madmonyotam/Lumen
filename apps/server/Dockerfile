FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app
# Install turbo global
RUN npm install -g turbo
# Copy all package.jsons
COPY . .
# Prune the workspace for server
RUN turbo prune --scope=@lumen/server --docker

# Installer stage
FROM node:18-alpine AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .
RUN npm run build

# Runner stage
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=installer /app .
CMD ["node", "apps/server/dist/server.js"]
