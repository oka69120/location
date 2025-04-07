FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Corriger les permissions des binaires locaux
RUN chmod +x node_modules/.bin/vue-tsc && chmod +x node_modules/.bin/vite

RUN npm run build

RUN npm install -g serve
EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]

