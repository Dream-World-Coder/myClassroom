import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./components/player";
import { CourseInfo } from "./components/courseInfo";
import { VideoList } from "./components/videoList";

const CourseDetail = ({ isDarkMode, courseData, rounded = "rounded-lg" }) => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <div className={`${isDarkMode ? "bg-[#111]" : "bg-gray-50"}`}>
            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col min-h-screen">
                {selectedVideo && (
                    <div className="w-full">
                        <div className="sticky top-0 z-10">
                            <VideoPlayer
                                video={selectedVideo}
                                selectedVideo={selectedVideo}
                            />
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
                    className={`flex-1 border-0 ${isDarkMode ? "bg-[#222]" : "bg-gray-50"}`}
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
                    className={`h-fit ${isDarkMode ? "bg-[#222] border-stone-800" : "bg-white border-gray-100"}`}
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
                        <VideoPlayer
                            video={selectedVideo}
                            selectedVideo={selectedVideo}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default CourseDetail;
