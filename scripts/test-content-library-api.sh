#!/bin/bash

# Content Library API Test Script
# Note: This project runs on port 3002 (not 3000)

BASE_URL="http://localhost:3002/api/content-library"

echo "🧪 Testing Content Library API Endpoints"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Create a content item
echo -e "${YELLOW}Test 1: Creating a content item...${NC}"
RESPONSE1=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Content",
    "description": "This is a test content item",
    "content_type": "text",
    "content_data": {"text": "Hello World", "format": "markdown"},
    "tags": ["test", "demo"],
    "status": "published"
  }')

if echo "$RESPONSE1" | grep -q "success"; then
  echo -e "${GREEN}✅ Content item created successfully${NC}"
  CONTENT_ID=$(echo "$RESPONSE1" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo "   Content ID: $CONTENT_ID"
else
  echo -e "${RED}❌ Failed to create content item${NC}"
  echo "$RESPONSE1"
fi
echo ""

# Test 2: Get all content items
echo -e "${YELLOW}Test 2: Getting all content items...${NC}"
RESPONSE2=$(curl -s "$BASE_URL?limit=10&offset=0")
if echo "$RESPONSE2" | grep -q "success"; then
  echo -e "${GREEN}✅ Retrieved content items${NC}"
  COUNT=$(echo "$RESPONSE2" | grep -o '"total":[0-9]*' | cut -d':' -f2)
  echo "   Total items: $COUNT"
else
  echo -e "${RED}❌ Failed to retrieve content items${NC}"
  echo "$RESPONSE2"
fi
echo ""

# Test 3: Search content
echo -e "${YELLOW}Test 3: Searching content...${NC}"
RESPONSE3=$(curl -s -X POST "$BASE_URL/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "hello",
    "tags": ["test"],
    "content_type": ["text"],
    "limit": 20
  }')

if echo "$RESPONSE3" | grep -q "success"; then
  echo -e "${GREEN}✅ Search completed successfully${NC}"
else
  echo -e "${RED}❌ Search failed${NC}"
  echo "$RESPONSE3"
fi
echo ""

# Test 4: Create a collection
echo -e "${YELLOW}Test 4: Creating a collection...${NC}"
RESPONSE4=$(curl -s -X POST "$BASE_URL/collections" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Collection",
    "description": "A test collection",
    "tags": ["collection", "test"]
  }')

if echo "$RESPONSE4" | grep -q "success"; then
  echo -e "${GREEN}✅ Collection created successfully${NC}"
  COLLECTION_ID=$(echo "$RESPONSE4" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo "   Collection ID: $COLLECTION_ID"
else
  echo -e "${RED}❌ Failed to create collection${NC}"
  echo "$RESPONSE4"
fi
echo ""

# Test 5: Get collections
echo -e "${YELLOW}Test 5: Getting all collections...${NC}"
RESPONSE5=$(curl -s "$BASE_URL/collections")
if echo "$RESPONSE5" | grep -q "success"; then
  echo -e "${GREEN}✅ Retrieved collections${NC}"
else
  echo -e "${RED}❌ Failed to retrieve collections${NC}"
  echo "$RESPONSE5"
fi
echo ""

# Test 6: Get templates
echo -e "${YELLOW}Test 6: Getting templates...${NC}"
RESPONSE6=$(curl -s "$BASE_URL/templates")
if echo "$RESPONSE6" | grep -q "success"; then
  echo -e "${GREEN}✅ Retrieved templates${NC}"
else
  echo -e "${RED}❌ Failed to retrieve templates${NC}"
  echo "$RESPONSE6"
fi
echo ""

echo "========================================"
echo "✅ API Testing Complete"
echo ""
echo "Note: Make sure your dev server is running:"
echo "  npm run dev"
echo ""
echo "The server should be running on port 3002"
