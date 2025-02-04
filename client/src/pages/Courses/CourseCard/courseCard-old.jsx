import React from "react";
import { Link, Clock, Play, BookText, DraftingCompass } from "lucide-react";

// + bg-color attribute in courses

const CourseCard = ({
    isDarkMode,
    previewCourseData,
    courseThumbnail,
    progress,
}) => {
    return (
        <div
            className={`relative size-full p-4 rounded-md ${isDarkMode ? "bg-stone-700" : "bg-gray-200"}`}
        >
            <div className="flex items-center justify-start gap-6 mb-8">
                <div className="overflow-hidden size-24 rounded-lg">
                    <img
                        className="object-cover block rounded-lg"
                        src={courseThumbnail}
                        alt=""
                    />
                </div>
                <div className="flex-1">
                    <h1
                        className={`text-4xl font-serif font-semibold mb-4 ${isDarkMode ? "text-stone-300" : "text-gray-700"}`}
                    >
                        {previewCourseData.name}
                    </h1>
                    <p className="flex items-center justify-start text-md w-full">
                        <span className="flex items-center justify-center gap-6">
                            {previewCourseData.organiser}
                            <a
                                href={previewCourseData.url}
                                target="_blank"
                                className="gap-1 flex items-center justify-center"
                            >
                                <Link className="size-4" /> Link
                            </a>
                        </span>
                        <span className="flex-1 flex items-center justify-end gap-2 pr-6">
                            {previewCourseData.duration && (
                                <Clock className="size-4" />
                            )}
                            {previewCourseData.duration}
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-start gap-8 mb-12">
                {previewCourseData.videoList && (
                    <span className="flex gap-2 items-center">
                        <DraftingCompass className="size-4" />
                        Lectures: {previewCourseData.videoList.length}
                    </span>
                )}
                {previewCourseData.studyMaterials.length > 0 && (
                    <span className="flex gap-2 items-center">
                        <BookText className="size-4" />
                        {/* `font-semibold ${isDarkMode ? "text-stone-300" : "text-gray-700"}` */}
                        Materials: {previewCourseData.studyMaterials.length}
                    </span>
                )}
            </div>

            {/* videos */}
            <div className="space-y-3">
                {previewCourseData.videoList.length > 0 &&
                    previewCourseData.videoList.map((item, index) => (
                        <a href="#" key={index} className="">
                            {/* thumbnail */}
                            <div className="overflow-hidden rounded-md">
                                <img
                                    className="object-cover"
                                    src={item.videoThumbnailUrl}
                                    alt=""
                                />
                            </div>

                            {/* title */}
                            <div className="">{item.videoTitle}</div>

                            {/* duration */}
                            <div className="">{item.videoDuration}</div>
                        </a>
                    ))}
            </div>
        </div>
    );
};

export default CourseCard;
