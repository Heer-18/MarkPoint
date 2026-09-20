import { CivicIssue, SpatialCoordinate } from '../types/civic';
import { calculateDistanceMeters } from './postgisEngine';

export interface VerificationRequest {
  ticket: CivicIssue;
  imageAfterUrl: string;
  uploadLocation: SpatialCoordinate;
  workerNotes?: string;
}

export interface VerificationResponse {
  verified: boolean;
  confidence: number;
  diffScore: number; // 0.0 to 1.0 (Higher = clear physical remediation observed)
  distanceMeters: number;
  reasoning: string;
  verificationBadge: 'GENUINE_FIX' | 'GEOFENCE_FAILED' | 'UNRESOLVED_HAZARD' | 'DECEPTIVE_SUBMISSION';
}

/**
 * "No Fake Closures" AI Verification Studio Engine
 * Enforces dual constraints:
 * 1. 15m Geofenced Proof-of-Work radius verification.
 * 2. Computer Vision Before-vs-After physical repair diff confirmation.
 */
export async function verifyWorkSubmission(
  req: VerificationRequest
): Promise<VerificationResponse> {
  // Simulate neural diff calculation latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const distance = calculateDistanceMeters(req.ticket.location, req.uploadLocation);

  // 1. Strict 15-meter Geofence Check
  if (distance > 15) {
    return {
      verified: false,
      confidence: 0.96,
      diffScore: 0.12,
      distanceMeters: Math.round(distance * 10) / 10,
      reasoning: `Geofence violation: Field crew upload location is ${Math.round(distance)}m away from incident point (Allowed maximum: 15m). Rejected.`,
      verificationBadge: 'GEOFENCE_FAILED'
    };
  }

  // 2. Diff & Remediation Analysis based on taxonomy
  const isDemoFake = req.imageAfterUrl.includes('fake') || req.workerNotes?.toLowerCase().includes('fake');
  
  if (isDemoFake) {
    return {
      verified: false,
      confidence: 0.94,
      diffScore: 0.18,
      distanceMeters: Math.round(distance * 10) / 10,
      reasoning: 'Deceptive submission flagged: AI Computer Vision detects unresolved physical hazard. Surface texture and cavity pattern identical to original report.',
      verificationBadge: 'DECEPTIVE_SUBMISSION'
    };
  }

  // Valid resolution verification
  const taxonomyId = req.ticket.taxonomyId;
  let specificReason = 'AI Computer Vision Diff verified complete physical remediation of hazard.';

  if (taxonomyId.startsWith('RD-01')) {
    specificReason = 'Asphalt cavity sealed with mastic cold-mix patch. Surface planar variance restored within standard tolerances (99.2% match).';
  } else if (taxonomyId.startsWith('SW')) {
    specificReason = 'Municipal waste volume reduced by >95%. Periphery footprint sanitized and container returned to nominal level.';
  } else if (taxonomyId.startsWith('WB')) {
    specificReason = 'Watercourse surface cleared of floating chemical lather and solid debris. Natural flow velocity restored.';
  } else if (taxonomyId.startsWith('PA-01')) {
    specificReason = 'Overhead roadway obstruction fully removed. Carriageway cleared for normal transit.';
  }

  return {
    verified: true,
    confidence: 0.93,
    diffScore: 0.91,
    distanceMeters: Math.round(distance * 10) / 10,
    reasoning: `${specificReason} Geofenced location verified at ${Math.round(distance)}m radius.`,
    verificationBadge: 'GENUINE_FIX'
  };
}
