#!/bin/bash

cd "/Users/ericmasmela/Documents/local web/Micro-SaaS-marketplace"

echo "📦 Staging all changes..."
git add -A

echo "💾 Committing changes..."
git commit -m "Add documentation sections to all 43 tools" || echo "No new changes to commit"

echo "🚀 Pushing to GitHub..."
git push origin switch-to-neon

echo ""
echo "✅ Done! Your changes are now on GitHub."
echo ""
echo "Next steps:"
echo "1. Go to GitHub and merge the PR to 'main' branch"
echo "2. OR run: git checkout main && git merge switch-to-neon && git push origin main"
echo "3. Vercel will automatically deploy when you push to main"
echo ""
echo "To push to main now, run:"
echo "  git checkout main"
echo "  git merge switch-to-neon"
echo "  git push origin main"

