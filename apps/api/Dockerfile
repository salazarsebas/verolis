# API Server Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY apps/api/package*.json ./
RUN npm install

# Copy source code and shared packages
COPY apps/api/src ./src
COPY packages /packages
COPY apps/api/tsconfig.json ./

# Build (tests are excluded via tsconfig)
RUN npm run build

EXPOSE 4021

CMD ["npm", "start"]
