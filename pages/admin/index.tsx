import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaLock, FaEye, FaSync, FaHome, FaCheckCircle, FaTimesCircle, FaClock, FaImage, FaMobileAlt, FaMapMarkerAlt, FaChartLine } from 'react-icons/fa';

interface SurpriseEvent {
  id: number;
  qr_token: string;
  opened_at: string | null;
  image_url: string | null;
  device_info: string | null;
  ip_address: string | null;
  password_verified: number;
  password_attempts: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState<SurpriseEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        fetchEvents();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
      // Refresh every 30 seconds
      const interval = setInterval(fetchEvents, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-romantic flex items-center justify-center p-4">
        <Head>
          <title>Admin Login</title>
        </Head>
        <div className="card max-w-md w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaLock className="text-white text-3xl" />
            </div>
            <h1 className="heading-xl text-neutral-900 mb-2">Admin Dashboard</h1>
            <p className="text-neutral-600">Secure access required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
                <FaLock className="text-neutral-500" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                placeholder=""
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FaTimesCircle className="text-red-600 text-lg flex-shrink-0" />
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <FaLock />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 space-y-4">
            <Link href="/" className="flex items-center justify-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              <FaHome className="text-xs" />
              <span>Back to Home</span>
            </Link>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-900 font-medium mb-1">
                Default Password: <code className="bg-amber-100 px-2 py-0.5 rounded">UzmaLove2024!</code>
              </p>
              <p className="text-xs text-amber-700">
                Change this in production for security
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Head>
        <title>Admin Dashboard - Surprise Events</title>
      </Head>

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="heading-xl text-neutral-900 mb-1">Admin Dashboard</h1>
              <p className="text-neutral-600 text-sm">Monitor surprise events and captured moments</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchEvents}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium"
              >
                <FaSync className="text-xs" />
                <span>Refresh</span>
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                <FaHome className="text-xs" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="text-neutral-600" />
            <h2 className="heading-md text-neutral-900">Statistics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Total Tokens</p>
                  <p className="text-3xl font-bold text-blue-900">{events.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                  <FaLock className="text-blue-700 text-xl" />
                </div>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium mb-1">Opened</p>
                  <p className="text-3xl font-bold text-emerald-900">
                    {events.filter(e => e.opened_at).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
                  <FaEye className="text-emerald-700 text-xl" />
                </div>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-violet-600 font-medium mb-1">Verified</p>
                  <p className="text-3xl font-bold text-violet-900">
                    {events.filter(e => e.password_verified).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-violet-200 rounded-xl flex items-center justify-center">
                  <FaCheckCircle className="text-violet-700 text-xl" />
                </div>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rose-600 font-medium mb-1">Captured</p>
                  <p className="text-3xl font-bold text-rose-900">
                    {events.filter(e => e.image_url).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-rose-200 rounded-xl flex items-center justify-center">
                  <FaImage className="text-rose-700 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FaClock className="text-neutral-600" />
            <h2 className="heading-md text-neutral-900">Recent Events</h2>
          </div>

          {events.length === 0 ? (
            <div className="card text-center py-16">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaImage className="text-neutral-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Events Yet</h3>
              <p className="text-neutral-600 mb-6">Generate a token to get started!</p>
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                <FaHome />
                <span>Go to Home</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="card-hover">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Event Details */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaLock className="text-neutral-400" />
                          <h3 className="font-semibold text-neutral-900">
                            Token: <code className="text-sm bg-neutral-100 px-2 py-1 rounded">{event.qr_token.substring(0, 8)}...</code>
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            event.password_verified 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {event.password_verified ? <FaCheckCircle /> : <FaTimesCircle />}
                            {event.password_verified ? 'Verified' : 'Not Verified'}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            event.opened_at 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {event.opened_at ? <FaEye /> : <FaClock />}
                            {event.opened_at ? 'Opened' : 'Not Opened'}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            event.image_url 
                              ? 'bg-rose-100 text-rose-700' 
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            <FaImage />
                            {event.image_url ? 'Captured' : 'No Image'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <FaClock className="text-neutral-400 mt-1 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="text-neutral-500 mb-0.5">Created</p>
                            <p className="font-medium text-neutral-900">
                              {new Date(event.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {event.opened_at && (
                          <div className="flex items-start gap-2">
                            <FaEye className="text-neutral-400 mt-1 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-neutral-500 mb-0.5">Opened</p>
                              <p className="font-medium text-neutral-900">
                                {new Date(event.opened_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <FaLock className="text-neutral-400 mt-1 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="text-neutral-500 mb-0.5">Password Attempts</p>
                            <p className="font-medium text-neutral-900">{event.password_attempts}</p>
                          </div>
                        </div>
                        {event.ip_address && (
                          <div className="flex items-start gap-2">
                            <FaMapMarkerAlt className="text-neutral-400 mt-1 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-neutral-500 mb-0.5">IP Address</p>
                              <p className="font-medium text-neutral-900">{event.ip_address}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {event.device_info && (
                        <div className="flex items-start gap-2 bg-neutral-50 rounded-lg p-3">
                          <FaMobileAlt className="text-neutral-400 mt-1 flex-shrink-0" />
                          <div className="text-sm flex-1">
                            <p className="text-neutral-500 mb-0.5">Device Information</p>
                            <p className="font-mono text-xs text-neutral-700 break-all">
                              {event.device_info}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image Preview */}
                    <div className="flex items-center justify-center">
                      {event.image_url ? (
                        <div className="text-center">
                          <div className="relative group">
                            <img
                              src={event.image_url}
                              alt="Captured moment"
                              className="w-48 h-48 object-cover rounded-2xl shadow-elegant cursor-pointer transition-all group-hover:shadow-elegant-lg group-hover:scale-105"
                              onClick={() => setSelectedImage(event.image_url)}
                              onError={(e) => {
                                console.error('Image failed to load:', event.image_url);
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23f3f4f6" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="14">Image Not Found</text></svg>';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all flex items-center justify-center">
                              <FaEye className="text-white opacity-0 group-hover:opacity-100 text-2xl transition-opacity" />
                            </div>
                          </div>
                          <p className="text-xs text-neutral-500 mt-2">Click to enlarge</p>
                        </div>
                      ) : (
                        <div className="w-48 h-48 bg-neutral-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-300">
                          <div className="text-center">
                            <FaImage className="text-neutral-400 text-4xl mx-auto mb-2" />
                            <p className="text-sm text-neutral-500">No image yet</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-screen">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-screen rounded-2xl shadow-2xl"
              onError={(e) => {
                console.error('Modal image failed to load:', selectedImage);
              }}
            />
            <button
              className="absolute -top-4 -right-4 bg-white text-neutral-900 rounded-full w-12 h-12 flex items-center justify-center hover:bg-neutral-100 transition-colors shadow-lg"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimesCircle className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
