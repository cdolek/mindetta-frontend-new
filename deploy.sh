#!/bin/bash

# Variables
SERVER_USER="root"  # Username for your server
SERVER_IP="147.182.142.167"  # Your server's IP address
SERVER_PATH="/var/www/mindetta-frontend"  # Path to your app on the server
APP_NAME="mindetta"  # The pm2 app name

# Step 1: Build the Next.js app locally
echo "-----------------------------"
echo "Building the Next.js app..."
echo "-----------------------------"

bun run build

# Check if the build succeeded
if [ $? -eq 0 ]; then
    echo "-----------------------------"
    echo "Build succeeded!"
    echo "-----------------------------"
    # Step 2: Transfer the .next directory to the server using rsync
    echo "Syncing .next directory to the server..."
    echo "-----------------------------"
    rsync -avz --progress .next $SERVER_USER@$SERVER_IP:$SERVER_PATH

    # Step 3: SSH into the server and restart the pm2 app
    echo "-----------------------------"
    echo "Restarting the app on the server..."
    echo "-----------------------------" 
    ssh $SERVER_USER@$SERVER_IP "source /root/.nvm/nvm.sh && pm2 restart $APP_NAME"
    echo "Deployment complete!"
    echo "-----------------------------"    
else
    echo "Build failed. Please check the errors and try again."
fi
