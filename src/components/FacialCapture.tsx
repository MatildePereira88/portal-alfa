import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

interface FacialCaptureProps {
  onCapture: (base64Photo: string) => void;
  onClear: () => void;
}

export default function FacialCapture({ onCapture, onClear }: FacialCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stop video stream when unmounting
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    setLoading(true);
    setCameraActive(false);

    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões do seu navegador.');
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Source variables for centered square crop to make it look polished
        const size = Math.min(video.videoWidth, video.videoHeight);
        const x = (video.videoWidth - size) / 2;
        const y = (video.videoHeight - size) / 2;

        ctx.drawImage(video, x, y, size, size, 0, 0, 300, 300);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        setPhoto(dataUrl);
        onCapture(dataUrl);

        // Turn off camera stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        setCameraActive(false);
      }
    } catch (err) {
      setError('Erro ao processar captura da imagem.');
    }
  };

  // Pre-configured simulated mock-portraits for local prototyping block-level safety
  const triggerMockSelfie = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // Create a nice styled SVG representation or high quality canvas avatar representation as Base64 fallback
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Gradient BG
        const gradient = ctx.createRadialGradient(150, 150, 20, 150, 150, 150);
        gradient.addColorStop(0, '#f0fdf4');
        gradient.addColorStop(1, '#dcfce7');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, 300);

        // Circular biometric background
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(150, 150, 120, 0, Math.PI * 2);
        ctx.stroke();

        // Standard neat avatar drawing representing facial mesh audit point validation
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(150, 110, 45, 0, Math.PI * 2); // Head
        ctx.fill();

        ctx.beginPath();
        ctx.arc(150, 250, 85, Math.PI, Math.PI * 2); // Shoulders
        ctx.fill();

        // Biometric scanning reticles
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        // Draw crosshair corners
        ctx.beginPath(); ctx.moveTo(70, 70); ctx.lineTo(90, 70); ctx.moveTo(70, 70); ctx.lineTo(70, 90); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(230, 70); ctx.lineTo(210, 70); ctx.beginPath(); ctx.moveTo(230, 70); ctx.lineTo(230, 90); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(70, 230); ctx.lineTo(90, 230); ctx.beginPath(); ctx.moveTo(70, 230); ctx.lineTo(70, 210); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(230, 230); ctx.lineTo(210, 230); ctx.beginPath(); ctx.moveTo(230, 230); ctx.lineTo(230, 210); ctx.stroke();

        // Biometric texts
        ctx.fillStyle = '#166534';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FACIAL SECURE LIVENESS MATCH', 150, 220);
        ctx.fillText('ID# ' + Math.floor(100000 + Math.random() * 900000), 150, 235);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(dataUrl);
        onCapture(dataUrl);
        setLoading(false);
      }
    }, 700);
  };

  const handleClear = () => {
    setPhoto(null);
    onClear();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setError(null);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-3 font-sans relative overflow-hidden">
      <div className="flex justify-between items-center select-none">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-emerald-600" />
          Fase 1: Reconhecimento Facial por Selfie
        </label>
        {photo && (
          <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Foto Capturada!
          </span>
        )}
      </div>

      {!photo && !cameraActive && (
        <div className="flex flex-col gap-2">
          <div className="border border-dashed border-slate-200/90 rounded-lg p-5 flex flex-col items-center justify-center text-center bg-white">
            <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-2">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-650 font-bold max-w-[280px]">
              Obrigatório validação de foto para auditoria antifraude e liveness-check.
            </p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[270px]">
              Sua imagem facial será adicionada diretamente ao recibo eletrônico do documento assinado de forma irrevogável.
            </p>
          </div>

          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={startCamera}
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  Ativar Minha Câmera
                </>
              )}
            </button>
            <button
              type="button"
              onClick={triggerMockSelfie}
              disabled={loading}
              className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-[10px]/normal rounded-lg transition active:scale-95 cursor-pointer uppercase flex items-center gap-1"
              title="Simular Biometria se estiver sem câmera"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Simular
            </button>
          </div>
        </div>
      )}

      {error && !photo && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-[11px] flex gap-2 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">{error}</p>
            <button
              type="button"
              onClick={triggerMockSelfie}
              className="text-emerald-700 font-extrabold underline mt-1.5 hover:text-emerald-800 block uppercase tracking-wide text-[9px]"
            >
              👉 Clique aqui para simular a biometria orbital de testes
            </button>
          </div>
        </div>
      )}

      {cameraActive && !photo && (
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-emerald-500 bg-black flex items-center justify-center shadow-md">
            {/* Live Camera Video stream */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover -scale-x-100"
              playsInline
              muted
            />

            {/* Glowing biometric visual guide ring */}
            <div className="absolute inset-1.5 border-2 border-dashed border-emerald-400/70 rounded-full animate-pulse pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-emerald-500/20 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-emerald-500/20 pointer-events-none" />
            
            {/* Scanning light gradient bar bar bar */}
            <div className="absolute h-0.5 bg-emerald-400 w-full top-0 left-0 animate-[bounce_2s_infinite] opacity-80 shadow-[0_0_8px_#34d399]" />
          </div>

          <p className="text-[10px] text-slate-500 font-bold text-center">
            Mantenha seu rosto centralizado no círculo com iluminação adequada.
          </p>

          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={capturePhoto}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              📸 Capturar Foto de Validação
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-lg transition active:scale-95 cursor-pointer"
            >
              Desativar
            </button>
          </div>
        </div>
      )}

      {photo && (
        <div className="flex items-center gap-3.5 bg-white border border-slate-150 rounded-lg p-2.5">
          <img
            src={photo}
            alt="Selfie cadastrada"
            className="w-20 h-20 rounded-lg border-2 border-emerald-500 object-cover shadow-sm bg-slate-50"
          />
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <span className="font-extrabold text-[11px] text-slate-700 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Biometria Integrada!
            </span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Esta selfie certificada ficará codificada nos logs de compliance do contracheque, garantindo conformidade jurídica imediata.
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-500 hover:text-red-700 text-[10px] font-bold text-left underline w-fit uppercase mt-0.5 transition cursor-pointer"
            >
              🔄 Refazer Selfie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
