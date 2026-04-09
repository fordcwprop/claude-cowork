#!/bin/bash
# Push a deal JSON file to the CW Pipeline API
# Usage: bash push-deal.sh deal.json
# Or pipe JSON: echo '{"name":"Test Deal"}' | bash push-deal.sh

API_URL="https://pipeline-backend.office-a21.workers.dev/api/deals"
AUTH_EMAIL="macminicp@gmail.com"

if [ -n "$1" ] && [ -f "$1" ]; then
  JSON=$(cat "$1")
elif [ ! -t 0 ]; then
  JSON=$(cat)
else
  echo "Usage: bash push-deal.sh <deal.json>"
  echo "   or: echo '{\"name\":\"Test\"}' | bash push-deal.sh"
  exit 1
fi

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Cf-Access-Authenticated-User-Email: $AUTH_EMAIL" \
  -d "$JSON" | python3 -m json.tool

echo ""
echo "✅ Deal pushed to pipeline.cwprop.com"
