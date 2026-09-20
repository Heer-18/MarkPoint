import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { createVoiceRecorder } from '../../services/voiceService';

interface VoiceReporterProps {
  onTranscriptReady: (transcript: string) => void;
  currentTranscript: string;
}

export const VoiceReporter: React.FC<VoiceReporterProps> = ({
  onTranscriptReady,
  currentTranscript
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(currentTranscript);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recorderRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setTranscript(currentTranscript);
  }, [currentTranscript]);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const recorder = createVoiceRecorder();
      recorderRef.current = recorder;
      await recorder.start((text) => {
        setTranscript(text);
        onTranscriptReady(text);
      });
      setIsRecording(true);
      drawWaveform(recorder.getAnalyser());
    } catch (err) {
      console.error('Microphone access error:', err);
      // Fallback mock transcript if no mic hardware
      const mockText = 'Hazardous pothole on main carriageway causing severe traffic slowdown.';
      setTranscript(mockText);
      onTranscriptReady(mockText);
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current && isRecording) {
      const result = await recorderRef.current.stop();
      setIsRecording(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (result.transcript) {
        setTranscript(result.transcript);
        onTranscriptReady(result.transcript);
      }
    }
  };

  const drawWaveform = (analyser: AnalyserNode | null) => {
    if (!canvasRef.current || !analyser) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgb(${16 + dataArray[i]}, 185, 129)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    };

    render();
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-slate-300">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Voice Note Ingestion</span>
        </div>
        {isRecording && (
          <span className="flex items-center space-x-1 text-xs font-mono text-rose-400 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>00:{recordingSeconds.toString().padStart(2, '0')}</span>
          </span>
        )}
      </div>

      {/* Visualizer Canvas */}
      {isRecording && (
        <div className="h-10 w-full mb-3 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
          <canvas ref={canvasRef} width={300} height={40} className="w-full h-full" />
        </div>
      )}

      {/* Control & Transcript */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 animate-pulse'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Stop Voice Note</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>Record Voice Note</span>
            </>
          )}
        </button>

        <div className="flex-1">
          <input
            type="text"
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              onTranscriptReady(e.target.value);
            }}
            placeholder="Or say 'this pothole is dangerous' while riding..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};
