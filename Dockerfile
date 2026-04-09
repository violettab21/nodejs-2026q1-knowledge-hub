FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM  node:24-alpine AS final

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json .
COPY --from=builder /usr/src/app/doc ./doc

COPY --from=builder /usr/src/app/dist ./dist

RUN npm ci --omit=dev

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
