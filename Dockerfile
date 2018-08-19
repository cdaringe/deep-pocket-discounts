FROM node:10-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY scripts scripts
COPY packages packages
COPY lerna.json ./
RUN yarn bootstrap && yarn build
RUN mkdir -p /app/packages/api/static && \
  rm -rf /app/packages/api/static/public && \
  mv /app/packages/ui/build /app/packages/api/static/public
WORKDIR /app/packages/api
EXPOSE 9090
ENV NODE_ENV production
CMD [ "node", "build/bin.js" ]
