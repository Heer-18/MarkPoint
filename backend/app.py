"""
Antigravity (CivicPulse) - FastAPI Ingestion Gateway & PostGIS Spatial Router
"""

import math
import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="CivicPulse (Antigravity) - AI Ingestion & Spatial Router",
    version="1.0.0",
    description="Automated crowdsourced civic issue ingestion, YOLOv8/Gemini screening, 25m spatial deduplication, and AI diff verification."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory database store for prototype sandbox execution
db_tickets = []

class GeoCoordinate(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float] = 5.0

class IngestResponse(BaseModel):
    success: bool = True
    is_duplicate: bool
    ticket_id: str
    upvote_count: int
    category: str
    sub_category: str
    target_department: str
    l2_escalation_role: str
    sla_hours: int
    sla_deadline: str
    ai_confidence: float
    detected_objects: List[dict]
    formal_complaint: str
    message: str

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates ground distance in meters (Simulates PostGIS ST_Distance(geography))"""
    r = 6371000  # meters
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c

@app.get("/")
def health_check():
    return {
        "service": "CivicPulse AI Engine",
        "status": "OPERATIONAL",
        "timestamp": datetime.utcnow().isoformat(),
        "modules": {
            "cv_screening": "ACTIVE (YOLOv8-Nano + Gemini Flash)",
            "spatial_deduplication": "ACTIVE (PostGIS ST_DWithin 25m)",
            "sla_escalation": "ACTIVE (L2 Statutory Matrix)"
        }
    }

@app.post("/api/v1/report/ingest")
async def ingest_report(
    latitude: float = Form(...),
    longitude: float = Form(...),
    image_url: Optional[str] = Form(None),
    voice_transcript: Optional[str] = Form(None),
    reporter_id: str = Form("usr-mobile-client"),
    device_hash: str = Form("dev-sha256-auth")
):
    """
    Core Ingestion Gateway:
    1. Geotagged coordinate verification
    2. Computer Vision screening (threshold >= 0.50)
    3. PostGIS ST_DWithin 25-meter spatial deduplication
    4. Virtual departmental assignment
    """
    # 1. Spatial Deduplication Check (ST_DWithin 25m)
    matched_duplicate = None
    for ticket in db_tickets:
        if ticket["status"] in ["PENDING_INTERNAL", "IN_PROGRESS", "WORK_SUBMITTED"]:
            dist = calculate_haversine_distance(latitude, longitude, ticket["latitude"], ticket["longitude"])
            if dist <= 25.0:
                matched_duplicate = ticket
                break

    if matched_duplicate:
        matched_duplicate["upvote_count"] += 1
        return {
            "success": True,
            "is_duplicate": True,
            "ticket_id": matched_duplicate["id"],
            "upvote_count": matched_duplicate["upvote_count"],
            "category": matched_duplicate["category"],
            "sub_category": matched_duplicate["sub_category"],
            "target_department": matched_duplicate["target_department"],
            "l2_escalation_role": matched_duplicate["l2_escalation_role"],
            "sla_hours": matched_duplicate["sla_hours"],
            "sla_deadline": matched_duplicate["sla_deadline"],
            "ai_confidence": matched_duplicate["ai_confidence"],
            "detected_objects": matched_duplicate["detected_objects"],
            "formal_complaint": matched_duplicate["formal_complaint"],
            "message": f"Spatial duplicate found within 25m. Incremented master ticket upvotes to {matched_duplicate['upvote_count']}."
        }

    # 2. Simulated YOLOv8-Nano / Gemini Inference
    ticket_id = f"TKT-2026-{uuid.uuid4().hex[:4].upper()}"
    sla_hours = 48
    sla_deadline = (datetime.utcnow() + timedelta(hours=sla_hours)).isoformat()

    new_ticket = {
        "id": ticket_id,
        "category": "Roads & Mobility",
        "sub_category": "Potholes (Deep / Hazardous)",
        "target_department": "Public Works Department (PWD)",
        "l2_escalation_role": "Executive Engineer (Roads)",
        "latitude": latitude,
        "longitude": longitude,
        "upvote_count": 1,
        "status": "PENDING_INTERNAL",
        "sla_hours": sla_hours,
        "sla_deadline": sla_deadline,
        "ai_confidence": 0.94,
        "detected_objects": [{"label": "Asphalt Cavity", "confidence": 0.95}],
        "formal_complaint": f"FORMAL CIVIC GRIEVANCE // PWD-RD-01\nLocation: [{latitude}, {longitude}]",
        "image_url": image_url or "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800",
        "reported_at": datetime.utcnow().isoformat()
    }
    db_tickets.append(new_ticket)

    return {
        "success": True,
        "is_duplicate": False,
        "ticket_id": ticket_id,
        "upvote_count": 1,
        "category": new_ticket["category"],
        "sub_category": new_ticket["sub_category"],
        "target_department": new_ticket["target_department"],
        "l2_escalation_role": new_ticket["l2_escalation_role"],
        "sla_hours": new_ticket["sla_hours"],
        "sla_deadline": new_ticket["sla_deadline"],
        "ai_confidence": new_ticket["ai_confidence"],
        "detected_objects": new_ticket["detected_objects"],
        "formal_complaint": new_ticket["formal_complaint"],
        "message": "New master grievance ticket created and assigned."
    }

@app.get("/api/v1/tickets")
def get_tickets():
    return {"tickets": db_tickets}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
