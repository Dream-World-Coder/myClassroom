import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, User } from "lucide-react";
import { toast } from "sonner";

import Header from "../../components/Headers/Header";
import { useDarkMode } from "@/contexts/ThemeContext";
import type { Course } from "@/components/types";

export default function AllCourses({
  asComponent = false,
}: {
  asComponent: boolean;
}) {
  const { isDarkMode } = useDarkMode();

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAllCourses = async () => {
      try {
        const token = localStorage.getItem("token") || null;
        if (!token) {
          console.error("\nAuthorisation token is NULL.");
          toast.error("some error occurred");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses`,
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
        setAllCourses(data.courses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(err instanceof Error ? err.message : "some error occurred");
        setLoading(false);
      }
    };

    getAllCourses();
  }, []);

  return (
    <div
      className={`min-h-screen pb-40 transition-colors duration-300 font-[poppins] ${
        isDarkMode ? "bg-[#111] text-stone-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      {!asComponent && <Header />}
      <div
        className={`max-w-7xl mx-auto ${asComponent && "py-2 px-0"} ${!asComponent && "py-8 px-4"}`}
      >
        {!asComponent && (
          <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        )}
        {loading && (
          <div className="flex items-center justify-center">Loading...</div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center text-red-500">
            Error: {error}
            <div className="text-green-500">
              First create one course here if not already:
              <a className="text-blue-500" href="/add-course">
                Create
              </a>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map((course, index) => (
            <Card
              key={index}
              className={`border border-transparent relative overflow-hidden hover:shadow-lg transition-shadow ${
                isDarkMode ? "bg-[#171717] border-[#222]" : "bg-white"
              }`}
            >
              <NavLink to={`/courses/${index + 1}`} className="">
                {course.courseThumbnail && (
                  <div
                    className={`aspect-video w-full overflow-hidden border-b ${isDarkMode ? "border-[#222]" : "border-gray-50"}`}
                  >
                    <img
                      src={course.courseThumbnail}
                      alt={course.courseName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <CardHeader className="space-y-2">
                  <h3
                    className={`text-xl font-semibold line-clamp-2 pt-3 ${
                      isDarkMode ? "text-stone-200" : "text-stone-900"
                    }`}
                  >
                    {course.courseName}
                  </h3>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <User size={16} className="text-stone-400" />
                      <span
                        className={
                          isDarkMode ? "text-stone-400" : "text-stone-600"
                        }
                      >
                        {course.courseOrganiser}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-stone-400" />
                      <span
                        className={
                          isDarkMode ? "text-stone-400" : "text-stone-600"
                        }
                      >
                        {course.courseDuration}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress
                      value={parseInt(course?.progress?.slice(0, -1) || "0")}
                      className={`h-2 ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`}
                    />

                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          isDarkMode ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        {course.progress} Complete
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm">
                    <BookOpen
                      size={16}
                      className={isDarkMode ? "text-lime-500" : "text-lime-600"}
                    />
                    <span
                      className={isDarkMode ? "text-lime-500" : "text-lime-600"}
                    >
                      {course.noOfLectures} lectures
                    </span>
                  </div>
                  {course.courseMaterials.length > 0 && (
                    <Badge
                      variant="outline"
                      className={
                        isDarkMode ? "border-stone-700" : "border-stone-200"
                      }
                    >
                      {course.courseMaterials.length} materials
                    </Badge>
                  )}
                </CardFooter>
              </NavLink>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
