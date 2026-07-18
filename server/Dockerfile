FROM node:20

WORKDIR /sync/app

COPY package*.json .
COPY prisma .
COPY . .

RUN npm i
RUN npx prisma generate
RUN find src/generated -maxdepth 2 -type f

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node"]
CMD ["dist/index.js"]