FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM  node:24-alpine AS final

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./
COPY --from=builder /usr/src/app/package*.json .
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/doc ./doc
COPY --from=builder /usr/src/app/node_modules ./node_modules


EXPOSE 4000

CMD ["sh", "-c", "npm run prisma:migrate && node prisma/seed.js && npm run start:prod:docker"]
