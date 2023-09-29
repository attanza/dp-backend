FROM node:18-alpine AS development
WORKDIR "/usr/src/app"
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine AS production
ARG NODE_ENV=production
ENV PORT=10000
WORKDIR "/usr/src/app"
COPY package*.json ./
RUN npm install --only=prod
COPY . .
COPY --from=development  "/usr/src/app/dist" "./dist"
EXPOSE 10000
CMD ["node", "dist/main"]