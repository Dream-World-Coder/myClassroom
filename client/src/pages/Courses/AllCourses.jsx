/*
const [allCourses, setAllCourses] = useState([]);
// why it worked as soon as used useState([]) instead useState(null)?
// if type change was the problem then why error are working fine?
const [error, setError] = useState(null);
*/

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, User } from "lucide-react";
import Header from "../../components/Headers/Header";

export default function AllCourses({
    asComponent = false,
    parentDarkMode = true,
}) {
    const [isDarkMode, setIsDarkMode] = useState(
        () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
    );
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeLink, setActiveLink] = useState("My Courses");

    useEffect(() => {
        setIsDarkMode(JSON.parse(localStorage.getItem("isDarkModeOn")));
    }, [parentDarkMode]);

    useEffect(() => {
        const getAllCourses = async () => {
            try {
                const token = localStorage.getItem("token") || null;
                if (!token) {
                    console.error("\n\nAuthorisation token is NULL.");
                    return;
                }

                const response = await fetch(
                    `http://127.0.0.1:5050/api/v1/courses`,
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
                    throw new Error(
                        errorData.error || "Failed to fetch course data",
                    );
                }

                const data = await response.json();
                await setAllCourses(data.courses);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching course data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        getAllCourses();
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    if (error)
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Error: {error}
            </div>
        );

    return (
        <div
            className={`min-h-screen transition-colors duration-300 font-sans ${
                isDarkMode
                    ? "bg-black text-stone-100"
                    : "bg-gray-50 text-gray-800"
            }`}
        >
            {!asComponent && (
                <Header
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    activeLink={activeLink}
                    setActiveLink={setActiveLink}
                />
            )}

            <div
                className={`max-w-7xl mx-auto ${asComponent && "py-2 px-0"} ${!asComponent && "py-8 px-4"}`}
            >
                {!asComponent && (
                    <h1 className="text-3xl font-bold mb-8">My Courses</h1>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCourses.map((course, index) => (
                        <Card
                            key={index}
                            className={`overflow-hidden hover:shadow-lg transition-shadow border-none ${
                                isDarkMode ? "bg-[#111]" : "bg-white"
                            }`}
                        >
                            <a href={`/courses/${index + 1}`}>
                                <div
                                    className={`aspect-video w-full overflow-hidden ${
                                        isDarkMode
                                            ? "bg-stone-700"
                                            : "bg-stone-100"
                                    }`}
                                >
                                    <img
                                        src={course.courseThumbnail}
                                        alt={course.courseName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <CardHeader className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className={
                                                isDarkMode
                                                    ? "bg-stone-700"
                                                    : "bg-stone-100"
                                            }
                                        >
                                            Course
                                        </Badge>
                                    </div>
                                    <h3
                                        className={`text-xl font-semibold line-clamp-2 ${
                                            isDarkMode
                                                ? "text-stone-200"
                                                : "text-stone-900"
                                        }`}
                                    >
                                        {course.courseName}
                                    </h3>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <User
                                                size={16}
                                                className="text-stone-400"
                                            />
                                            <span
                                                className={
                                                    isDarkMode
                                                        ? "text-stone-400"
                                                        : "text-stone-600"
                                                }
                                            >
                                                {course.courseOrganiser}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock
                                                size={16}
                                                className="text-stone-400"
                                            />
                                            <span
                                                className={
                                                    isDarkMode
                                                        ? "text-stone-400"
                                                        : "text-stone-600"
                                                }
                                            >
                                                {course.courseDuration}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Progress
                                            value={parseInt(course.progress)}
                                            className={`h-2 ${isDarkMode ? "bg-stone-700" : "bg-stone-100"}`}
                                        />
                                        <div className="flex justify-between text-sm">
                                            <span
                                                className={
                                                    isDarkMode
                                                        ? "text-stone-400"
                                                        : "text-stone-600"
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
                                            className={
                                                isDarkMode
                                                    ? "text-lime-500"
                                                    : "text-lime-600"
                                            }
                                        />
                                        <span
                                            className={
                                                isDarkMode
                                                    ? "text-lime-500"
                                                    : "text-lime-600"
                                            }
                                        >
                                            {course.noOfLectures} lectures
                                        </span>
                                    </div>
                                    {course.courseMaterials.length > 0 && (
                                        <Badge
                                            variant="outline"
                                            className={
                                                isDarkMode
                                                    ? "border-stone-700"
                                                    : "border-stone-200"
                                            }
                                        >
                                            {course.courseMaterials.length}{" "}
                                            materials
                                        </Badge>
                                    )}
                                </CardFooter>
                            </a>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
