import React from "react";
import { toast } from "sonner";
import { useAuth } from "../../../../contexts/AuthContext";
import type { Video } from "@/components/types";

interface QTType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  bestQuality: boolean;
  setQuality: (x: boolean | ((prev: boolean) => boolean)) => void;

  video: Video;
  videoRef: React.RefObject<HTMLVideoElement | null>;

  setStreamUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setAudioStreamUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ResType {
  directLinks: {
    videoLink: string;
    audioLink: string;
  };
  error?: string;
}

export default function QualityToggle({
  isLoading = false,
  setIsLoading,
  bestQuality = false,
  setQuality,
  video,
  videoRef,
  setStreamUrl,
  setAudioStreamUrl,
}: QTType) {
  const { token } = useAuth();

  const handleToggle = async () => {
    setQuality(!bestQuality);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/stream/high`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoUrl: video.videoUrl,
          }),
        },
      );

      if (!response.ok) throw new Error("Request failed");
      const data: ResType = await response.json();
      if (data.error) {
        console.error(data.error);
        toast.error(data.error);
      } else if (data.directLinks) {
        const currentTime = videoRef.current?.currentTime || 0;
        const wasPlaying = videoRef.current && !videoRef.current.paused;

        setStreamUrl(data.directLinks.videoLink);
        setAudioStreamUrl(data.directLinks.audioLink);

        if (videoRef.current) {
          const videoEl = videoRef.current;

          videoEl.src = data.directLinks.videoLink;
          videoEl.load();

          // Resume playback from the same time
          videoEl.addEventListener(
            "loadedmetadata",
            () => {
              videoEl.currentTime = currentTime;
              if (wasPlaying) {
                videoEl.play();
              }
            },
            { once: true },
          );
        }
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error("Error updating watch status:", error);
      setQuality((prev: boolean) => !prev); // Revert if fetch fails
      toast.error("Failed to update video quality");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-3 text-sm">
      <span>Best Video Quality</span>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative w-8 h-4 rounded-full transition-colors ${
          bestQuality ? "bg-green-500" : "bg-gray-300"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {/* round handle */}
        <span
          className={`absolute top-1 left-1 w-2 h-2 bg-white rounded-full transition-transform ${
            bestQuality ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
