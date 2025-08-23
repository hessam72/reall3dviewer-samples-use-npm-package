import React, { useState } from 'react';

interface SharePopupProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
    onDownload: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ isOpen, onClose, videoUrl, onDownload }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen) return null;

    const handleInstagramShare = async () => {
        setIsDownloading(true);

        try {
            // First download the video
            await onDownload();

            // Then try to open Instagram
            // Use Instagram's web share URL as fallback
            const webShareUrl = 'https://instagram.com/share';

            // Check if on mobile
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                // Try to open Instagram app first
                setTimeout(() => {
                    window.location.href = 'instagram://story-camera';

                    // Fallback to web after a short delay if app doesn't open
                    setTimeout(() => {
                        window.location.href = webShareUrl;
                    }, 2000);
                }, 100);
            } else {
                // On desktop, just open Instagram website
                window.open(webShareUrl, '_blank');
            }
        } catch (error) {
            console.error('Error during sharing:', error);
            alert('Failed to prepare video for sharing. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>اشتراک‌گذاری ضبط شما</h2>
                <p>ویدیوی شما آماده است! آیا می‌خواهید آن را به اشتراک بگذارید؟</p>

                {videoUrl && (
                    <video
                        src={videoUrl}
                        controls
                        playsInline
                        className="preview-video"
                        style={{
                            marginBottom: '1rem',
                            borderRadius: '8px',
                            width: '100%',
                            maxHeight: '300px',
                            objectFit: 'contain'
                        }}
                    />
                )}

                <div className="buttons">
                    <button
                        onClick={handleInstagramShare}
                        className="share-button instagram"
                        disabled={isDownloading}
                    >
                        <svg className="instagram-icon" viewBox="0 0 24 24">
                            {/* ...existing SVG path... */}
                        </svg>
                        {isDownloading ? 'در حال آماده‌سازی...' : 'اشتراک در اینستاگرام'}
                    </button>
                    <button onClick={onDownload} className="download-button">
                        دانلود ویدیو
                    </button>
                    <button onClick={onClose} className="close-button">
                        بستن
                    </button>
                </div>
            </div>

            <style jsx>{`
               .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.75);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }

                .popup-content {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 2rem;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                }

                h2 {
                    color: #333;
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }

                p {
                    color: #666;
                    margin-bottom: 1.5rem;
                }

                .buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .share-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .instagram {
                    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                    color: white;
                }

                .instagram:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .instagram-icon {
                    width: 24px;
                    height: 24px;
                    fill: currentColor;
                }

                .close-button {
                    padding: 0.8rem 1.5rem;
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    background: transparent;
                    color: #666;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .close-button:hover {
                    background: #f5f5f5;
                }
                
                .preview-video {
                    max-width: 100%;
                    max-height: 300px;
                    margin: 1rem 0;
                }

                .download-button {
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 12px;
                    background: #0070f3;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .download-button:hover {
                    background: #0051d4;
                }

                .share-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default SharePopup;