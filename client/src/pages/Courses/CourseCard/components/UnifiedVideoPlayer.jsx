import React, { useRef, useEffect, useState } from "react";

const UnifiedVideoPlayer = ({ videoUrl, audioUrl, onError, className }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const audio = audioRef.current;

        if (!video || !audio) return;

        const handlePlay = () => {
            audio.currentTime = video.currentTime;
            audio.play().catch(console.error);
        };

        const handlePause = () => {
            audio.pause();
        };

        const handleSeek = () => {
            audio.currentTime = video.currentTime;
        };

        const handleRateChange = () => {
            audio.playbackRate = video.playbackRate;
        };

        const handleVolumeChange = () => {
            audio.volume = video.volume;
            audio.muted = video.muted;
        };

        // Set up event listeners
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("seeking", handleSeek);
        video.addEventListener("ratechange", handleRateChange);
        video.addEventListener("volumechange", handleVolumeChange);

        // Handle initial load
        const handleLoaded = () => {
            if (video.readyState >= 3 && audio.readyState >= 3) {
                setIsReady(true);
            }
        };

        video.addEventListener("canplay", handleLoaded);
        audio.addEventListener("canplay", handleLoaded);

        // Cleanup
        return () => {
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("seeking", handleSeek);
            video.removeEventListener("ratechange", handleRateChange);
            video.removeEventListener("volumechange", handleVolumeChange);
            video.removeEventListener("canplay", handleLoaded);
            audio.removeEventListener("canplay", handleLoaded);
        };
    }, [videoUrl, audioUrl]);

    return (
        <>
            <video
                ref={videoRef}
                className={className}
                controls
                muted
                onError={(e) => onError?.(e)}
            >
                <source src={videoUrl} type="video/mp4" />
            </video>
            <audio ref={audioRef} onError={(e) => onError?.(e)}>
                <source src={audioUrl} type="audio/wav" />
            </audio>
        </>
    );
};

export default UnifiedVideoPlayer;
