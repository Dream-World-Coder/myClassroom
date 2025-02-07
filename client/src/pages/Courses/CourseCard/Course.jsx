import { useState } from "react";
import {
    Link,
    Clock,
    Play,
    BookText,
    DraftingCompass,
    ChevronLeft,
    Maximize2,
    Volume2,
    Settings,
    SkipBack,
    SkipForward,
    Pause,
    X,
    MinusCircle,
    PlusCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const CourseDetail = ({ isDarkMode, courseData, rounded = "rounded-lg" }) => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(80);
    const [showVolumeControl, setShowVolumeControl] = useState(false);

    const VideoPlayer = ({ video }) => {
        if (!video) return null;

        return (
            <div
                className={`w-full h-full ${isDarkMode ? "bg-stone-900" : "bg-gray-900"} rounded-lg overflow-hidden`}
            >
                <div className="relative">
                    {/* Video Container */}
                    <div className="aspect-video w-full bg-black relative group">
                        <img
                            src={video.videoThumbnailUrl}
                            alt={video.videoTitle}
                            className="w-full h-full object-cover opacity-60"
                        />

                        {/* Center Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all group-hover:scale-110"
                            >
                                {isPlaying ? (
                                    <Pause className="w-8 h-8 text-white" />
                                ) : (
                                    <Play className="w-8 h-8 text-white ml-1" />
                                )}
                            </button>
                        </div>

                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                            {/* Progress Bar */}
                            <div className="mb-4">
                                <Slider
                                    defaultValue={[0]}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* Controls Row */}
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-white/20"
                                    >
                                        <SkipBack className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-white/20"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-4 w-4" />
                                        ) : (
                                            <Play className="h-4 w-4 ml-0.5" />
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-white/20"
                                    >
                                        <SkipForward className="h-4 w-4" />
                                    </Button>

                                    <div className="relative">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-white/20"
                                            onClick={() =>
                                                setShowVolumeControl(
                                                    !showVolumeControl,
                                                )
                                            }
                                        >
                                            <Volume2 className="h-4 w-4" />
                                        </Button>

                                        {showVolumeControl && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-black/90 rounded-lg backdrop-blur-sm">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Slider
                                                        value={[volume]}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setVolume(value[0])
                                                        }
                                                        max={100}
                                                        step={1}
                                                        orientation="vertical"
                                                        className="h-24"
                                                    />
                                                    <span className="text-xs">
                                                        {volume}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <span className="text-sm">
                                        0:00 / {video.videoDuration}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-white/20"
                                    >
                                        <Settings className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-white/20"
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Info */}
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

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "bg-stone-900" : "bg-gray-50"}`}
        >
            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col min-h-screen">
                {selectedVideo && (
                    <div className="w-full">
                        <div className="sticky top-0 z-10">
                            <VideoPlayer video={selectedVideo} />
                            <Button
                                variant="ghost"
                                className="absolute top-4 left-4 z-20"
                                onClick={() => setSelectedVideo(null)}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Back to course
                            </Button>
                        </div>
                    </div>
                )}

                <Card
                    className={`flex-1 border-0 ${isDarkMode ? "bg-stone-900" : "bg-gray-50"}`}
                >
                    <CardContent className="p-0">
                        <CourseInfo
                            isDarkMode={isDarkMode}
                            courseData={courseData}
                            className={selectedVideo ? "hidden" : "block"}
                        />
                        <VideoList
                            isDarkMode={isDarkMode}
                            videos={courseData.videos}
                            onVideoSelect={setSelectedVideo}
                            selectedVideo={selectedVideo}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Desktop Layout */}
            <div
                className={`hidden lg:grid ${selectedVideo ? "grid-cols-2" : "grid-cols-1"} gap-6 p-6 max-w-8xl mx-auto rounded-lg`}
            >
                <Card
                    className={`h-[calc(100vh-3rem)] ${isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-gray-100"}`}
                >
                    <CardContent className="p-6">
                        <CourseInfo
                            isDarkMode={isDarkMode}
                            courseData={courseData}
                        />
                        <VideoList
                            isDarkMode={isDarkMode}
                            videos={courseData.videos}
                            onVideoSelect={setSelectedVideo}
                            selectedVideo={selectedVideo}
                        />
                    </CardContent>
                </Card>

                {selectedVideo ? (
                    <div
                        className={`h-[calc(100vh-3rem)] sticky top-6 rounded-md ${
                            isDarkMode
                                ? "bg-stone-800 border-stone-700"
                                : "bg-white"
                        } ${rounded}`}
                    >
                        <VideoPlayer video={selectedVideo} />
                    </div>
                ) : (
                    <div
                        className={`h-[calc(100vh-3rem)] sticky top-6 flex items-center justify-center rounded-md
                            transform scale-x-0 transition-all duration-300 ${
                                isDarkMode
                                    ? "bg-stone-800 border-stone-700"
                                    : "bg-white"
                            } ${rounded}`}
                    >
                        <div className="text-center">
                            <Play
                                className={`w-16 h-16 mx-auto mb-4 ${
                                    isDarkMode
                                        ? "text-stone-700"
                                        : "text-stone-200"
                                }`}
                            />
                            <h3
                                className={`text-xl font-medium ${
                                    isDarkMode
                                        ? "text-stone-400"
                                        : "text-stone-600"
                                }`}
                            >
                                Select a video to start watching
                            </h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CourseInfo = ({ isDarkMode, courseData, className = "" }) => (
    <div className={`p-6 ${className}`}>
        <div className="flex items-start gap-6 mb-8">
            <div className="overflow-hidden w-24 h-24 rounded-lg shrink-0">
                <img
                    className="w-full h-full object-cover"
                    src={
                        courseData.courseThumbnail ||
                        "/images/courseThumbnails/2.jpg"
                    }
                    alt="Course Thumbnail"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h1
                    className={`text-2xl md:text-3xl font-semibold mb-4 ${
                        isDarkMode ? "text-stone-100" : "text-stone-900"
                    }`}
                >
                    {courseData.courseName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <Badge
                        variant="secondary"
                        className={isDarkMode ? "bg-stone-700" : "bg-gray-200"}
                    >
                        {courseData.courseOrganiser}
                    </Badge>
                    {courseData.courseUrl && (
                        <a
                            href={courseData.courseUrl}
                            target="_blank"
                            className={`inline-flex items-center gap-1 hover:underline ${
                                isDarkMode ? "text-stone-300" : "text-stone-600"
                            }`}
                        >
                            <Link className="w-4 h-4" />
                            Course Link
                        </a>
                    )}
                    {courseData.courseDuration && (
                        <span
                            className={`inline-flex items-center gap-1 ${
                                isDarkMode ? "text-stone-300" : "text-stone-600"
                            }`}
                        >
                            <Clock className="w-4 h-4" />
                            {courseData.courseDuration}
                        </span>
                    )}
                </div>
            </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
            {courseData.videos && (
                <span
                    className={`flex items-center gap-2 ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                    }`}
                >
                    <DraftingCompass className="w-4 h-4" />
                    {courseData.videos.length} Lectures
                </span>
            )}
            {courseData.courseMaterials?.length > 0 && (
                <span
                    className={`flex items-center gap-2 ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                    }`}
                >
                    <BookText className="w-4 h-4" />
                    {courseData.courseMaterials.length} Materials
                </span>
            )}
        </div>
    </div>
);

const VideoList = ({ isDarkMode, videos, onVideoSelect, selectedVideo }) => (
    <ScrollArea className="h-[calc(100vh-20rem)]">
        <div
            className={`space-y-2 px-6 ${isDarkMode ? "divide-stone-700" : "divide-stone-200"}`}
        >
            {videos?.map((video, index) => (
                <button
                    key={index}
                    onClick={() => onVideoSelect(video)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedVideo === video
                            ? isDarkMode
                                ? "bg-stone-700"
                                : "bg-stone-100"
                            : isDarkMode
                              ? "hover:bg-stone-700/50"
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
                                    selectedVideo === video
                                        ? "bg-black/50"
                                        : "bg-black/20"
                                }`}
                            >
                                <Play
                                    className={`w-8 h-8 ${
                                        selectedVideo === video
                                            ? "text-white"
                                            : "text-white/70"
                                    }`}
                                />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3
                                className={`font-medium mb-1  ${
                                    isDarkMode
                                        ? "text-stone-100"
                                        : "text-stone-900"
                                }`}
                            >
                                {video.videoTitle}
                            </h3>
                            <p
                                className={`text-sm ${
                                    isDarkMode
                                        ? "text-stone-400"
                                        : "text-stone-500"
                                }`}
                            >
                                {video.videoDuration}
                            </p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </ScrollArea>
);

export default CourseDetail;
