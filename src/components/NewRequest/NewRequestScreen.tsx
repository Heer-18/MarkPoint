import React, { useState, useRef } from 'react';
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
  VideoOff,
  Image as ImageIcon,
  CheckCircle2
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
  userCoords: { lat: number; lng: number };
}

export const NewRequestScreen: React.FC<NewRequestScreenProps> = ({
  onCaptureAndIngest,
  isLoading,
  selectedCity,
  userCoords
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [location, setLocation] = useState<SpatialCoordinate>({
    lat: userCoords.lat,
    lng: userCoords.lng,
    accuracy: 3.5
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync user location
  React.useEffect(() => {
    setLocation({
      lat: userCoords.lat,
      lng: userCoords.lng,
      accuracy: 3.5
    });
  }, [userCoords.lat, userCoords.lng]);

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
      console.warn('Camera access error, opening photo picker:', err);
      // Automatically trigger file picker if live video stream fails
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
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

  // Snap photo from video feed
  const takeSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 800;
      canvas.height = videoRef.current.videoHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  // Process and resize uploaded photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Processing photo...');
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image to reasonable resolution for AI
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCapturedImage(compressedDataUrl);
          setUploadStatus('');
          stopCamera();
        }
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
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
    <div className="space-y-5 pb-28 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight text-white">
          Report a Problem in {selectedCity}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Snap a photo or say what is broken. AI automatically categorizes and routes it to the right department.
        </p>
      </div>

      {/* 1. Quick One-Tap Preset Scenarios */}
      <QuickPresets
        onSelectPreset={handlePresetSelect}
        isLoading={isLoading}
      />

      {/* 2. Photo / Camera Ingestion Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Capture or Upload Photo
            </h3>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>{selectedCity} GPS</span>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="relative aspect-video max-h-72 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
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
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Hazard snapshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Photo Ready</span>
              </div>
            </div>
          )}

          {!cameraActive && !capturedImage && (
            <div className="text-center p-6 space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <Camera className="w-7 h-7 text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-slate-200">No Photo Selected Yet</p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Tap "Open Camera" or "Choose from Gallery" below to report an issue
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center space-x-2">
            {!cameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all shadow-sm"
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

            {/* Direct File & Gallery Picker */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-sm border border-slate-700/60"
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Choose from Gallery</span>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Submit Action */}
          {capturedImage && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>AI Analyzing Problem...</span>
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
