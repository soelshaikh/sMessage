import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaGift, FaHeart, FaArrowRight, FaLock } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const openSurpriseLink = async () => {
    setLoading(true);
    try {
      // Generate a new token
      const res = await fetch('/api/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      
      // Auto-redirect to the surprise page with the new token
      router.push(`/surprise/${data.token}`);
    } catch (err) {
      console.error('Failed to generate token:', err);
      alert('Failed to create message link. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-romantic">
      <Head>
        <title>Birthday Message - A Special Letter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-violet-600 rounded-xl flex items-center justify-center">
              <FaGift className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-xl text-neutral-900">Birthday Message</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-violet-600 rounded-2xl mb-6 animate-float">
            <FaHeart className="text-white text-3xl" />
          </div>
          <h1 className="heading-display gradient-text mb-4">
            Open Your Message
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Click the button below to read your special birthday message.
          </p>
        </div>

        {/* Main Card */}
        <div className="card max-w-3xl mx-auto mb-12 animate-scale-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <FaGift className="text-rose-600 text-xl" />
            </div>
            <div>
              <h2 className="heading-md text-neutral-900">Open Message Link</h2>
              <p className="text-sm text-neutral-500">Click below to read your heartfelt message</p>
            </div>
          </div>
          
          <button
            onClick={openSurpriseLink}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating your message...</span>
              </>
            ) : (
              <>
                <FaGift className="text-xl" />
                <span>Open Message Link</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-20 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-neutral-500">
          <p>Made with love for Uzma&apos;s Birthday</p>
        </div>
      </footer>
    </div>
  );
}
