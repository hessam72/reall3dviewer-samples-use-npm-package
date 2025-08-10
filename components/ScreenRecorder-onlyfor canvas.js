// components/ScreenRecorder.js
'use client';
import React, { useRef, useState } from 'react';
import RecordRTC from 'recordrtc';

const ScreenRecorder = () => {
    const canvasRef = useRef(null); // Reference to your Three.js canvas
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const recorderRef = useRef(null);

    const startRecording = () => {
        console.log('start');
        if (canvasRef.current) {
            const stream = canvasRef.current.captureStream(30); // 30 FPS capture
            recorderRef.current = new RecordRTC(stream, {
                type: 'video',
                mimeType: 'video/webm', // Use webm format for mobile compatibility
                canvas: { width: 1080, height: 1920 }, // 1080x1920 for Instagram
            });
            recorderRef.current.startRecording();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        recorderRef.current.stopRecording(() => {
            const blob = recorderRef.current.getBlob();
            setRecordedBlob(blob);
            const videoUrl = window.URL.createObjectURL(blob); // Fix here
            setVideoUrl(videoUrl);
            setIsRecording(false);
        });
    };

    const downloadRecording = () => {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = 'recording.webm'; // You can change the name if needed
        link.click();
    };

    return (
        <div>
            <button onClick={startRecording} disabled={isRecording}>
                Start Recording
            </button>
            <button onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
            </button>

            {recordedBlob && (
                <div>
                    <video src={videoUrl} controls width="320" height="570" style={{ marginTop: '20px' }} />
                    <button onClick={downloadRecording}>Download Video</button>
                </div>
            )}
        </div>
    );
};

export default ScreenRecorder;
