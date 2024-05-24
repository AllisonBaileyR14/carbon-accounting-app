FROM node:20

WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files first
COPY package*.json ./
RUN npm install

# Copy the entire source directory to the container
COPY . .

# Explicitly copy the .env file to the working directory
COPY .env ./

RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
