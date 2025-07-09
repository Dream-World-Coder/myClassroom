import React, { useRef, useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import WatchToggle from "./Watched";
import QualityToggle from "./Quality";

const VideoPlayer = ({ video, selectedVideo }) => {
  const videoRef = useRef(null);
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [bestQuality, setQuality] = useState(false);
  const streamUrlRef = useRef(null);
  const audioStreamUrlRef = useRef(null);
  const apiCallInProgressRef = useRef(false);
  const currentVideoRef = useRef(null);

  // Memoize the API call function to prevent recreating on every render
  const fetchStreamUrl = useMemo(
    () => async (videoUrl) => {
      if (!token || apiCallInProgressRef.current) return;

      apiCallInProgressRef.current = true;
      setIsLoading(true);

      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/stream/low`;

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
        // toast.error("Failed to load video");
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
      <>
        <video
          id="mainVideo"
          ref={videoRef}
          controls
          autoPlay
          muted
          className="w-full h-full"
          onError={() => {
            // toast.error("Error playing video");
            streamUrlRef.current = null;
          }}
        >
          <source src={streamUrlRef.current} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* The sub video is conditionally rendered. It remains hidden but can serve as an audio source */}
        {audioStreamUrlRef.current && (
          <video
            id="subVideo"
            ref={audioStreamUrlRef}
            controls={false}
            autoPlay
            muted
            className="size-0 opacity-0 pointer-events-none"
            onError={() => {
              audioStreamUrlRef.current = null;
            }}
          >
            <source src={audioStreamUrlRef.current} type="video/mp4" />
          </video>
        )}
      </>
    );
  }, [streamUrlRef.current, audioStreamUrlRef.current]);

  // Synchronize main video actions to the sub video
  useEffect(() => {
    const mainVideo = videoRef.current;
    const subVideo = audioStreamUrlRef.current;

    // Only attach listeners if both video elements are available
    if (!mainVideo || !subVideo) return;

    // When the main video plays, update the sub video and play it
    const handlePlay = () => {
      subVideo.currentTime = mainVideo.currentTime;
      subVideo.play();
    };

    // When the main video pauses, pause the sub video
    const handlePause = () => {
      subVideo.pause();
    };

    // When seeking completes on the main video, update the sub video's time
    const handleSeeked = () => {
      subVideo.currentTime = mainVideo.currentTime;
    };

    // When the volume or mute state changes, update the sub video accordingly
    const handleVolumeChange = () => {
      subVideo.volume = mainVideo.volume;
      subVideo.muted = mainVideo.muted;
    };

    // Optionally, during playback, check for drift and re-sync if needed
    const handleTimeUpdate = () => {
      const timeDiff = Math.abs(mainVideo.currentTime - subVideo.currentTime);
      if (timeDiff > 0.3) {
        subVideo.currentTime = mainVideo.currentTime;
      }
    };

    // Attach event listeners on the main video
    mainVideo.addEventListener("play", handlePlay);
    mainVideo.addEventListener("pause", handlePause);
    mainVideo.addEventListener("seeked", handleSeeked);
    mainVideo.addEventListener("volumechange", handleVolumeChange);
    mainVideo.addEventListener("timeupdate", handleTimeUpdate);

    // Cleanup listeners on unmount
    return () => {
      mainVideo.removeEventListener("play", handlePlay);
      mainVideo.removeEventListener("pause", handlePause);
      mainVideo.removeEventListener("seeked", handleSeeked);
      mainVideo.removeEventListener("volumechange", handleVolumeChange);
      mainVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []); // Run once on mount

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
  }, [video?.videoUrl, fetchStreamUrl]);

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
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>Lecture {selectedVideo?.index + 1}</span>
            <span>•</span>
            <span>{video.videoDuration}</span>
          </div>
          <WatchToggle
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            videoUrl={video.videoUrl}
          />
          <QualityToggle
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            bestQuality={bestQuality}
            setQuality={setQuality}
            video={video}
            streamUrlRef={streamUrlRef}
            audioStreamUrlRef={audioStreamUrlRef}
          />
        </div>
      </div>
    </div>
  );
};

// Wrap the entire component in memo to prevent unnecessary re-renders
export default React.memo(VideoPlayer, (prevProps, nextProps) => {
  return prevProps.video?.videoUrl === nextProps.video?.videoUrl;
});

// import React, { useRef, useEffect, useState, useMemo } from "react";
// import { useAuth } from "../../../../contexts/AuthContext";
// import WatchToggle from "./Watched";
// import QualityToggle from "./Quality";

// const VideoPlayer = ({ video, selectedVideo }) => {
//     const videoRef = useRef(null);
//     const { token } = useAuth();
//     const [isLoading, setIsLoading] = useState(false);
//     const [bestQuality, setQuality] = useState(false);
//     const streamUrlRef = useRef(null);
//     const audioStreamUrlRef = useRef(null);
//     const apiCallInProgressRef = useRef(false);
//     const currentVideoRef = useRef(null);

//     // Memoize the API call function to prevent recreating on every render
//     const fetchStreamUrl = useMemo(
//         () => async (videoUrl) => {
//             if (!token || apiCallInProgressRef.current) return;

//             apiCallInProgressRef.current = true;
//             setIsLoading(true);

//             const apiUrl = "${import.meta.env.VITE_BACKEND_URL}/api/v1/stream/low";

//             const options = {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ videoUrl }),
//             };

//             try {
//                 const response = await fetch(apiUrl, options);
//                 const data = await response.json();

//                 if (data.streamUrl && currentVideoRef.current === videoUrl) {
//                     streamUrlRef.current = data.streamUrl;
//                     if (videoRef.current) {
//                         videoRef.current.src = data.streamUrl;
//                         videoRef.current.load();
//                         videoRef.current.play();
//                     }
//                 }
//             } catch (err) {
//                 console.error(err);
//                 // toast.error("Failed to load video");
//             } finally {
//                 apiCallInProgressRef.current = false;
//                 setIsLoading(false);
//             }
//         },
//         [token],
//     ); // Only recreate if token changes

//     // Memoize video component to prevent unnecessary re-renders
//     const VideoElement = useMemo(() => {
//         if (!streamUrlRef.current) return null;

//         return (
//             <>
//                 <video
//                     id="mainVideo"
//                     ref={videoRef}
//                     controls
//                     autoPlay
//                     muted
//                     className="w-full h-full"
//                     onError={() => {
//                         // toast.error("Error playing video");
//                         streamUrlRef.current = null;
//                     }}
//                 >
//                     <source src={streamUrlRef.current} type="video/mp4" />
//                     Your browser does not support the video tag.
//                 </video>
//                 {/* i think from the next video onwards the ref will again be
//                 null due to re-rendering if not then there will be problem */}
//                 {audioStreamUrlRef.current && (
//                     <video
//                         id="subVideo"
//                         ref={audioStreamUrlRef}
//                         controls={false}
//                         autoPlay
//                         muted
//                         className="size-0 opacity-0 pointer-events-none"
//                         // invisible, cuz it will work as audio aource, but do not use `hidden`
//                         onError={() => {
//                             audioStreamUrlRef.current = null;
//                         }}
//                     >
//                         <source
//                             src={audioStreamUrlRef.current}
//                             type="video/mp4"
//                         />
//                     </video>
//                 )}
//             </>
//         );
//     }, [streamUrlRef.current, audioStreamUrlRef.current]);

//     useEffect(() => {
//         // Clean up previous video
//         if (videoRef.current) {
//             videoRef.current.pause();
//             videoRef.current.src = "";
//             videoRef.current.load();
//             streamUrlRef.current = null;
//         }

//         // Only fetch if it's a new video
//         if (video?.videoUrl && video.videoUrl !== currentVideoRef.current) {
//             currentVideoRef.current = video.videoUrl;
//             fetchStreamUrl(video.videoUrl);
//         }

//         // Cleanup function
//         return () => {
//             if (videoRef.current) {
//                 videoRef.current.pause();
//                 videoRef.current.src = "";
//                 videoRef.current.load();
//             }
//             currentVideoRef.current = null;
//             streamUrlRef.current = null;
//             apiCallInProgressRef.current = false;
//         };
//     }, [video?.videoUrl, fetchStreamUrl]); // Only depend on video URL and memoized fetch function

//     // Memoize the thumbnail display
//     const ThumbnailDisplay = useMemo(() => {
//         if (!video) return null;

//         return (
//             <div className="relative w-full h-full">
//                 <img
//                     src={video.videoThumbnailUrl}
//                     alt={video.videoTitle}
//                     className="w-full h-full object-cover opacity-60"
//                 />
//                 {isLoading && (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
//                     </div>
//                 )}
//             </div>
//         );
//     }, [video?.videoThumbnailUrl, isLoading]);

//     if (!video) return null;

//     return (
//         <div className="w-full h-full bg-stone-800 rounded-lg overflow-hidden">
//             <div className="relative">
//                 <div className="aspect-video w-full bg-black relative">
//                     {streamUrlRef.current ? VideoElement : ThumbnailDisplay}
//                 </div>

//                 <div className="p-4">
//                     <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
//                         {video.videoTitle}
//                     </h2>
//                     <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
//                         <span>Lecture {selectedVideo?.index + 1}</span>
//                         <span>•</span>
//                         <span>{video.videoDuration}</span>
//                     </div>
//                     <WatchToggle videoUrl={video.videoUrl} />
//                     <QualityToggle
//                         isLoading={isLoading}
//                         setIsLoading={setIsLoading}
//                         bestQuality={bestQuality}
//                         setQuality={setQuality}
//                         video={video}
//                         streamUrlRef={streamUrlRef}
//                         audioStreamUrlRef={audioStreamUrlRef}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Wrap the entire component in memo to prevent unnecessary re-renders
// export default React.memo(VideoPlayer, (prevProps, nextProps) => {
//     return prevProps.video?.videoUrl === nextProps.video?.videoUrl;
// });
