'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import RecordRTC from 'recordrtc';

const ScreenRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const recorderRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);
    const offscreenCanvasRef = useRef(null);

    // Timer for recording duration
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
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
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Create vertical cropped canvas for Instagram Stories (9:16 aspect ratio)
    const createVerticalCanvas = (sourceCanvas) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Instagram Stories aspect ratio: 9:16 (1080x1920)
        const targetWidth = 1080;
        const targetHeight = 1920;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Calculate source dimensions for center crop
        const sourceWidth = sourceCanvas.width;
        const sourceHeight = sourceCanvas.height;
        const sourceAspectRatio = sourceWidth / sourceHeight;
        const targetAspectRatio = targetWidth / targetHeight;
        
        let cropWidth, cropHeight, cropX, cropY;
        
        if (sourceAspectRatio > targetAspectRatio) {
            // Source is wider, crop from sides
            cropHeight = sourceHeight;
            cropWidth = sourceHeight * targetAspectRatio;
            cropX = (sourceWidth - cropWidth) / 2;
            cropY = 0;
        } else {
            // Source is taller, crop from top/bottom
            cropWidth = sourceWidth;
            cropHeight = sourceWidth / targetAspectRatio;
            cropX = 0;
            cropY = (sourceHeight - cropHeight) / 2;
        }
        
        // Draw cropped and scaled image
        ctx.drawImage(
            sourceCanvas,
            cropX, cropY, cropWidth, cropHeight,
            0, 0, targetWidth, targetHeight
        );
        
        return canvas;
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
                
                // Capture the canvas stream at 60 FPS for better quality (exactly like your old version)
                const stream = canvas.captureStream(60); // 60 FPS for smoother video
                recorderRef.current = new RecordRTC(stream, {
                    type: 'video',
                    mimeType: 'video/mp4', // Use mp4 format like your old version
                    video: {
                        quality: 10, // Max quality setting for better video quality
                        frameRate: 60, // High FPS for smoothness
                    },
                    bitrate: 5000, // Higher bitrate for better quality
                });
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

    // Process video to create vertical version
    const processVideoToVertical = (originalBlob) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(originalBlob);
            
            video.onloadedmetadata = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Instagram Stories dimensions
                canvas.width = 1080;
                canvas.height = 1920;
                
                // Calculate crop area for center cropping
                const videoAspectRatio = video.videoWidth / video.videoHeight;
                const targetAspectRatio = 1080 / 1920; // 9:16
                
                let sourceX = 0, sourceY = 0, sourceW = video.videoWidth, sourceH = video.videoHeight;
                
                if (videoAspectRatio > targetAspectRatio) {
                    // Video is wider, crop sides
                    sourceW = video.videoHeight * targetAspectRatio;
                    sourceX = (video.videoWidth - sourceW) / 2;
                } else {
                    // Video is taller, crop top/bottom  
                    sourceH = video.videoWidth / targetAspectRatio;
                    sourceY = (video.videoHeight - sourceH) / 2;
                }
                
                // Draw the cropped frame
                ctx.drawImage(video, sourceX, sourceY, sourceW, sourceH, 0, 0, canvas.width, canvas.height);
                
                // Create still image blob for now (video processing would require more complex setup)
                canvas.toBlob((processedBlob) => {
                    URL.revokeObjectURL(video.src);
                    // For now, return original blob until we implement full video processing
                    resolve(originalBlob);
                }, 'image/png');
            };
        });
    };

    // Stop recording and process (simplified like your old version)
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
            
            setRecordedBlob(blob);
            const videoUrl = window.URL.createObjectURL(blob); // Create object URL
            setVideoUrl(videoUrl);
            setIsRecording(false);
            setIsProcessing(false);
            
            console.log('Recording processed successfully');
        });
    }, []);

    // Download recording
    const downloadRecording = useCallback(() => {
        if (!videoUrl) return;
        
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `recording-${Date.now()}.mp4`;
        link.click();
    }, [videoUrl]);

    // Clear recording
    const clearRecording = useCallback(() => {
        if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
        }
        setRecordedBlob(null);
        setVideoUrl('');
        setRecordingTime(0);
    }, [videoUrl]);

    return (
        <div className="screen-recorder">
            <div className="recorder-controls">
                <div className="control-group">
                    <button 
                        className={`record-btn ${isRecording ? 'recording' : ''}`}
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing}
                    >
                        <div className="record-icon">
                            {isRecording ? (
                                <div className="stop-icon"></div>
                            ) : (
                                <div className="play-icon"></div>
                            )}
                        </div>
                        <span className="btn-text">
                            {isProcessing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
                        </span>
                    </button>
                    
                    {(isRecording || isProcessing) && (
                        <div className="recording-status">
                            <div className="recording-indicator">
                                <div className="pulse-dot"></div>
                                <span className="status-text">
                                    {isProcessing ? 'Processing...' : `REC ${formatTime(recordingTime)}`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {recordedBlob && !isRecording && (
                    <div className="recording-result">
                        <div className="video-preview">
                            <video 
                                src={videoUrl} 
                                controls 
                                className="preview-video"
                                poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4MCIgaGVpZ2h0PSIxOTIwIiB2aWV3Qm94PSIwIDAgMTA4MCAx%0D%0AOTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9z%0D%0AdmciPjxyZWN0IHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjE5MjAiIGZpbGw9IiMxYTE%0D%0AMWE%2BPC9yZWN0Pjx0ZXh0IHg9IjU0MCIgeT0iOTYwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ4Ij5WZXJ0aWNhbCBWaWRlbzwvdGV4dD48L3N2Zz4%3D"
                            />
                            <div className="video-info">
                                <span className="aspect-ratio-tag">Full Resolution Recording</span>
                                <span className="duration-tag">Duration: {formatTime(recordingTime)}</span>
                            </div>
                        </div>
                        
                        <div className="action-buttons">
                            <button className="download-btn" onClick={downloadRecording}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/>
                                </svg>
                                Download Recording
                            </button>
                            
                            <button className="clear-btn" onClick={clearRecording}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .screen-recorder {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .recorder-controls {
                    background: rgba(0, 0, 0, 0.9);
                    border-radius: 16px;
                    padding: 16px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    min-width: 280px;
                }

                .control-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    align-items: center;
                }

                .record-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: linear-gradient(135deg, #ff6b6b, #ff5722);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    min-width: 160px;
                    justify-content: center;
                }

                .record-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
                }

                .record-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .record-btn.recording {
                    background: linear-gradient(135deg, #f44336, #d32f2f);
                    animation: pulse-record 2s infinite;
                }

                @keyframes pulse-record {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
                    50% { box-shadow: 0 0 0 8px rgba(244, 67, 54, 0); }
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
                    border-left: 12px solid white;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    margin-left: 2px;
                }

                .stop-icon {
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 2px;
                }

                .recording-status {
                    background: rgba(244, 67, 54, 0.15);
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 1px solid rgba(244, 67, 54, 0.3);
                }

                .recording-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: #f44336;
                    border-radius: 50%;
                    animation: pulse-dot 1s infinite;
                }

                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }

                .status-text {
                    color: #f44336;
                    font-size: 12px;
                    font-weight: 600;
                }

                .recording-result {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .video-preview {
                    position: relative;
                    margin-bottom: 16px;
                }

                .preview-video {
                    width: 200px;
                    height: 120px;
                    border-radius: 12px;
                    background: #000;
                    object-fit: cover;
                }

                .video-info {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    right: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .aspect-ratio-tag,
                .duration-tag {
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 10px;
                    font-weight: 500;
                    width: fit-content;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                    flex-direction: column;
                }

                .download-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #4caf50, #388e3c);
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    justify-content: center;
                }

                .download-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                }

                .clear-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s ease;
                    justify-content: center;
                }

                .clear-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                }

                @media (max-width: 480px) {
                    .screen-recorder {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        position: fixed;
                    }
                    
                    .recorder-controls {
                        min-width: auto;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default ScreenRecorder;
