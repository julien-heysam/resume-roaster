#!/bin/bash

# Setup script for Heroku deployment with LaTeX support

echo "Setting up Heroku app with LaTeX buildpack..."

# Add the LaTeX buildpack (this needs to be run from your project root)
echo "Adding LaTeX buildpack to Heroku..."
heroku buildpacks:add https://github.com/Thermondo/heroku-buildpack-tex

# Add Python buildpack if not already added
echo "Adding Python buildpack to Heroku..."
heroku buildpacks:add heroku/python

# Show current buildpacks
echo "Current buildpacks:"
heroku buildpacks

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Deploy your app: git push heroku main"
echo "2. Check logs: heroku logs --tail"
echo "3. Test the LaTeX endpoint" 