import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Clock,
  DraftingCompass,
  BookText,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import type { Course } from "@/components/types";
import { useDarkMode } from "@/contexts/ThemeContext";

interface CourseInfoHeaderType {
  courseData: Course;
  className?: string;
}

export const CourseInfoHeader = ({
  courseData,
  className = "",
}: CourseInfoHeaderType) => {
  const { isDarkMode } = useDarkMode();
  const defaultThumbnail: string = "/images/courseThumbnails/2.png";

  return (
    <div className={`p-4 ${className}`}>
      <div className="flex items-start gap-6 mb-8">
        <div className="overflow-hidden w-24 h-24 rounded-lg shrink-0">
          <img
            className="w-full h-full object-cover"
            src={courseData.courseThumbnail || defaultThumbnail}
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
              className={`${isDarkMode ? "bg-stone-700 hover:bg-stone-600 text-stone-200" : ""}`}
            >
              {courseData.courseOrganiser}
            </Badge>
            {courseData.courseUrl && (
              <div
                className={`inline-flex items-center gap-1 ${
                  isDarkMode ? "text-stone-300" : "text-stone-600"
                }`}
                onClick={() => {
                  navigator.clipboard.writeText(courseData.courseUrl);
                  toast.success("copied");
                }}
              >
                <Copy className="w-4 h-4" />
                YouTube Link
                <a href={courseData.courseUrl} target="_blank">
                  <ExternalLink className="size-4" />
                </a>
              </div>
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
};
