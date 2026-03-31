# API Server Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code (exclude tests)
COPY src/index.ts ./src/index.ts
COPY tsconfig.json ./

# Build (tests are excluded via tsconfig)
RUN npm run build

EXPOSE 4021

CMD ["npm", "start"]
