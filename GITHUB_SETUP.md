# GitHub Pages Setup Guide

Follow these steps to upload your calculator to GitHub and host it as a website.

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `byd-ev-calculator` or `thailand-ev-subsidy-calculator`)
5. Make it **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Initialize Git and Push to GitHub

Open Terminal and run these commands:

```bash
# Navigate to your project folder
cd "/Users/aaronroodhart/Library/Mobile Documents/com~apple~CloudDocs/Fall 2025/IB/Car calculator"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: BYD EV Subsidy Calculator"

# Add your GitHub repository as remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

## Step 4: Access Your Website

After a few minutes, your website will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

GitHub will show you the exact URL in the Pages settings section.

## Troubleshooting

- If images don't load, make sure all image files are committed to the repository
- If the page shows 404, wait a few minutes for GitHub Pages to build
- Check that `index.html` is in the root directory
- Make sure the repository is set to **Public**

## Updating Your Website

Whenever you make changes:

```bash
git add .
git commit -m "Description of your changes"
git push
```

Changes will be live on GitHub Pages within a few minutes.

