import { useState, memo } from "react";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import VideoPlayer from "./components/player";
import { CourseInfo } from "./components/courseInfo";
import { VideoList } from "./components/videoList";

const CourseDetail = memo(function CourseDetail({
  isDarkMode,
  courseData,
  rounded = "rounded-lg",
}) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className={`${isDarkMode ? "bg-[#111]" : "bg-gray-50"}`}>
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {selectedVideo && (
          <div className="w-full">
            <div className="sticky top-0 z-10">
              <VideoPlayer
                isDarkMode={isDarkMode}
                video={selectedVideo}
                selectedVideo={selectedVideo}
                setSelectedVideo={setSelectedVideo}
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
          className={`flex-1 border-0 rounded-none ${isDarkMode ? "bg-[#222]" : "bg-gray-50"}`}
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
              courseName={courseData.courseName}
            />
          </CardContent>
        </Card>
      </div>

      {/* Desktop Layout */}
      <div
        className={`hidden lg:grid ${selectedVideo ? "grid-cols-2" : "grid-cols-1"} gap-6 p-4 max-w-8xl mx-auto rounded-lg`}
      >
        <Card
          className={`h-fit ${isDarkMode ? "bg-[#222] border-stone-800" : "bg-white border-gray-100"}`}
        >
          <CardContent className="p-4">
            <CourseInfo isDarkMode={isDarkMode} courseData={courseData} />
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
            className={`Xh-[calc(100vh-3rem)] Xsticky top-6 rounded-md ${
              isDarkMode ? "Xbg-stone-800 Xborder-stone-700" : "Xbg-white"
            } ${rounded}`}
          >
            <VideoPlayer
              video={selectedVideo}
              isDarkMode={isDarkMode}
              selectedVideo={selectedVideo}
              setSelectedVideo={setSelectedVideo}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
});
CourseDetail.propTypes = {
  isDarkMode: PropTypes.bool,
  courseData: PropTypes.object,
  rounded: PropTypes.string,
};

export default CourseDetail;
