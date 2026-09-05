import React, { useState, useRef, useEffect } from 'react';
import { useInspection } from '../context/InspectionContext';
import { SAMPLE_PACKAGES, PackagePreset } from '../services/team2MockService';
import { InspectionRecord } from '../types/inspection';
import {
  Camera,
  Upload,
  RefreshCw,
  Box,
  Sparkles,
  MapPin,
  Building,
  Hash,
  AlertCircle,
  Check,
  Maximize2,
  VideoOff
} from 'lucide-react';

export const CameraCapture: React.FC = () => {
  const { runAnalysis, officer } = useInspection();

  const [packageType, setPackageType] = useState<InspectionRecord['packageType']>('Cereal Box');
  const [sampleLocation, setSampleLocation] = useState<string>(`${officer.zone} - General Market`);
  const [retailerName, setRetailerName] = useState<string>('Super Bazaar Retail Store');
  const [batchNumber, setBatchNumber] = useState<string>(`LOT-${Math.floor(1000 + Math.random() * 9000)}`);
  
  const [selectedPreset, setSelectedPreset] = useState<PackagePreset | null>(SAMPLE_PACKAGES[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Camera feed state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Start camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setCameraError('Camera API not accessible in this browser context. Please select a preset sample or upload a photo.');
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access denied or unavailable in this iframe. You can select a sample box package or upload a JPG/PNG file.');
      setCameraActive(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture frame from webcam
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setUploadedImage(dataUrl);
        setSelectedPreset(null);
        stopCamera();
      }
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedPreset(null);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartScan = () => {
    const finalImage = uploadedImage || selectedPreset?.thumbnail || SAMPLE_PACKAGES[0].thumbnail;
    const finalPreset = uploadedImage ? undefined : selectedPreset || undefined;

    runAnalysis({
      imageUrl: finalImage,
      preset: finalPreset,
      packageType,
      sampleLocation,
      retailerName,
      batchNumber
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      {/* View Title */}
      <div className="p-4 border-b border-slate-200 bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Mobile-Responsive Inspection Interface
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              V1 Box Scope
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Legal Metrology Compliance Check • Restricted to V1 Rectangular / Box Packaging Only
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <Box className="w-3.5 h-3.5 text-indigo-600" />
          <span>Rectangular Packaging Scope</span>
        </div>
      </div>

      {/* Main Camera / Visual Capture Box with Required Frame-Guide Overlay */}
      <div className="bg-slate-950 rounded-lg p-3 shadow-md border border-slate-800 text-white">
        <div className="relative aspect-[4/3] sm:aspect-[16/10] max-h-[420px] w-full bg-slate-900 rounded overflow-hidden flex items-center justify-center border border-slate-800">
          
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Uploaded or Preset Preview when camera is off */}
          {!cameraActive && (
            <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
              {uploadedImage || selectedPreset ? (
                <img
                  src={uploadedImage || selectedPreset?.thumbnail}
                  alt="Package sample"
                  className="w-full h-full object-contain p-2"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Box className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No packaging image loaded</p>
                </div>
              )}
            </div>
          )}

          {/* REQUIRED FRAME-GUIDE OVERLAY */}
          {/* "The interface should visually guide the officer to place the rectangular package inside the frame." */}
          {/* Display: "Place the product inside the box." */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
            {/* Rectangular Target Box with Corner Reticles */}
            <div className="relative w-4/5 max-w-[400px] aspect-[4/3] border-2 border-dashed border-indigo-400/90 rounded-sm shadow-[0_0_0_9999px_rgba(15,23,42,0.6)] flex items-center justify-center transition-all">
              
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-indigo-400" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-indigo-400" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-indigo-400" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-indigo-400" />

              {/* Central text instruction as explicitly required */}
              <div className="bg-slate-950/90 backdrop-blur-xs border border-indigo-500/40 text-indigo-300 font-bold px-3.5 py-1.5 rounded-full text-xs shadow-md tracking-wide flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Place the product inside the box.</span>
              </div>
            </div>

            {/* Principal Display Panel (PDP) indicator */}
            <div className="mt-2.5 text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2.5 py-0.5 rounded">
              Principal Display Panel (PDP) Alignment
            </div>
          </div>

          {/* Camera controls toolbar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
            {cameraActive ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={captureFrame}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded shadow flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Capture Photo</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Activate Camera</span>
                </button>
                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded border border-slate-700 flex items-center gap-1.5 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {selectedPreset && !cameraActive && (
              <span className="text-[10px] text-indigo-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 truncate max-w-[200px] font-mono">
                Sample: {selectedPreset.name}
              </span>
            )}
          </div>
        </div>

        {/* Camera error / fallback note */}
        {cameraError && (
          <div className="mt-2.5 p-2 rounded bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-300 flex items-center space-x-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>

      {/* V1 Scope Package Presets for Rapid Prototype Testing */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              V1 Rectangular Packaging Presets
            </h3>
            <p className="text-[11px] text-slate-500">
              Select an official SIH test package (cereal boxes, soap boxes, cartons) for instant compliance verification.
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
            {SAMPLE_PACKAGES.length} Box Models
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_PACKAGES.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id && !uploadedImage && !cameraActive;
            const isNonCompliant = preset.response.compliance.status === 'NON_COMPLIANT';
            return (
              <div
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset);
                  setUploadedImage(null);
                  setPackageType(preset.packageType);
                  setSampleLocation(preset.sampleLocation);
                  setRetailerName(preset.retailerName);
                  stopCamera();
                }}
                className={`cursor-pointer rounded border p-2 transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="aspect-[4/3] rounded overflow-hidden bg-slate-100 mb-1.5 relative">
                    <img
                      src={preset.thumbnail}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 right-1.5">
                      {isNonCompliant ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-600 text-white">
                          Violation Flag
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                          Compliant
                        </span>
                      )}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{preset.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{preset.packageType}</p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-mono">Score: {preset.response.compliance.score}%</span>
                  {isSelected ? (
                    <span className="text-indigo-700 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  ) : (
                    <span className="text-indigo-600 font-semibold hover:underline">Select</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Package & Inspection Metadata */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Chain of Custody & Location Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Package Type (V1 Scope)
            </label>
            <select
              value={packageType}
              onChange={(e) => setPackageType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Cereal Box">Cereal Box (Rectangular)</option>
              <option value="Soap Box">Soap Box (Rectangular)</option>
              <option value="Rectangular Carton">Rectangular Carton</option>
              <option value="Food Carton">Food Grain Carton</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Retailer / Establishment
            </label>
            <input
              type="text"
              value={retailerName}
              onChange={(e) => setRetailerName(e.target.value)}
              placeholder="e.g. Connaught Retailers Pvt Ltd"
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Batch / Lot Number
            </label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="e.g. AB-904"
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Inspection Site / Market Location
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={sampleLocation}
              onChange={(e) => setSampleLocation(e.target.value)}
              placeholder="e.g. FairPrice Supermarket, Connaught Place, New Delhi"
              className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Primary Action Button: Proceed to Process */}
      <div className="pt-1">
        <button
          onClick={handleStartScan}
          className="w-full py-2.5 px-6 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <Camera className="w-4 h-4" />
          <span>Scan & Process Package (PCR 2011 Rules)</span>
        </button>
      </div>
    </div>
  );
};
