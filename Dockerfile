FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=development

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main"] 