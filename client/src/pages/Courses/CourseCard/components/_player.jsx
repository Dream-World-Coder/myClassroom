import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import WatchToggle from "./Watched";
import { useAuth } from "../../../../contexts/AuthContext";

const VideoPlayer = ({ video, selectedVideo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const { token } = useAuth();

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const previousUrlRef = useRef(null);

  const fetchStreamUrl = async (videoUrl) => {
    if (!token || isLoading || previousUrlRef.current === videoUrl) return;

    setIsLoading(true);
    previousUrlRef.current = videoUrl;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/stream`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoUrl }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setStreamUrl(data.video.streamUrl);
        setAudioUrl(data.audio.streamUrl);
      }
    } catch (err) {
      console.error("Error fetching stream:", err);
      setStreamUrl(null);
      setAudioUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced synchronization with proper error handling
  useEffect(() => {
    const videoElement = videoRef.current;
    const audioElement = audioRef.current;

    if (!videoElement || !audioElement) return;

    const handleTimeUpdate = () => {
      if (Math.abs(videoElement.currentTime - audioElement.currentTime) > 0.1) {
        audioElement.currentTime = videoElement.currentTime;
      }
      setProgress((videoElement.currentTime / videoElement.duration) * 100);
    };

    const handlePlay = async () => {
      try {
        setIsPlaying(true);
        // Wait for both play promises to resolve
        await Promise.all([
          audioElement.play().catch(() => {}),
          videoElement.play().catch(() => {}),
        ]);
      } catch (error) {
        console.error("Error playing media:", error);
        setIsPlaying(false);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      audioElement.pause();
    };

    // Handle audio loading
    const handleCanPlay = () => {
      // Sync initial time
      audioElement.currentTime = videoElement.currentTime;

      // If video is already playing, start audio too
      if (!videoElement.paused) {
        audioElement.play().catch(() => {});
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("canplay", handleCanPlay);

    // Sync muted state on mount
    audioElement.muted = videoElement.muted;

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("canplay", handleCanPlay);
    };
  }, [streamUrl, audioUrl]);

  useEffect(() => {
    if (video?.videoUrl) {
      fetchStreamUrl(video.videoUrl);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
      setStreamUrl(null);
      setAudioUrl(null);
      previousUrlRef.current = null;
    };
  }, [video?.videoUrl]);

  const togglePlay = async () => {
    try {
      if (videoRef.current.paused) {
        // Ensure audio is at the same time before playing
        audioRef.current.currentTime = videoRef.current.currentTime;
        await Promise.all([videoRef.current.play(), audioRef.current.play()]);
      } else {
        videoRef.current.pause();
        audioRef.current.pause();
      }
    } catch (error) {
      console.error("Error toggling play state:", error);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(!isMuted);
  };

  const skipBack = () => {
    const newTime = Math.max(videoRef.current.currentTime - 10, 0);
    videoRef.current.currentTime = newTime;
    audioRef.current.currentTime = newTime;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    audioRef.current.currentTime = newTime;
  };

  const handleError = (e) => {
    console.error("Video error:", e);
    setStreamUrl(null);
    setAudioUrl(null);
  };

  const ThumbnailDisplay = (
    <div className="relative w-full h-full">
      <img
        src={video?.videoThumbnailUrl}
        alt={video?.videoTitle}
        className="w-full h-full object-cover opacity-60"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );

  if (!video) return null;

  return (
    <div className="w-full h-full bg-stone-800 rounded-lg overflow-hidden">
      <div className="relative">
        <div className="aspect-video w-full bg-black relative">
          {streamUrl ? (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-full"
                playsInline
                onError={handleError}
                key={streamUrl}
                preload="auto"
              >
                <source src={streamUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <audio
                ref={audioRef}
                className="w-0 h-0 opacity-0"
                key={audioUrl}
                preload="auto"
              >
                <source src={audioUrl} type="audio/mpeg" />
              </audio>

              {/* Progress bar */}
              <div
                className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Custom controls */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-4 text-white">
                <button
                  onClick={skipBack}
                  className="p-1 rounded-full hover:bg-gray-700/50"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-1 rounded-full hover:bg-gray-700/50"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-1 rounded-full hover:bg-gray-700/50"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            ThumbnailDisplay
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
            {video.videoTitle}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>Lecture {selectedVideo?.index + 1}</span>
            <span>•</span>
            <span>{video.videoDuration}</span>
          </div>
          <WatchToggle videoUrl={video.videoUrl} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(VideoPlayer, (prevProps, nextProps) => {
  return prevProps.video?.videoUrl === nextProps.video?.videoUrl;
});
