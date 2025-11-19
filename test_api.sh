#!/bin/bash

# Test script for Second Opinion Health App API

echo "🏥 Testing Second Opinion Health App API"
echo "========================================="
echo ""

# Test 1: Health Check
echo "✓ Test 1: Health Check"
curl -s http://localhost:8000/health | jq .
echo ""

# Test 2: Initialize Health Data
echo "✓ Test 2: Initialize Health Data"
curl -s http://localhost:8000/api/health/init/elderly_001 | jq .
echo ""

# Test 3: Get Health Profile
echo "✓ Test 3: Get Health Profile"
curl -s http://localhost:8000/api/health/profile/elderly_001 | jq .
echo ""

# Test 4: Get Health Metrics
echo "✓ Test 4: Get Health Metrics (Last 7 Days)"
curl -s 'http://localhost:8000/api/health/metrics/elderly_001?days=7' | jq '.metrics[0]'
echo ""

# Test 5: Get Health Summary
echo "✓ Test 5: Get Health Summary & Alerts"
curl -s http://localhost:8000/api/health/summary/elderly_001 | jq '.alerts'
echo ""

# Test 6: List Documents
echo "✓ Test 6: List Medical Documents"
curl -s http://localhost:8000/api/documents/list/elderly_001 | jq .
echo ""

# Test 7: List Guardians
echo "✓ Test 7: List Guardians"
curl -s http://localhost:8000/api/guardians/list/elderly_001 | jq .
echo ""

# Test 8: Add Guardian
echo "✓ Test 8: Add Guardian"
curl -s "http://localhost:8000/api/guardians/add/elderly_001?guardian_name=John%20Smith&relationship=Son&access_level=view_all" | jq .
echo ""

echo "========================================="
echo "✅ Basic API tests completed!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
