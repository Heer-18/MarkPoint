import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  MapPin, 
  Volume2, 
  Zap, 
  ShieldCheck, 
  Send, 
  RefreshCw,
  Crosshair,
  AlertTriangle,
  Upload,
  Video,
  VideoOff
} from 'lucide-react';
import { SpatialCoordinate } from '../../types/civic';
import { QuickPresets, PresetScenario } from '../CitizenView/QuickPresets';
import { VoiceReporter } from '../CitizenView/VoiceReporter';

interface NewRequestScreenProps {
  onCaptureAndIngest: (payload: {
    imageUrl: string;
    location: SpatialCoordinate;
    voiceTranscript: string;
    presetHint?: string;
  }) => void;
  isLoading: boolean;
  selectedCity: string;
}

export const NewRequestScreen: React.FC<NewRequestScreenProps> = ({
  onCaptureAndIngest,
  isLoading,
  selectedCity
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [location, setLocation] = useState<SpatialCoordinate>({
    lat: 28.6345,
    lng: 77.2182,
    accuracy: 3.5
  });

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setCapturedImage(null);
    } catch (err) {
      // High-res fallback image
      setCapturedImage('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Snap photo
  const takeSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 800;
      canvas.height = videoRef.current.videoHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.85));
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!capturedImage) return;
    onCaptureAndIngest({
      imageUrl: capturedImage,
      location,
      voiceTranscript
    });
  };

  const handlePresetSelect = (preset: PresetScenario) => {
    onCaptureAndIngest({
      imageUrl: preset.imageUrl,
      location: preset.location,
      voiceTranscript: preset.voiceTranscript,
      presetHint: preset.subCategory
    });
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">
          Report a Problem in {selectedCity}
        </h2>
        <p className="text-xs text-slate-400">
          Snap a photo or say what is broken. We'll automatically route it to the right department.
        </p>
      </div>

      {/* 1. Quick One-Tap Preset Scenarios */}
      <QuickPresets
        onSelectPreset={handlePresetSelect}
        isLoading={isLoading}
      />

      {/* 2. Photo / Camera Ingestion Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Take or Upload a Photo
            </h3>
          </div>
          <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>GPS Locked</span>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="relative aspect-video max-h-72 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 flex items-center justify-center">
          {cameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {!cameraActive && capturedImage && (
            <img
              src={capturedImage}
              alt="Hazard snapshot"
              className="w-full h-full object-cover"
            />
          )}

          {!cameraActive && !capturedImage && (
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <Camera className="w-7 h-7 text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-slate-200">Camera Ready</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tap below to activate camera or pick a test scenario above
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            {!cameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
              >
                <Video className="w-4 h-4 text-emerald-400" />
                <span>{capturedImage ? 'Retake Photo' : 'Open Camera'}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={takeSnapshot}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg animate-pulse"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-400"
                >
                  <VideoOff className="w-4 h-4" />
                </button>
              </>
            )}

            <label className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {capturedImage && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Checking Duplicates...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 3. Voice Note Option */}
      <VoiceReporter
        currentTranscript={voiceTranscript}
        onTranscriptReady={setVoiceTranscript}
      />

    </div>
  );
};
