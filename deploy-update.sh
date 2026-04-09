#!/bin/bash
# Deploy pipeline updates: frontend + Pages Functions proxy
# Run from: ~/claude-openclaw-copy/workspace/projects/pipeline-v2/
set -e

echo "=== Step 1: Deploy Worker backend ==="
cd worker
npx wrangler deploy
echo "✅ Worker deployed"

echo ""
echo "=== Step 2: Rebuild & deploy frontend + Pages Functions ==="
cd ../frontend
npm run build
npx wrangler pages deploy dist --project-name=pipeline-frontend
echo "✅ Frontend + API proxy function deployed"

echo ""
echo "=== Done! ==="
echo "The Pages Function at /api/* proxies to the Worker backend server-side."
echo "Cloudflare Access protects the frontend AND API calls stay on the same domain."
echo "Refresh pipeline.cwprop.com and check the bottom-left for your real email."
