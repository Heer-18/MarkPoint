/**
 * Voice Note Recording & Speech Recognition Service
 */

export interface VoiceRecordingSession {
  start: (onTranscriptUpdate?: (text: string) => void) => Promise<void>;
  stop: () => Promise<{ audioBlob: Blob; transcript: string }>;
  getAnalyser: () => AnalyserNode | null;
}

export function createVoiceRecorder(): VoiceRecordingSession {
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let audioContext: AudioContext | null = null;
  let analyserNode: AnalyserNode | null = null;
  let recognition: any = null;
  let fullTranscript = '';

  return {
    start: async (onTranscriptUpdate) => {
      audioChunks = [];
      fullTranscript = '';

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 64;
      source.connect(analyserNode);

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };
      mediaRecorder.start(100);

      // Web Speech API if supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          fullTranscript = current.trim();
          if (onTranscriptUpdate) onTranscriptUpdate(fullTranscript);
        };

        try {
          recognition.start();
        } catch (e) {
          console.warn('Speech recognition start failed:', e);
        }
      }
    },

    stop: async () => {
      return new Promise((resolve) => {
        if (recognition) {
          try {
            recognition.stop();
          } catch (e) {}
        }

        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
          resolve({
            audioBlob: new Blob(audioChunks, { type: 'audio/webm' }),
            transcript: fullTranscript
          });
          return;
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          if (audioContext) {
            audioContext.close();
          }
          resolve({
            audioBlob,
            transcript: fullTranscript
          });
        };

        mediaRecorder.stop();
      });
    },

    getAnalyser: () => analyserNode
  };
}

/**
 * Text to speech feedback helper
 */
export function speakText(_text: string) {
  // TTS voice feedback disabled per user preference
}
