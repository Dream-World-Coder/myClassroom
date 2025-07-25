import React, { memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";

import { useDarkMode } from "@/contexts/ThemeContext";
import type { Video } from "@/components/types";

interface VideoListType {
  videos: Video[];
  selectedVideo: Video | null;
  onVideoSelect: React.Dispatch<React.SetStateAction<Video | null>>;
  courseName: string | null;
}

export const VideoList = memo(function VideoList({
  videos,
  onVideoSelect,
  selectedVideo,
  courseName = null,
}: VideoListType) {
  const { isDarkMode } = useDarkMode();

  const createSafeId = (
    name: string | null | undefined,
    index: number,
  ): string => {
    if (!name) return `course-${index + 1}`;

    return `${
      name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "") // Remove special characters except hyphens
        .toLowerCase()
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    }-${index + 1}`;
  };

  return (
    <ScrollArea className="h-fit">
      <div className="px-4 pb-40">
        {videos?.map((video, index) => (
          <div
            key={createSafeId(courseName, index)}
            id={createSafeId(courseName, index)}
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
