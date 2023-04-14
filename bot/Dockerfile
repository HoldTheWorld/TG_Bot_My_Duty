FROM node:16
WORKDIR /dutybot/bot
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install 
COPY . .
CMD [ "node", "main.js" ]

