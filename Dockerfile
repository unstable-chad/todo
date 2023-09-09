
# Fixing the Dockerfile to resolve the error

# Using a specific version of NodeJS as the base image
FROM node:14

# Setting the working directory
WORKDIR /usr/src/app

# Copying the package.json file to the working directory
COPY package.json ./

# Installing the dependencies
RUN npm install

# Copying all files from the current directory to the working directory
COPY . .

# Exposing the desired port
EXPOSE 3000

# Running the application
CMD [ "node", "app.js" ]
