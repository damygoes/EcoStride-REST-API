# Base image for the application will use the node:20-alpine image because it is a lightweight image
FROM node:20-alpine
# create a user with permissions to only run the application
# -S -> create a system user
# -G -> add the user to a group
RUN addgroup ecostride-backend && adduser -S ecostride-backend -G ecostride-backend
# Change the user to the new user
USER ecostride-backend
# Create a directory for the application
WORKDIR /ecostride-backend
# Copy the package.json and package-lock.json files to the directory
COPY package*.json ./
# sometimes the ownership of the files is changed when copying them to the container, so we need to change the ownership of the files to the new user
USER root
# Change the ownership of the files to the new user
RUN chown -R ecostride-backend:ecostride-backend /ecostride-backend
# Install the dependencies
RUN npm install
# Copy the rest of the files to the directory
COPY . .
# Expose the port 3000
EXPOSE 3000
# Start the application
CMD ["npm", "start"]
