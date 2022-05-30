# FROM node:16

# WORKDIR /paul/src/app
# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./

# RUN npm install
# # If you are building your code for production
# # RUN npm ci --only=production

# # Bundle app source
# COPY . .

# # RUN npm run build



# EXPOSE 8080

# CMD [ "node", "dist/main" ]
FROM node:16.15.0 AS base
WORKDIR /base
COPY package*.json ./
COPY .env ./
COPY package-lock.json ./
RUN  npm install
COPY . .

FROM base AS build
ENV NODE=development
WORKDIR /build
COPY --from=base /base ./
#RUN npm run build
RUN npm run build

FROM node:16.15.0 AS production
ENV NODE=production
WORKDIR /home/node/wallet-app
RUN chown -R node:node /home/node/wallet-app
COPY --from=build --chown=node:node /build/package.json ./package.json
COPY --from=build --chown=node:node /build/yarn.lock ./package-lock.json
COPY --from=build --chown=node:node /build/dist ./dist
COPY --from=build --chown=node:node /build/src ./src
COPY --from=build --chown=node:node /build/.env ./.env
COPY --from=build --chown=node:node /build/tsconfig.json ./tsconfig.json
COPY --from=build --chown=node:node /build/tsconfig.build.json ./tsconfig.build.json
RUN npm install
EXPOSE 4000
USER node
CMD npm run start:dev