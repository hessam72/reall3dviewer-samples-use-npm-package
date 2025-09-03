'use client';
import React, { useState, useRef, useCallback, useEffect, useImperativeHandle } from 'react';
import RecordRTC from 'recordrtc';
import CryptoJS from 'crypto-js';
import SharePopup from './sharePopup';

const ScreenRecorder = React.forwardRef(({ onStartRecording, isAnimating, stopRecordingVal }, ref) => {
    console.log('ScreenRecorder component rendered, ref:', !!ref);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const recorderRef = useRef(null);
    const timerRef = useRef(null);
    const [isAllowed, setIsAllowed] = useState(false);

    // Check URL parameter on component mount
    useEffect(() => {
        // const checkRecordingPermission = () => {
        //     const params = new URLSearchParams(window.location.search);
        //     const encryptedParam = params.get('rcd');

        //     // Replace the existing try-catch block in the checkRecordingPermission function
        //     if (encryptedParam) {
        //         try {
        //             const secretKey = 'the-car-panel-scrt-key';

        //             // Log the raw encrypted param
        //             console.log('Raw encrypted param:', encryptedParam);

        //             // Decode URI component first
        //             const decodedParam = decodeURIComponent(encryptedParam);
        //             console.log('Decoded param:', decodedParam);

        //             // Try decryption
        //             const decryptedBytes = CryptoJS.AES.decrypt(decodedParam, secretKey);
        //             console.log('Decrypted bytes:', decryptedBytes);

        //             // Convert to string carefully
        //             const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
        //             console.log('Final decrypted string:', decrypted);

        //             if (!decrypted) {
        //                 console.error('Decryption resulted in empty string');
        //                 console.log('Decryption details:', {
        //                     inputLength: encryptedParam.length,
        //                     decodedLength: decodedParam.length,
        //                     bytesLength: decryptedBytes.words ? decryptedBytes.words.length : 0,
        //                 });
        //                 setIsAllowed(false);
        //                 return;
        //             }
        //         } catch (decryptError) {
        //             console.error('Decryption error:', decryptError);
        //         }
        //     }
        //     setIsAllowed(false);
        // };

        const checkRecordingPermission = () => {
            const params = new URLSearchParams(window.location.search);
            const encryptedParam = params.get('rcd');

            if (!encryptedParam) {
                setIsAllowed(false);
                return;
            }

            try {
                const secretKey = 'the-car-panel-scrt-key';

                // URLSearchParams already percent-decodes; but if '+' turned into ' ' earlier,
                // convert spaces back to '+' so base64 is correct.
                const safeParam = encryptedParam.replace(/ /g, '+');

                const decryptedBytes = CryptoJS.AES.decrypt(safeParam, secretKey);
                const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);

                if (!decrypted) {
                    console.error('Decryption produced an empty string');
                    setIsAllowed(false);
                    return;
                }

                // parse JSON to read carId
                const payload = JSON.parse(decrypted);
                console.log('Decrypted payload:', payload); // { carId, timestamp, userId }

                // example validation: expiry check (optional)
                const ageMs = Date.now() - payload.timestamp;
                const maxAgeMs = 1000 * 60 * 5; // 5 minutes
                if (ageMs > maxAgeMs) {
                    console.warn('Token expired');
                    setIsAllowed(false);
                    return;
                }

                // now you can read payload.carId
                console.log('carId:', payload.carId);
                setIsAllowed(true);
            } catch (err) {
                console.error('Decryption/parse error:', err);
                setIsAllowed(false);
            }
        };
        checkRecordingPermission();
    }, []);

    // Timer for recording duration
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            if (!isProcessing) {
                setRecordingTime(0);
            }
        }
        return () => clearInterval(timerRef.current);
    }, [isRecording, isProcessing]);

    useEffect(() => {
        stopRecording();
    }, [stopRecordingVal]);

    // Format time display
    const formatTime = seconds => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Canvas recording with HTML overlay injection directly into video stream
    const startRecording = useCallback(() => {
        // Get the div with id="viewer1" from the DOM
        const viewerDiv = document.getElementById('viewer1');

        if (viewerDiv) {
            // Find the canvas inside the viewerDiv
            const originalCanvas = viewerDiv.querySelector('canvas');

            if (originalCanvas) {
                console.log('Canvas found:', originalCanvas.width + 'x' + originalCanvas.height);

                try {
                    // Create composite canvas that includes HTML overlays
                    const compositeCanvas = document.createElement('canvas');
                    compositeCanvas.width = originalCanvas.width || 1920;
                    compositeCanvas.height = originalCanvas.height || 1080;
                    const compositeCtx = compositeCanvas.getContext('2d');

                    // Load logo image
                    const logoImg = new Image();
                    logoImg.crossOrigin = 'anonymous';

                    let isRecordingActive = true;

                    const startRecordingWithOverlay = () => {
                        // Animation loop to composite canvas + HTML overlays
                        const drawCompositeFrame = () => {
                            if (!isRecordingActive) return;

                            // Clear composite canvas
                            compositeCtx.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height);

                            // Draw original 3D canvas content
                            try {
                                compositeCtx.drawImage(originalCanvas, 0, 0, compositeCanvas.width, compositeCanvas.height);
                            } catch (e) {
                                // Fallback: black background if canvas can't be drawn
                                compositeCtx.fillStyle = '#000000';
                                compositeCtx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);
                            }

                            // Draw logo overlay (bottom-left)
                            if (logoImg.complete && logoImg.naturalWidth > 0) {
                                const logoHeight = Math.min(compositeCanvas.width, compositeCanvas.height) * 0.18;
                                const logoWidth = logoHeight * 3.5; // Proper aspect ratio
                                const logoX = 30;
                                const logoY = compositeCanvas.height - logoHeight - 30;

                                compositeCtx.globalAlpha = 0.8;
                                compositeCtx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
                                compositeCtx.globalAlpha = 1.0;
                            }

                            // Draw text info panel
                            // compositeCtx.font = 'bold 16px Arial, sans-serif';
                            // compositeCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                            // const textX = 30;
                            // const textY = compositeCanvas.height - 120;
                            // const textWidth = 180;
                            // const textHeight = 40;

                            // // Background rectangle
                            // compositeCtx.fillRect(textX, textY, textWidth, textHeight);

                            // // Text
                            // compositeCtx.fillStyle = 'white';
                            // compositeCtx.fillText('Model Info Panel', textX + 10, textY + 25);

                            requestAnimationFrame(drawCompositeFrame);
                        };

                        // Start composite drawing
                        drawCompositeFrame();

                        // Capture composite canvas stream
                        const stream = compositeCanvas.captureStream(120);

                        return stream;
                    };

                    // Create cleanup function that will be attached after RecordRTC is created
                    const stopCompositeFunction = () => {
                        isRecordingActive = false;
                    };

                    // Load logo and start recording
                    logoImg.onload = () => {
                        console.log('Logo loaded, starting composite recording');
                        const stream = startRecordingWithOverlay();

                        // Continue with RecordRTC setup...
                        setupRecordRTC(stream);
                    };

                    logoImg.onerror = () => {
                        console.warn('Logo failed to load, starting without logo');
                        const stream = startRecordingWithOverlay();
                        setupRecordRTC(stream);
                    };

                    logoImg.src = '/OmidCity.svg';

                    // RecordRTC setup function
                    const setupRecordRTC = stream => {
                        // Check if VP9 codec is supported, fallback to VP8 if not
                        const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=vp9')
                            ? 'video/mp4;codecs=vp9'
                            : MediaRecorder.isTypeSupported('video/mp4;codecs=vp8')
                            ? 'video/mp4;codecs=vp8'
                            : 'video/mp4';

                        console.log('Using MIME type:', mimeType);

                        recorderRef.current = new RecordRTC(stream, {
                            type: 'video',
                            mimeType: mimeType,
                            videoBitsPerSecond: 20000000, // 20 Mbps for exceptional Full HD quality
                            video: {
                                width: 1920, // Full HD width
                                height: 1080, // Full HD height
                                frameRate: 120, // 120 FPS for buttery-smooth playback
                            },
                            // Additional quality settings
                            timeSlice: 100, // Capture data every 100ms for smoother recording
                            checkForInactiveTracks: true,
                            bufferSize: 16384, // Larger buffer for better quality
                        });

                        recorderRef.current.startRecording();
                        setIsRecording(true);
                        setRecordingTime(0);
                        console.log('Recording started successfully with HTML overlays');

                        // Attach cleanup function after RecordRTC is created
                        recorderRef.current._stopComposite = stopCompositeFunction;

                        // Trigger animation when recording starts
                        if (onStartRecording) {
                            onStartRecording();
                        }
                    };
                } catch (streamError) {
                    console.error('Error creating composite canvas stream:', streamError);
                    alert('Failed to create recording stream. Please try again.');
                    return;
                }
            } else {
                console.error('No canvas found inside viewer1');
                alert('Cannot find canvas. Please wait for the 3D scene to load completely.');
            }
        } else {
            console.error('Div with id "viewer1" not found');
            alert('Cannot find viewer1 element.');
        }
    }, [onStartRecording]);

    // Stop recording and auto-download
    const stopRecording = useCallback(() => {
        console.log('STOP RECORDING FUNCTION CALLED =========================');
        console.log('recorderRef.current exists:', !!recorderRef.current);
        console.log('isRecording state:', isRecording);

        if (!recorderRef.current) {
            console.log('No recorder ref, returning early');
            return;
        }
        console.log('Proceeding with stop recording...');
        setIsProcessing(true);

        // Stop composite canvas animation loop
        if (recorderRef.current._stopComposite) {
            recorderRef.current._stopComposite();
        }

        recorderRef.current.stopRecording(() => {
            const blob = recorderRef.current.getBlob();
            console.log('Recording completed. Blob size:', blob.size, 'bytes');

            if (blob.size === 0) {
                console.error('Recording blob is empty!');
                alert('Recording failed: Video is empty.');
                setIsProcessing(false);
                setIsRecording(false);
                return;
            }

            // Auto-download the recording
            const link = document.createElement('a');
            const videoUrl = window.URL.createObjectURL(blob);
            link.href = videoUrl;
            link.download = `fullhd-60fps-${Date.now()}.mp4`;
            // link.click();

            // Clean up
            // URL.revokeObjectURL(videoUrl);

            setRecordedVideoUrl(videoUrl); // Save the video URL
            setShowSharePopup(true); // Show the sharing popup
            setIsRecording(false);
            setIsProcessing(false);

            console.log('Recording processed and downloaded successfully');
        });
    }, []);
    // Add this before the return statement
    const handleCloseSharePopup = () => {
        setShowSharePopup(false);
        // Cleanup
        if (recordedVideoUrl) {
            URL.revokeObjectURL(recordedVideoUrl);
        }
    };
    const downloadRecording = () => {
        if (recordedVideoUrl) {
            const link = document.createElement('a');
            link.href = recordedVideoUrl;
            link.download = `fullhd-60fps-${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Expose methods via ref
    useImperativeHandle(
        ref,
        () => {
            console.log('useImperativeHandle called, setting up ref methods');
            return {
                stopRecording: () => {
                    console.log('stopRecording called via ref!');
                    stopRecording();
                },
            };
        },
        [stopRecording],
    );

    // Handle recording start/stop - only allow start if not animating
    const handleRecordingToggle = () => {
        if (isRecording) {
            stopRecording();
        } else if (!isAnimating) {
            startRecording();
        }
    };

    return (
        <>
            {/* {isAllowed && ( */}
            <>
                <div className="screen-recorder">
                    <button
                        className={`record-btn ${isRecording ? 'recording' : ''} ${isAnimating && !isRecording ? 'disabled' : ''}`}
                        onClick={handleRecordingToggle}
                        disabled={isProcessing || (isAnimating && !isRecording)}
                    >
                        <div className="record-icon">{isRecording ? <div className="stop-icon"></div> : <div className="play-icon"></div>}</div>
                        <span className="btn-text">
                            {isProcessing ? 'در حال پردازش...' : isRecording ? 'متوقف کردن ضبط' : isAnimating ? 'در حال انیمیشن...' : 'شروع ضبط'}
                        </span>
                    </button>

                    {(isRecording || isProcessing) && (
                        <div className="recording-status">
                            <div className="recording-indicator">
                                <div className="pulse-dot"></div>
                                <span className="status-text">{isProcessing ? 'در حال پردازش...' : `REC ${formatTime(recordingTime)}`}</span>
                            </div>
                        </div>
                    )}
                </div>
                <SharePopup
                    isOpen={showSharePopup}
                    onClose={handleCloseSharePopup}
                    videoUrl={recordedVideoUrl}
                    onDownload={downloadRecording} // Your existing download function
                />
            </>
            {/* )} */}
            <style jsx>{`
                .screen-recorder {
                    position: fixed;
                    top: 6.5%;
                    right: 20px;
                    transform: translateY(-50%);
                    z-index: 1000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', Roboto, sans-serif;
                    font-weight: 400;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 12px;
                    max-width: 200px;
                    width: auto;
                }

                .record-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.12);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    color: rgba(255, 255, 255, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 12px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    font-family: inherit;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    width: fit-content;
                    white-space: nowrap;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3);
                }

                .record-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }

                .record-btn:hover::before {
                    opacity: 1;
                }

                .record-btn:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .record-btn:active {
                    transform: translateY(0) scale(0.98);
                    transition: all 0.1s ease;
                }

                .record-btn:disabled,
                .record-btn.disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .record-btn.disabled {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.15);
                    color: rgba(255, 255, 255, 0.6);
                }

                .record-btn.recording {
                    background: rgba(255, 59, 48, 0.15);
                    border-color: rgba(255, 59, 48, 0.3);
                    color: rgba(255, 59, 48, 1);
                    animation: pulse-record 2s infinite;
                    box-shadow: 0 4px 16px rgba(255, 59, 48, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                }

                .record-btn.recording::before {
                    background: linear-gradient(135deg, rgba(255, 59, 48, 0.1) 0%, rgba(255, 59, 48, 0.05) 100%);
                }

                @keyframes pulse-record {
                    0%,
                    100% {
                        box-shadow: 0 4px 16px rgba(255, 59, 48, 0.2), 0 0 0 0 rgba(255, 59, 48, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    }
                    50% {
                        box-shadow: 0 4px 16px rgba(255, 59, 48, 0.2), 0 0 0 8px rgba(255, 59, 48, 0), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    }
                }

                .record-icon {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .play-icon {
                    width: 0;
                    height: 0;
                    border-left: 12px solid currentColor;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    margin-left: 2px;
                }

                .stop-icon {
                    width: 12px;
                    height: 12px;
                    background: currentColor;
                    border-radius: 3px;
                }

                .recording-status {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    padding: 8px 12px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    width: fit-content;
                }

                .recording-indicator {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pulse-dot {
                    width: 10px;
                    height: 10px;
                    background: linear-gradient(135deg, #ff3b30, #ff6347);
                    border-radius: 50%;
                    animation: pulse-dot 1.5s infinite ease-in-out;
                    box-shadow: 0 0 8px rgba(255, 59, 48, 0.3);
                }

                @keyframes pulse-dot {
                    0%,
                    100% {
                        opacity: 1;
                        transform: scale(1);
                        box-shadow: 0 0 8px rgba(255, 59, 48, 0.3);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(0.85);
                        box-shadow: 0 0 12px rgba(255, 59, 48, 0.6);
                    }
                }

                .status-text {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 11px;
                    font-weight: 500;
                    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
                    letter-spacing: 0.5px;
                }

                @media (max-width: 768px) {
                    .screen-recorder {
                        right: 1.5rem;
                        max-width: 160px;
                    }

                    .record-btn {
                        padding: 10px 12px;
                        font-size: 12px;
                        gap: 6px;
                    }

                    .recording-status {
                        padding: 6px 10px;
                    }

                    .status-text {
                        font-size: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .screen-recorder {
                        right: 1.5rem;
                        max-width: 140px;
                    }

                    .record-btn {
                        padding: 8px 10px;
                        font-size: 11px;
                        border-radius: 16px;
                    }

                    .btn-text {
                        display: none;
                    }

                    .record-btn .record-icon {
                        margin: 0;
                    }

                    .recording-status {
                        padding: 5px 8px;
                    }

                    .status-text {
                        font-size: 9px;
                    }

                    .pulse-dot {
                        width: 6px;
                        height: 6px;
                    }
                }
            `}</style>
        </>
    );
});

export default ScreenRecorder;
