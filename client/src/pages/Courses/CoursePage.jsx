import { useState, useEffect } from "react";
// import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Headers/Header";
import CourseCard from "./CourseCard/Course";
import { useParams } from "react-router-dom";

const CoursePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
    );
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeLink, setActiveLink] = useState("My Courses");
    // const { getToken } = useAuth(); // Assuming you have a method to get JWT token

    const getCourseData = async () => {
        try {
            // Get the JWT token from auth context
            // const token = await getToken();
            const token = localStorage.getItem("token") || null;
            if (!token) {
                console.error("\n\nAuthorisation token is NULL.");
                return;
            }

            const response = await fetch(
                `http://127.0.0.1:5050/api/v1/courses/${courseId}`,
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
            setCourseData(data.courseData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching course data:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        getCourseData();
    }, [courseId]);

    if (loading) {
        return "Loading...";
    }
    if (error) {
        return `error... ${error}`;
    }

    return (
        <div
            className={`min-h-screen transition-colors duration-300 font-[poppins]
                ${
                    isDarkMode
                        ? "bg-[#111] text-stone-100"
                        : "bg-gray-50 text-gray-800"
                }`}
        >
            <Header
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
            />
            <CourseCard
                isDarkMode={isDarkMode}
                courseData={courseData}
                rounded=""
            />
        </div>
    );
};

export default CoursePage;
