#!/bin/bash

# Script to easily backup the Bramhollow Condominium Association website to GitHub

# Add all changes to staging
git add .

# Get commit message from user
echo "Enter a commit message describing your changes:"
read commit_message

# If no message provided, use a default one
if [ -z "$commit_message" ]; then
  commit_message="Update Bramhollow website content and features"
fi

# Commit changes
git commit -m "$commit_message"

# Push to GitHub using the GITHUB_TOKEN environment variable
git push -u origin main

echo "Successfully backed up to GitHub!"
echo "Visit your repository at: https://github.com/shoes013/bramhollow-condo-association"