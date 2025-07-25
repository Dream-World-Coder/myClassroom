import React, { useRef, useEffect, useState, useMemo, memo } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import WatchToggle from "./WatchToggle";
import QualityToggle from "./QualityToggle";
import { useAuth } from "../../../../contexts/AuthContext";
import { useDarkMode } from "@/contexts/ThemeContext";

import type { Video } from "@/components/types";

/**
 * issues:
 *
 * low stream:
 * a bg one audio is running, need to stop that
 */

interface VideoPlayerTypes {
  video: Video | null;
  setSelectedVideo: React.Dispatch<React.SetStateAction<Video | null>>;
}

export const VideoPlayer = memo(function VideoPlayer({
  video,
  setSelectedVideo,
}: VideoPlayerTypes) {
  const { isDarkMode } = useDarkMode();
  const { token } = useAuth();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const subVideoRef = useRef<HTMLVideoElement | null>(null);

  const apiCallInProgressRef = useRef<boolean>(false);
  const currentVideoUrlRef = useRef<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bestQuality, setQuality] = useState<boolean>(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [audioStreamUrl, setAudioStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    // reseting on mount
    setQuality(false);
    setStreamUrl(null);
    setAudioStreamUrl(null);
    subVideoRef.current = null;
  }, []);

  // memoize the api call function to prevent recreating on every render
  const fetchStreamUrl = useMemo(
    () => async (videoUrl: string) => {
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

        if (data.streamUrl && currentVideoUrlRef.current === videoUrl) {
          setStreamUrl(data.streamUrl);
          if (videoRef.current) {
            videoRef.current.src = data.streamUrl;
            videoRef.current.load();
            videoRef.current.play();
          }
        }
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          toast.error("Failed to load video", { description: err.message });
        } else {
          toast.error("Failed to load video");
        }
      } finally {
        apiCallInProgressRef.current = false;
        setIsLoading(false);
      }
    },
    [token],
  );

  const VideoElement = useMemo(() => {
    if (!streamUrl) return null;

    return (
      <>
        <video
          id="mainVideo"
          ref={videoRef}
          controls={true}
          autoPlay={false}
          muted={true}
          className="size-full"
          onError={(err) => {
            if (err instanceof Error) {
              toast.error("Error playing video", { description: err.message });
            } else {
              toast.error("Error playing video");
            }
            setStreamUrl(null);
          }}
        >
          <source src={streamUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* used for audio */}
        <video
          id="subVideo"
          ref={subVideoRef}
          controls={false}
          autoPlay={false}
          muted={false}
          className="size-0 opacity-0 pointer-events-none"
          onError={() => {
            setAudioStreamUrl(null);
          }}
        >
          <source src={audioStreamUrl || streamUrl} type="video/mp4" />
        </video>
      </>
    );
  }, [streamUrl, audioStreamUrl]);

  // Synchronize main video actions to the sub video except mute, volumechange
  useEffect(() => {
    const mainVideo = videoRef.current;
    const subVideo = subVideoRef.current;

    if (!mainVideo || !subVideo) return;

    // sync functions
    const handlePlay = () => {
      subVideo.currentTime = mainVideo.currentTime;
      subVideo.play();
    };
    const handlePause = () => {
      subVideo.pause();
    };
    const handleSeeked = () => {
      subVideo.currentTime = mainVideo.currentTime;
    };

    const handleTimeUpdate = () => {
      const timeDiff = Math.abs(mainVideo.currentTime - subVideo.currentTime);
      if (timeDiff > 0.3) {
        subVideo.currentTime = mainVideo.currentTime;
      }
    };

    // listeners on the main video
    mainVideo.addEventListener("play", handlePlay);
    mainVideo.addEventListener("pause", handlePause);
    mainVideo.addEventListener("seeked", handleSeeked);
    mainVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      mainVideo.removeEventListener("play", handlePlay);
      mainVideo.removeEventListener("pause", handlePause);
      mainVideo.removeEventListener("seeked", handleSeeked);
      mainVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioStreamUrl]);

  useEffect(() => {
    // Clean up previous video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.load();
      setStreamUrl(null);
    }

    // fetch only if its a new video
    if (video?.videoUrl && video.videoUrl !== currentVideoUrlRef.current) {
      currentVideoUrlRef.current = video.videoUrl;
      fetchStreamUrl(video.videoUrl);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load(); // !issue ***, it says videoref will be changed by now
      }
      currentVideoUrlRef.current = null;
      setStreamUrl(null);
      apiCallInProgressRef.current = false;
    };
  }, [video?.videoUrl, fetchStreamUrl]);

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
  }, [video, isLoading]);

  if (!video) return null;

  return (
    <>
      {/* placeholder */}
      <div className="size-full opacity-0 relative"></div>

      {/* fixed */}
      <div
        className={`z-50 w-full md:w-[50%] h-screen md:rounded-lg overflow-hidden p-1 md:p-1 fixed top-16 md:top-20 right-0 md:right-1
        ${isDarkMode ? "bg-stone-800 text-stone-200" : "bg-gray-100 border border-gray-200 text-black"}`}
      >
        <div className="relative">
          {/* close btn mobile */}
          <div
            className={`w-full md:hidden ${isDarkMode ? "bg-stone-700" : "bg-stone-200"}
              rounded-lg py-2 px-4 mb-2 flex items-center justify-end text-sm`}
          >
            <div
              className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1 ${isDarkMode ? "bg-stone-800" : "bg-gray-100"}`}
              onClick={() => setSelectedVideo(null)}
            >
              <X size={18} /> Close
            </div>
          </div>

          <div className="aspect-video w-full bg-black relative rounded-lg overflow-hidden">
            {streamUrl ? VideoElement : ThumbnailDisplay}
          </div>

          <div className="p-4">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              {video.videoTitle}
            </h2>
            <div
              className={`flex items-center gap-2 text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              <span>Lecture {video?.index || -1 + 1}</span>
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
              videoRef={videoRef}
              setStreamUrl={setStreamUrl}
              setAudioStreamUrl={setAudioStreamUrl}
            />

            {/* close btn -> desktop */}
            <div className="fixed top-20 right-0 hidden md:block">
              <div
                className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1 ${isDarkMode ? "bg-stone-800" : "bg-gray-100"}`}
                style={{}}
                onClick={() => setSelectedVideo(null)}
              >
                <X size={18} /> Close
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

/*
<div class="aspect-video w-full bg-black relative rounded-lg overflow-hidden">
  <video
    id="mainVideo"
    controls=""
    class="size-full"
  >
    <source
      src="https://rr4---sn-gwpa-jj0d.googlevideo.com/videoplayback?expire=1753461906&amp;ei=MmCDaNHaEKDDssUPl7rgmQU&amp;ip=2409%3A40e1%3Ac6%3A131%3A71f0%3A3d42%3A8aea%3A49ec&amp;id=o-ANQcSReatjFHZOhE6HTU09FG7GQYbzbvuB36sem6KliF&amp;itag=18&amp;source=youtube&amp;requiressl=yes&amp;xpc=EgVo2aDSNQ%3D%3D&amp;met=1753440306%2C&amp;mh=gq&amp;mm=31%2C29&amp;mn=sn-gwpa-jj0d%2Csn-qxaeen7e&amp;ms=au%2Crdu&amp;mv=m&amp;mvi=4&amp;pl=47&amp;rms=au%2Cau&amp;initcwndbps=318750&amp;bui=AY1jyLOj_2OM7mewsUnYJfQcvQt-o2ljP-_aF-RXl7XuLHku4JKrwL_5k7exZ7961ZnI9L7Dpt7r14ig&amp;spc=l3OVKZLMp8rL_1HhX58fRcqwRRcDmzsYBzHRDetZpaq56-ky9sa0MKZWwyhqlcd9018&amp;vprv=1&amp;svpuc=1&amp;mime=video%2Fmp4&amp;rqh=1&amp;gir=yes&amp;clen=26567344&amp;ratebypass=yes&amp;dur=852.334&amp;lmt=1751943627869210&amp;mt=1753439840&amp;fvip=2&amp;fexp=51514994%2C51542236&amp;c=ANDROID&amp;txp=4438534&amp;sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&amp;sig=AJfQdSswRQIhAKGWYul0odhI7yVekdMf9E_iI2XCZC0QHLNAfoA3F7d0AiB3v9VYbUGfuTHWlqPqJTR8hlaordHO_Rjujd1hu9bd5A%3D%3D&amp;lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&amp;lsig=APaTxxMwRQIhAKqVOCD-2xn8Pr8e28ADxqQq7dyENviQERFb165fERMqAiAaOey4TdThBEfEKmweYzVO6wVcXfusv4UYRb0QCFmzCg%3D%3D"

      type="video/mp4"
    >
      Your browser does not support the video tag.
  </video>

  <video
    id="subVideo"
    class="size-0 opacity-0 pointer-events-none"
  >
    <source
      src="https://rr4---sn-gwpa-jj0d.googlevideo.com/videoplayback?expire=1753461906&amp;ei=MmCDaNHaEKDDssUPl7rgmQU&amp;ip=2409%3A40e1%3Ac6%3A131%3A71f0%3A3d42%3A8aea%3A49ec&amp;id=o-ANQcSReatjFHZOhE6HTU09FG7GQYbzbvuB36sem6KliF&amp;itag=18&amp;source=youtube&amp;requiressl=yes&amp;xpc=EgVo2aDSNQ%3D%3D&amp;met=1753440306%2C&amp;mh=gq&amp;mm=31%2C29&amp;mn=sn-gwpa-jj0d%2Csn-qxaeen7e&amp;ms=au%2Crdu&amp;mv=m&amp;mvi=4&amp;pl=47&amp;rms=au%2Cau&amp;initcwndbps=318750&amp;bui=AY1jyLOj_2OM7mewsUnYJfQcvQt-o2ljP-_aF-RXl7XuLHku4JKrwL_5k7exZ7961ZnI9L7Dpt7r14ig&amp;spc=l3OVKZLMp8rL_1HhX58fRcqwRRcDmzsYBzHRDetZpaq56-ky9sa0MKZWwyhqlcd9018&amp;vprv=1&amp;svpuc=1&amp;mime=video%2Fmp4&amp;rqh=1&amp;gir=yes&amp;clen=26567344&amp;ratebypass=yes&amp;dur=852.334&amp;lmt=1751943627869210&amp;mt=1753439840&amp;fvip=2&amp;fexp=51514994%2C51542236&amp;c=ANDROID&amp;txp=4438534&amp;sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&amp;sig=AJfQdSswRQIhAKGWYul0odhI7yVekdMf9E_iI2XCZC0QHLNAfoA3F7d0AiB3v9VYbUGfuTHWlqPqJTR8hlaordHO_Rjujd1hu9bd5A%3D%3D&amp;lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&amp;lsig=APaTxxMwRQIhAKqVOCD-2xn8Pr8e28ADxqQq7dyENviQERFb165fERMqAiAaOey4TdThBEfEKmweYzVO6wVcXfusv4UYRb0QCFmzCg%3D%3D"

      type="video/mp4"
    >
  </video>
</div>
*/
