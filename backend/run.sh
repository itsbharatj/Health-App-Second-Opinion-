#!/bin/bash
cd /Users/bharatjain/Desktop/Startup_Market_Lab/backend
export $(cat .env | grep -v '#' | xargs)
python -m uvicorn app.main:app --reload --port 8000
