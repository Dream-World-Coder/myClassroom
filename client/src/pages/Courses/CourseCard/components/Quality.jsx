// Quality.jsx

import toast from "react-hot-toast";
import { useAuth } from "../../../../contexts/AuthContext";
import PropTypes from "prop-types";

export default function QualityToggle({
  isLoading = false,
  setIsLoading,
  bestQuality = false,
  setQuality,
  video,
  videoRef,
  setStreamUrl,
  setAudioStreamUrl,
}) {
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
      let data = await response.json();
      if (data.error) {
        console.error(data.error);
        toast.error(data.error);
      } else if (data.directLinks) {
        const currentTime = videoRef.current?.currentTime || 0;
        const wasPlaying = videoRef.current && !videoRef.current.paused;

        setStreamUrl(data.directLinks.videoLink);
        setAudioStreamUrl(data.directLinks.audioLink);

        if (videoRef.current) {
          videoRef.current.src = data.directLinks.videoLink;
          videoRef.current.load();

          // Resume playback from the same time
          videoRef.current.addEventListener(
            "loadedmetadata",
            () => {
              videoRef.current.currentTime = currentTime;
              if (wasPlaying) {
                videoRef.current.play();
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
      setQuality((prev) => !prev); // Revert if fetch fails
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
        {/* Round handle */}
        <span
          className={`absolute top-1 left-1 w-2 h-2 bg-white rounded-full transition-transform ${
            bestQuality ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
QualityToggle.propTypes = {
  isLoading: PropTypes.bool,
  bestQuality: PropTypes.bool,
  setIsLoading: PropTypes.func,
  setQuality: PropTypes.func,
  video: PropTypes.object,
  videoRef: PropTypes.object,
  setStreamUrl: PropTypes.func,
  setAudioStreamUrl: PropTypes.func,
};
