import { useState, useEffect, memo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "../../contexts/AuthContext";
import { useDarkMode } from "@/contexts/ThemeContext";
import Header from "../../components/Headers/Header";
import CourseCard from "./CourseCard/CourseCard";

import type { Course } from "@/components/types";

/**
 * Page to show a single course details
 * route path: /courses/:courseId
 */

const CoursePage = memo(function CoursePage() {
  const { isDarkMode } = useDarkMode();
  const { courseId } = useParams();
  const { token } = useAuth();

  const [courseData, setCourseData] = useState<Course>({
    courseName: "",
    courseUrl: "",
    progress: "",
    videos: [],
    noOfLectures: 0,
    courseOrganiser: "",
    courseDuration: "",
    courseMaterials: [],
    courseThumbnail: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCourseData = async () => {
      try {
        if (!token) {
          toast.error("Some Error Occurred");
          console.error("Authorisation token is NULL.");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/${courseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch course data");
        }

        const data = await response.json();
        setCourseData(data.courseData);
      } catch (err) {
        console.error("Error fetching course data:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    getCourseData();
  }, [courseId, token]);

  if (loading) {
    return "Loading...";
  }
  if (error) {
    return `Some Error Occurred... ${error}`;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-[poppins]
                ${
                  isDarkMode
                    ? "bg-[#111] text-stone-100"
                    : "bg-gray-50 text-neutral-800"
                }`}
    >
      <Header />
      <CourseCard courseData={courseData} rounded="" />
    </div>
  );
});

export default CoursePage;
