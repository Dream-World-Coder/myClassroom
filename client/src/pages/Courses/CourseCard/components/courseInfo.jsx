import { Badge } from "@/components/ui/badge";
import { Link, Clock, DraftingCompass, BookText } from "lucide-react";
import PropTypes from "prop-types";

export const CourseInfo = ({ isDarkMode, courseData, className = "" }) => (
  <div className={`p-4 ${className}`}>
    <div className="flex items-start gap-6 mb-8">
      <div className="overflow-hidden w-24 h-24 rounded-lg shrink-0">
        <img
          className="w-full h-full object-cover"
          src={courseData.courseThumbnail || "/images/courseThumbnails/2.jpg"}
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
            className={
              isDarkMode ? "bg-stone-700 text-stone-200" : "bg-gray-200"
            }
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
    <div
      className={`flex flex-wrap gap-4 mb-4 pb-2 border-b
      ${isDarkMode ? "border-stone-700" : ""}`}
    >
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

CourseInfo.propTypes = {
  isDarkMode: PropTypes.bool,
  courseData: PropTypes.object,
  className: PropTypes.string,
};
