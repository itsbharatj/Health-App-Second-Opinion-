from fastapi import APIRouter, UploadFile, File, HTTPException
from datetime import datetime
import os
from app.services.data_service import save_document, get_user_documents, analyze_with_cerebras
import json

router = APIRouter()

# Temporary file storage
UPLOAD_DIR = "/tmp/health_documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/{user_id}")
async def upload_medical_document(user_id: str, file: UploadFile = File(...)):
    """Upload a medical document for AI analysis"""
    
    try:
        # Save file
        file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{file.filename}")
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Mock analysis - in production, extract text from PDF/image
        document = {
            "document_id": f"doc_{datetime.now().timestamp()}",
            "user_id": user_id,
            "document_type": "medical_document",
            "file_name": file.filename,
            "uploaded_at": datetime.now().isoformat(),
            "file_path": file_path,
            "analysis": {
                "status": "analyzed",
                "extracted_conditions": [],
                "key_findings": []
            }
        }
        
        # Analyze document with AI
        doc_type = "prescription" if "prescription" in file.filename.lower() else \
                   "lab" if "lab" in file.filename.lower() else \
                   "report" if "report" in file.filename.lower() else \
                   "medical document"
        
        analysis_prompt = f"""This is a {doc_type} for an elderly patient named {user_id}. 
Please analyze and extract:
1. Key medical conditions mentioned
2. Current medications
3. Lab results and their significance for elderly patients
4. Any health risks or alerts
5. Recommendations for the elderly patient

Provide a clear, actionable analysis."""
        
        user_context = f"Analyzing {doc_type}: {file.filename} for elderly patient"
        analysis_result = analyze_with_cerebras(user_context, analysis_prompt)
        
        # Extract conditions from analysis
        conditions = []
        keywords = ["diabetes", "hypertension", "arthritis", "heart", "cancer", "copd", "asthma", 
                    "alzheimer", "parkinson", "stroke", "kidney", "liver", "thyroid"]
        for keyword in keywords:
            if keyword.lower() in analysis_result.lower():
                conditions.append(keyword.capitalize())
        
        document["analysis"]["summary"] = analysis_result
        document["analysis"]["document_type"] = doc_type
        document["analysis"]["extracted_conditions"] = list(set(conditions))  # Remove duplicates
        document["analysis"]["key_findings"] = [
            "Document received and analyzed",
            f"Identified {len(document['analysis']['extracted_conditions'])} condition(s)",
            "Ready for integration with health profile"
        ]
        
        # Save document record
        save_document(user_id, document)
        
        return {
            "status": "success",
            "document_id": document["document_id"],
            "message": f"Document {file.filename} uploaded and analyzed successfully",
            "analysis": document["analysis"],
            "extracted_conditions": document["analysis"]["extracted_conditions"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Upload failed: {str(e)}")

@router.get("/list/{user_id}")
async def list_documents(user_id: str):
    """List all uploaded documents for a user"""
    documents = get_user_documents(user_id)
    
    return {
        "user_id": user_id,
        "documents": documents,
        "count": len(documents)
    }

@router.get("/{user_id}/{document_id}")
async def get_document(user_id: str, document_id: str):
    """Get a specific document's analysis"""
    documents = get_user_documents(user_id)
    
    doc = next((d for d in documents if d["document_id"] == document_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return doc
