FROM node:lts AS build

WORKDIR /app/

COPY ./package.json ./package-lock.json ./

RUN npm ci

COPY ./ ./

RUN npm run build



FROM node:lts

WORKDIR /app/

COPY ./package.json ./package-lock.json ./

RUN npm install --omit=dev

COPY --from=build /app/dist/ ./dist/
COPY ./.env ./

CMD ["npm", "start"]
