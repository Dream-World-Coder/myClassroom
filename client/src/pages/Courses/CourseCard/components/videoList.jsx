import { memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";
import PropTypes from "prop-types";

export const VideoList = memo(function VideoList({
  isDarkMode,
  videos,
  onVideoSelect,
  selectedVideo,
}) {
  return (
    <ScrollArea className="h-fit">
      <div className="px-4 pb-40">
        {videos?.map((video, index) => (
          <div
            key={index}
            className={`py-2 ${index !== videos.length - 1 ? "border-b border-dashed" : ""}
              ${isDarkMode ? "border-stone-700" : "border-stone-200"}`}
          >
            <button
              onClick={() => onVideoSelect(video)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedVideo === video
                  ? isDarkMode
                    ? "bg-stone-600"
                    : "bg-stone-100"
                  : isDarkMode
                    ? "hover:bg-stone-600/50"
                    : "hover:bg-stone-100"
              }`}
            >
              <div className="flex gap-4">
                <div className="relative overflow-hidden rounded-md w-32 h-20 shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={video.videoThumbnailUrl}
                    alt={video.videoTitle}
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      selectedVideo === video ? "bg-black/50" : "bg-black/20"
                    }`}
                  >
                    <Play
                      className={`w-8 h-8 ${
                        selectedVideo === video ? "text-white" : "text-white/70"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium mb-1  ${
                      isDarkMode ? "text-stone-100" : "text-stone-900"
                    }`}
                  >
                    {video.videoTitle}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-stone-400" : "text-stone-500"
                    }`}
                  >
                    {video.videoDuration}
                  </p>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});

VideoList.propTypes = {
  isDarkMode: PropTypes.bool,
  videos: PropTypes.array,
  onVideoSelect: PropTypes.func,
  selectedVideo: PropTypes.object,
};
