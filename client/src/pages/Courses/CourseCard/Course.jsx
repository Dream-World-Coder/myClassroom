import React from "react";
import { Link, Clock, Play, BookText, DraftingCompass } from "lucide-react";

// add video delete options on hover

const CourseCard = ({ isDarkMode, previewCourseData, progress }) => {
    const courseImages = [
        "/images/courseThumbnails/1.jpg",
        "/images/courseThumbnails/2.jpg",
        "/images/courseThumbnails/3.jpg",
        "/images/courseThumbnails/4.jpg",
        "/images/courseThumbnails/5.jpg",
        "/images/courseThumbnails/6.jpg",
    ];

    var courseThumbnail =
        courseImages[Math.floor(Math.random() * courseImages.length)];

    return (
        <div
            className={`relative size-full p-6 rounded-lg border
                ${isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-stone-200"}`}
        >
            <div className="flex items-center justify-start gap-6 mb-8">
                <div className="overflow-hidden size-24 rounded-lg">
                    <img
                        className="object-cover block rounded-lg"
                        src={courseThumbnail}
                        alt="Course Thumbnail"
                    />
                </div>
                <div className="flex-1">
                    <h1
                        className={`text-2xl md:text-4xl font-serif font-semibold mb-4 ${isDarkMode ? "text-stone-100" : "text-black"}`}
                    >
                        {previewCourseData.name}
                    </h1>
                    <p className="flex items-center justify-start text-md w-full">
                        <span className="flex items-center justify-center gap-6 text-xs md:text-lg">
                            {previewCourseData.organiser}
                            <a
                                href={previewCourseData.url}
                                target="_blank"
                                className={`gap-1 flex items-center justify-center text-xs md:text-lg
                                    ${isDarkMode ? "text-zinc-200" : "text-zinc-600"}`}
                            >
                                <Link className="size-4" /> Link
                            </a>
                        </span>
                        <span className="flex-1 flex items-center justify-end gap-2 pr-0 md:pr-6 text-xs md:text-lg">
                            {previewCourseData.duration && (
                                <Clock className="size-4" />
                            )}
                            {previewCourseData.duration}
                        </span>
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-start gap-8 mb-12 text-xs md:text-lg">
                {previewCourseData.videoList && (
                    <span
                        className={`flex gap-2 items-center ${isDarkMode ? "text-stone-300" : "text-gray-700"}`}
                    >
                        <DraftingCompass className="size-4" />
                        Lectures: {previewCourseData.videoList.length}
                    </span>
                )}
                {previewCourseData.studyMaterials.length > 0 && (
                    <span
                        className={`flex gap-2 items-center ${isDarkMode ? "text-stone-300" : "text-gray-700"}`}
                    >
                        <BookText className="size-4" />
                        Materials: {previewCourseData.studyMaterials.length}
                    </span>
                )}
            </div>

            {/* videos */}
            <div
                className={`space-y-3 divide-y ${isDarkMode ? "divide-stone-700" : "divide-stone-200"}`}
            >
                {previewCourseData.videoList &&
                    previewCourseData.videoList.length > 0 &&
                    previewCourseData.videoList.map((item, index) => (
                        <a
                            data-videourl={previewCourseData.videoList.videoUrl}
                            href="#"
                            key={index}
                            className={`lecture_video flex items-center gap-4 p-3 rounded-lg
                                ${isDarkMode ? "hover:bg-stone-700" : "hover:bg-gray-100"}`}
                        >
                            <div className="overflow-hidden rounded-md w-32 h-20 shrink-0">
                                <img
                                    className="object-cover w-full h-full"
                                    src={item.videoThumbnailUrl}
                                    alt="Video Thumbnail"
                                />
                            </div>
                            <div className="flex-1">
                                <h2
                                    className={`text-md md:text-lg font-medium ${isDarkMode ? "text-stone-300" : "text-gray-700"}`}
                                >
                                    {item.videoTitle}
                                </h2>
                                <p
                                    className={`text-xs md:text-sm ${isDarkMode ? "text-stone-400" : "text-gray-500"}`}
                                >
                                    {item.videoDuration}
                                </p>
                            </div>
                        </a>
                    ))}
            </div>
        </div>
    );
};

export default CourseCard;
