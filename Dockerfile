# Base Stage
FROM node:23 AS base
WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Build Stage
FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Production Stage
FROM base AS prod
WORKDIR /app
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
CMD ["/bin/sh", "-c", "npm run build;npm run start"]

# Development Stage
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]