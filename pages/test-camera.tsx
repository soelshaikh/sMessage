import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function TestCamera() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [imageData, setImageData] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setStatus('requesting');
    setError('');
    
    try {
      console.log('Requesting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      console.log('Camera granted');
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video loaded:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          setStatus('ready');
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access denied or not available');
      setStatus('error');
    }
  };

  const captureImage = () => {
    if (!videoRef.current) {
      setError('Video not ready');
      return;
    }

    const video = videoRef.current;
    console.log('Capturing from video:', video.videoWidth, 'x', video.videoHeight);

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Video dimensions are 0 - video not ready');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const data = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Image captured, size:', data.length);
      setImageData(data);
      setStatus('captured');
      
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Head>
        <title>Camera Test</title>
      </Head>
      
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Camera Capture Test</h1>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6">
            <p className="mb-4">Status: <strong>{status}</strong></p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="space-x-4 mb-4">
              <button
                onClick={startCamera}
                disabled={status === 'ready' || status === 'requesting'}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Start Camera
              </button>
              
              <button
                onClick={captureImage}
                disabled={status !== 'ready'}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                Capture Image
              </button>
            </div>

            {(status === 'requesting' || status === 'ready') && (
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full transform scale-x-[-1]"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}

            {imageData && (
              <div>
                <h3 className="font-bold mb-2">Captured Image:</h3>
                <img src={imageData} alt="Captured" className="w-full rounded-lg" />
                <p className="text-sm text-gray-600 mt-2">
                  Image size: {(imageData.length / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="font-bold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Click "Start Camera" and allow camera permission</li>
              <li>Wait for video preview to appear</li>
              <li>Click "Capture Image" to test capture</li>
              <li>Check browser console (F12) for debug logs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
