'use client';
import React, { useState, useRef } from 'react';
import RecordRTC from 'recordrtc';

const ScreenRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const recorderRef = useRef(null);
    const streamRef = useRef(null);

    // Start recording the canvas inside the viewer1 div
    const startRecording = () => {
        // Get the div with id="viewer1" from the DOM
        const viewerDiv = document.getElementById('viewer1');

        if (viewerDiv) {
            // Find the canvas inside the viewerDiv
            const canvas = viewerDiv.querySelector('canvas');

            if (canvas) {
                // Increase canvas resolution (optional, depending on your setup)
                // canvas.width = 1920; // Higher resolution width
                // canvas.height = 1080; // Higher resolution height

                // Capture the canvas stream at 60 FPS for better quality
                const stream = canvas.captureStream(60); // 60 FPS for smoother video
                recorderRef.current = new RecordRTC(stream, {
                    type: 'video',
                    mimeType: 'video/mp4', // Use webm format for compatibility
                    video: {
                        quality: 10, // Max quality setting for better video quality
                        frameRate: 60, // High FPS for smoothness
                    },
                    bitrate: 5000, // Higher bitrate for better quality
                });
                recorderRef.current.startRecording();
                setIsRecording(true);
            } else {
                console.error('No canvas found inside viewer1');
            }
        } else {
            console.error('Div with id "viewer1" not found');
        }
    };

    // Stop recording and process the recorded video
    const stopRecording = () => {
        recorderRef.current.stopRecording(() => {
            const blob = recorderRef.current.getBlob();
            setRecordedBlob(blob);
            const videoUrl = window.URL.createObjectURL(blob); // Create object URL
            setVideoUrl(videoUrl);
            setIsRecording(false);
        });
    };

    // Download the recording
    const downloadRecording = () => {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = 'recording.mp4';
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
