from node:alpine

WORKDIR /app

COPY package.json package.json
COPY *.js ./

RUN npm install && pwd && ls -l

CMD ["node", "endpoint.js"]
