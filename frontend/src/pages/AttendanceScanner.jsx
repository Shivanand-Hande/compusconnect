import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { QrCode, CheckCircle, AlertCircle, Loader2, RotateCcw, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/apiConfig';

const AttendanceScanner = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error
    const [message, setMessage] = useState('');
    const qrCodeInstanceRef = useRef(null);
    const isScanningRef = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const startScanner = async () => {
            if (status !== 'idle' || isScanningRef.current) return;

            try {
                // Ensure the previous instance is stopped if it exists
                if (qrCodeInstanceRef.current) {
                    try {
                        await qrCodeInstanceRef.current.stop();
                    } catch (e) { /* ignore */ }
                    qrCodeInstanceRef.current = null;
                }

                if (!isMounted) return;

                const qrCode = new Html5Qrcode("reader");
                qrCodeInstanceRef.current = qrCode;

                const config = {
                    fps: 10,
                    qrbox: { width: 350, height: 350 },
                };

                await qrCode.start(
                    { facingMode: "environment" },
                    config,
                    onScanSuccess,
                    onScanError
                );

                if (isMounted) {
                    isScanningRef.current = true;
                } else {
                    await qrCode.stop();
                }
            } catch (err) {
                console.error("Scanner start failed:", err);
            }
        };

        async function onScanSuccess(result) {
            if (!isScanningRef.current) return;
            isScanningRef.current = false;

            if (qrCodeInstanceRef.current) {
                try {
                    await qrCodeInstanceRef.current.stop();
                } catch (e) {
                    console.error("Failed to stop scanner", e);
                }
            }

            setStatus('scanning');

            try {
                const { data } = await axios.post(`${API_URL}/api/attendance/scan`,
                    { qrData: result },
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    }
                );
                setStatus('success');
                setMessage(data.message || 'Attendance marked successfully!');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Failed to mark attendance');
            }
        }

        function onScanError(err) {
            // Quietly ignore scan errors
        }

        startScanner();

        return () => {
            isMounted = false;
            if (qrCodeInstanceRef.current && isScanningRef.current) {
                qrCodeInstanceRef.current.stop()
                    .then(() => {
                        isScanningRef.current = false;
                        qrCodeInstanceRef.current = null;
                    })
                    .catch(err => console.error("Scanner cleanup failed", err));
            }
        };
    }, [user, status]);

    const resetScanner = () => {
        setStatus('idle');
        setMessage('');
        isScanningRef.current = false;
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
            <div className="mb-10 section-header animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900/30 rounded-3xl text-primary-600 mb-4 shadow-inner">
                    <Camera size={28} />
                </div>
                <h1 className="text-4xl font-black dark:text-white uppercase tracking-tight">Attendance Scanner</h1>
                <p className="text-gray-500 font-medium mt-1">Institutional Grade QR Verification</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden min-h-[600px] flex flex-col items-center justify-center relative">

                {/* The Video Container - Strictly one instance */}
                <div className={`w-full h-full relative ${status === 'idle' ? 'block' : 'hidden'}`}>
                    <div id="reader" className="w-full h-full min-h-[500px] bg-black"></div>

                    {/* Visual Frame Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                        <div className="w-[380px] h-[380px] border-4 border-white/30 rounded-[2rem] relative shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                                Center QR Code
                            </div>
                            {/* Scanning Line Animation */}
                            <div className="absolute left-0 right-0 h-1 bg-primary-500/50 blur-sm shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-scan-line"></div>
                        </div>
                    </div>
                </div>

                {status === 'scanning' && (
                    <div className="flex flex-col items-center gap-8 animate-pulse text-center p-10">
                        <div className="w-32 h-32 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-primary-600" size={64} />
                        </div>
                        <div>
                            <p className="text-2xl font-black dark:text-white uppercase tracking-widest">Processing...</p>
                            <p className="text-gray-500 mt-2 font-bold uppercase text-xs tracking-widest">Verifying Academic Credentials</p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-500 p-10">
                        <div className="w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
                            <CheckCircle className="text-green-600" size={80} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-green-600 uppercase tracking-tighter">Verified!</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-4 font-bold text-xl px-4 text-center">{message}</p>
                        </div>
                        <button
                            onClick={resetScanner}
                            className="mt-6 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-gray-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest text-sm"
                        >
                            <RotateCcw size={18} /> Next Scan
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-500 p-10">
                        <div className="w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/30">
                            <AlertCircle className="text-red-600" size={80} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-red-600 uppercase tracking-tighter">Access Denied</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-4 font-bold text-xl px-4 text-center">{message}</p>
                        </div>
                        <button
                            onClick={resetScanner}
                            className="mt-6 bg-primary-600 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-primary-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest text-sm"
                        >
                            <RotateCcw size={18} /> Try Again
                        </button>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan-line {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan-line {
                    animation: scan-line 3s linear infinite;
                }
            `}} />

            <div className="mt-12 opacity-30 flex flex-col items-center gap-4">
                <QrCode size={40} className="text-gray-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] dark:text-gray-500">Secure Backend Sync Required</p>
            </div>
        </div>
    );
};

export default AttendanceScanner;
