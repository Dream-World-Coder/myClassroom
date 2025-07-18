import { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

export default function WatchToggle({
  videoUrl,
  isLoading = false,
  setIsLoading,
}) {
  const [watched, setWatched] = useState(false);
  const { token } = useAuth();
  const videoId = videoUrl.split("v=")[1];

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/video-watch-status?videoId=${videoId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        if (data.watchStatus !== undefined) {
          data.watchStatus == "True" ? setWatched(true) : setWatched(false);
        }
        // console.log(`\n\ndata.watchStatus=${data.watchStatus}\n`);
        // console.log(`\n\nwatched=${watched}\n`);
      } catch (error) {
        console.error("Error fetching watch status:", error);
      }
    };

    fetchStatus();
  }, [videoUrl]);

  const handleToggle = async () => {
    const newState = !watched;
    setWatched(newState);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/video-watch-status`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoId: videoId,
            newStatus: newState,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to update status");
      let data = response.json();
      console.log(data.message, data.watchStatus);
    } catch (error) {
      console.error("Error updating watch status:", error);
      setWatched((prev) => !prev); // Revert if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-3 text-sm">
      <span>Completed</span>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative w-8 h-4 rounded-full transition-colors ${
          watched ? "bg-green-500" : "bg-gray-300"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {/* Round handle */}
        <span
          className={`absolute top-1 left-1 w-2 h-2 bg-white rounded-full transition-transform ${
            watched ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

WatchToggle.propTypes = {
  videoUrl: PropTypes.string,
  isLoading: PropTypes.bool,
  setIsLoading: PropTypes.func,
};
