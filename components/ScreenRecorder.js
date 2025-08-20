'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import RecordRTC from 'recordrtc';

const ScreenRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const recorderRef = useRef(null);
    const timerRef = useRef(null);

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

    // Format time display
    const formatTime = seconds => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Simple direct canvas recording (like your old working version)
    const startRecording = useCallback(() => {
        // Get the div with id="viewer1" from the DOM
        const viewerDiv = document.getElementById('viewer1');

        if (viewerDiv) {
            // Find the canvas inside the viewerDiv
            const canvas = viewerDiv.querySelector('canvas');

            if (canvas) {
                console.log('Canvas found:', canvas.width + 'x' + canvas.height);

                try {
                    // Capture the canvas stream at 60 FPS in Full HD with optimal settings
                    const stream = canvas.captureStream(60); // 60 FPS for ultra-smooth recording

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
                            frameRate: 60, // 60 FPS for buttery-smooth playback
                        },
                        // Additional quality settings
                        timeSlice: 100, // Capture data every 100ms for smoother recording
                        checkForInactiveTracks: true,
                        bufferSize: 16384, // Larger buffer for better quality
                    });
                } catch (streamError) {
                    console.error('Error creating canvas stream:', streamError);
                    alert('Failed to create recording stream. Please try again.');
                    return;
                }
                recorderRef.current.startRecording();
                setIsRecording(true);
                setRecordingTime(0);
                console.log('Recording started successfully');
            } else {
                console.error('No canvas found inside viewer1');
                alert('Cannot find canvas. Please wait for the 3D scene to load completely.');
            }
        } else {
            console.error('Div with id "viewer1" not found');
            alert('Cannot find viewer1 element.');
        }
    }, []);

    // Stop recording and auto-download
    const stopRecording = useCallback(() => {
        if (!recorderRef.current) return;

        setIsProcessing(true);

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
            link.click();

            // Clean up
            URL.revokeObjectURL(videoUrl);
            setIsRecording(false);
            setIsProcessing(false);

            console.log('Recording processed and downloaded successfully');
        });
    }, []);

    return (
        <div className="screen-recorder">
            <button
                className={`record-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
            >
                <div className="record-icon">{isRecording ? <div className="stop-icon"></div> : <div className="play-icon"></div>}</div>
                <span className="btn-text">{isProcessing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </button>

            {(isRecording || isProcessing) && (
                <div className="recording-status">
                    <div className="recording-indicator">
                        <div className="pulse-dot"></div>
                        <span className="status-text">{isProcessing ? 'Processing...' : `REC ${formatTime(recordingTime)}`}</span>
                    </div>
                </div>
            )}

            <style jsx>{`
                .screen-recorder {
                    position: fixed;
                    top: 13.5%;
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

                .record-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
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
        </div>
    );
};

export default ScreenRecorder;
