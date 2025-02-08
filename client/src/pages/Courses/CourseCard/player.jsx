import React, { useRef, useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-hot-toast";

const VideoPlayer = ({ video, selectedVideo }) => {
    const videoRef = useRef(null);
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const streamUrlRef = useRef(null);
    const apiCallInProgressRef = useRef(false);
    const currentVideoRef = useRef(null);

    // Memoize the API call function to prevent recreating on every render
    const fetchStreamUrl = useMemo(
        () => async (videoUrl) => {
            if (!token || apiCallInProgressRef.current) return;

            apiCallInProgressRef.current = true;
            setIsLoading(true);

            const apiUrl = "http://127.0.0.1:5050/api/v1/stream";

            const options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ videoUrl }),
            };

            try {
                const response = await fetch(apiUrl, options);
                const data = await response.json();

                if (data.streamUrl && currentVideoRef.current === videoUrl) {
                    streamUrlRef.current = data.streamUrl;
                    if (videoRef.current) {
                        videoRef.current.src = data.streamUrl;
                        videoRef.current.load();
                        videoRef.current.play();
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load video");
            } finally {
                apiCallInProgressRef.current = false;
                setIsLoading(false);
            }
        },
        [token],
    ); // Only recreate if token changes

    // Memoize video component to prevent unnecessary re-renders
    const VideoElement = useMemo(() => {
        if (!streamUrlRef.current) return null;

        return (
            <video
                ref={videoRef}
                controls
                autoPlay
                muted
                className="w-full h-full"
                onError={() => {
                    toast.error("Error playing video");
                    streamUrlRef.current = null;
                }}
            >
                <source src={streamUrlRef.current} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    }, [streamUrlRef.current]);

    useEffect(() => {
        // Clean up previous video
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.src = "";
            videoRef.current.load();
            streamUrlRef.current = null;
        }

        // Only fetch if it's a new video
        if (video?.videoUrl && video.videoUrl !== currentVideoRef.current) {
            currentVideoRef.current = video.videoUrl;
            fetchStreamUrl(video.videoUrl);
        }

        // Cleanup function
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.src = "";
                videoRef.current.load();
            }
            currentVideoRef.current = null;
            streamUrlRef.current = null;
            apiCallInProgressRef.current = false;
        };
    }, [video?.videoUrl, fetchStreamUrl]); // Only depend on video URL and memoized fetch function

    // Memoize the thumbnail display
    const ThumbnailDisplay = useMemo(() => {
        if (!video) return null;

        return (
            <div className="relative w-full h-full">
                <img
                    src={video.videoThumbnailUrl}
                    alt={video.videoTitle}
                    className="w-full h-full object-cover opacity-60"
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                )}
            </div>
        );
    }, [video?.videoThumbnailUrl, isLoading]);

    if (!video) return null;

    return (
        <div className="w-full h-full bg-stone-800 rounded-lg overflow-hidden">
            <div className="relative">
                <div className="aspect-video w-full bg-black relative">
                    {streamUrlRef.current ? VideoElement : ThumbnailDisplay}
                </div>

                <div className="p-4">
                    <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
                        {video.videoTitle}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Lecture {selectedVideo?.index + 1}</span>
                        <span>•</span>
                        <span>{video.videoDuration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Wrap the entire component in memo to prevent unnecessary re-renders
export default React.memo(VideoPlayer, (prevProps, nextProps) => {
    return prevProps.video?.videoUrl === nextProps.video?.videoUrl;
});
