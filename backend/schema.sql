-- ==============================================================================
-- Antigravity (CivicPulse) - Master PostgreSQL 16 + PostGIS Schema
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Issue Taxonomy Enumeration
CREATE TYPE issue_vertical_enum AS ENUM (
    'ROADS_MOBILITY',
    'SOLID_WASTE',
    'WATER_BODIES_ECOLOGY',
    'PUBLIC_UTILITIES',
    'CIVIC_ASSETS'
);

-- 2. Ticket Status Lifecycle
CREATE TYPE ticket_status_enum AS ENUM (
    'PENDING_INTERNAL',
    'IN_REVIEW',
    'IN_PROGRESS',
    'WORK_SUBMITTED',
    'RESOLVED_DEMO',
    'VERIFIED_RESOLVED',
    'ESCALATED_SLA_BREACH',
    'REJECTED'
);

-- 3. Severity / Priority Level
CREATE TYPE severity_priority_enum AS ENUM (
    'CRITICAL',
    'URGENT',
    'HIGH',
    'MEDIUM',
    'LOW'
);

-- 4. Master Civic Issues Table
CREATE TABLE IF NOT EXISTS civic_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taxonomy_id VARCHAR(16) NOT NULL,
    category VARCHAR(64) NOT NULL,
    sub_category VARCHAR(64) NOT NULL,
    vertical issue_vertical_enum NOT NULL,
    status ticket_status_enum NOT NULL DEFAULT 'PENDING_INTERNAL',
    priority severity_priority_enum NOT NULL DEFAULT 'URGENT',
    sla_hours INTEGER NOT NULL DEFAULT 24,
    sla_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Citizen & Geolocation Telemetry
    reporter_id VARCHAR(64) NOT NULL,
    reporter_name VARCHAR(128) NOT NULL,
    reporter_device_hash VARCHAR(128) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    gps_accuracy FLOAT DEFAULT 5.0,
    address TEXT,
    upvote_count INTEGER NOT NULL DEFAULT 1,
    upvoted_by TEXT[] DEFAULT '{}',
    
    -- Routing & Authorities
    assigned_department VARCHAR(128) NOT NULL,
    l2_escalation_role VARCHAR(128) NOT NULL,
    geofence_zone VARCHAR(128),
    is_escalated BOOLEAN DEFAULT FALSE,
    
    -- AI & Computer Vision Artifacts
    image_url TEXT NOT NULL,
    image_after_url TEXT,
    ai_confidence FLOAT NOT NULL DEFAULT 0.0,
    detected_objects JSONB DEFAULT '[]'::jsonb,
    detected_cv_triggers TEXT[] DEFAULT '{}',
    formal_complaint_draft TEXT,
    citizen_voice_transcript TEXT,
    
    -- Verification & Timestamps
    verification_payload JSONB,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 5. Spatial GIST Index for Sub-millisecond Radius Deduplication (ST_DWithin 25m)
CREATE INDEX IF NOT EXISTS idx_civic_issues_spatial 
ON civic_issues 
USING GIST (location);

-- 6. B-Tree Indexes for High-Frequency Filtering
CREATE INDEX IF NOT EXISTS idx_civic_issues_status_category 
ON civic_issues (status, category);

CREATE INDEX IF NOT EXISTS idx_civic_issues_department_sla 
ON civic_issues (assigned_department, sla_deadline);

-- ==============================================================================
-- PostGIS ST_DWithin 25-Meter Deduplication Query Example:
-- ==============================================================================
-- SELECT id, upvote_count, assigned_department 
-- FROM civic_issues 
-- WHERE category = :detected_category 
--   AND status IN ('PENDING_INTERNAL', 'IN_PROGRESS', 'WORK_SUBMITTED')
--   AND ST_DWithin(
--       location::geography, 
--       ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, 
--       25
--   );
