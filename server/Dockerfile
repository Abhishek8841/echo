FROM node:20

WORKDIR /sync/app

COPY package*.json .
COPY prisma .

RUN npm i
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node"]
CMD ["dist/index.js"]