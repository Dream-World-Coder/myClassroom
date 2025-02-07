import { useState, useEffect } from "react";
import {
    BookOpen,
    Target,
    GraduationCap,
    Plus,
    Trash2,
    ListTodo,
} from "lucide-react";
import courses from "../../assets/Courses";
import Header from "../../components/Headers/Header";

// + attendance tracker
// add  a powerful notes section for better oraganising study materials

const HomeDashboard = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
    );
    const [highContrast, setHighContrast] = useState(null);
    const [goals, setGoals] = useState(() => {
        const savedGoals = localStorage.getItem("studyGoals");
        return savedGoals ? JSON.parse(savedGoals) : [];
    });
    const [newGoal, setNewGoal] = useState("");
    const [activeLink, setActiveLink] = useState("Home");

    useEffect(() => {
        localStorage.setItem("studyGoals", JSON.stringify(goals));
    }, [goals]);

    const addGoal = (e) => {
        e.preventDefault();
        if (!newGoal.trim()) return;
        setGoals([...goals, { id: Date.now(), task: newGoal, done: false }]);
        setNewGoal("");
    };

    const toggleGoal = (id) => {
        setGoals(
            goals.map((goal) =>
                goal.id === id ? { ...goal, done: !goal.done } : goal,
            ),
        );
    };

    const deleteGoal = (id) => {
        setGoals(goals.filter((goal) => goal.id !== id));
    };

    const [remainders, setRemainders] = useState(() => {
        const savedRemainders = localStorage.getItem("studyRemainders");
        return savedRemainders ? JSON.parse(savedRemainders) : [];
    });
    const [newRemainder, setNewRemainder] = useState("");
    useEffect(() => {
        localStorage.setItem("studyRemainders", JSON.stringify(remainders));
    }, [remainders]);

    const addRemainder = (e) => {
        e.preventDefault();
        if (!newRemainder.trim()) return;
        setRemainders([
            ...remainders,
            { id: Date.now(), task: newRemainder, done: false },
        ]);
        setNewRemainder("");
    };

    const toggleRemainder = (id) => {
        setRemainders(
            remainders.map((remainder) =>
                remainder.id === id
                    ? { ...remainder, done: !remainder.done }
                    : remainder,
            ),
        );
    };

    const deleteRemainder = (id) => {
        setRemainders(remainders.filter((remainder) => remainder.id !== id));
    };

    useEffect(() => {
        document.body.classList.toggle("dark-mode", isDarkMode);
    }, [isDarkMode]);

    return (
        <div
            className={`min-h-screen font-[poppins] ${highContrast ? "invert" : "invert-0"} ${isDarkMode ? "bg-stone-900 text-white" : "bg-gray-50"}`}
        >
            <Header
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
            />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <section className="mb-12">
                    <h2
                        className={`text-xl font-semibold mb-2 md:mb-6 ${isDarkMode ? "text-stone-200" : ""}`}
                    >
                        Continue Learning
                    </h2>
                    <div
                        className={`border rounded-xs ${isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-gray-200"}`}
                    >
                        <div className="flex items-start gap-6 p-6">
                            <div
                                className={`h-24 w-24 rounded-xs flex items-center justify-center ${isDarkMode ? "bg-stone-700" : "bg-stone-100"}`}
                            >
                                <BookOpen
                                    size={48}
                                    className={
                                        isDarkMode
                                            ? "text-stone-400"
                                            : "text-stone-600"
                                    }
                                />
                            </div>
                            <div className="flex-1">
                                <div
                                    className={`flex items-center gap-2 text-sm mb-1 ${isDarkMode ? "text-stone-400" : "text-gray-600"}`}
                                >
                                    <span>Course</span>
                                    <span>•</span>
                                    <span>Princeton University</span>
                                </div>
                                <h3
                                    className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-stone-200" : ""}`}
                                >
                                    Algorithms, Part I
                                </h3>
                                <div
                                    className={`h-1 w-full rounded-full overflow-hidden mb-2 ${isDarkMode ? "bg-stone-700" : "bg-stone-100"}`}
                                >
                                    <div
                                        className="h-full bg-lime-500 rounded-full"
                                        style={{ width: "65%" }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span
                                        className={
                                            isDarkMode
                                                ? "text-stone-400"
                                                : "text-gray-600"
                                        }
                                    >
                                        65% Complete
                                    </span>
                                    <button
                                        className={
                                            isDarkMode
                                                ? "text-lime-500"
                                                : "text-lime-600"
                                        }
                                    >
                                        Continue Learning
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12 flex flex-col-reverse md:flex-row items-start justify-center gap-12 md:gap-4">
                    <div className="flex-1 size-full">
                        <h2
                            className={`text-xl font-semibold mb-2 md:mb-6 flex justify-start items-center gap-2 ${isDarkMode ? "text-stone-200" : ""}`}
                        >
                            <ListTodo className="size-6" /> Today&apos;s Goals
                        </h2>
                        <div
                            className={`border rounded-xs p-2 md:p-6 ${isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-gray-200"}`}
                        >
                            <form
                                onSubmit={addGoal}
                                className="flex justify-between gap-2 mb-3 md:mb-6"
                            >
                                <input
                                    type="text"
                                    value={newGoal}
                                    onChange={(e) => setNewGoal(e.target.value)}
                                    placeholder="Add a new goal..."
                                    className={`flex-1 max-w-[80%] px-4 py-2 text-sm md:text-base border rounded-sm focus:outline-hidden focus:ring-1 focus:ring-lime-500 ${
                                        isDarkMode
                                            ? "border-stone-700 bg-stone-800"
                                            : "border-gray-200"
                                    }`}
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-lime-500 text-white rounded-xs"
                                >
                                    <Plus size={20} />
                                </button>
                            </form>
                            <div
                                className={`space-y-4 divide-y ${isDarkMode ? "divide-stone-700" : "divide-stone-200"}`}
                            >
                                {goals.map((goal) => (
                                    <div
                                        key={goal.id}
                                        className="flex items-center gap-4"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={goal.done}
                                            onChange={() => toggleGoal(goal.id)}
                                            className="h-5 w-5 rounded-xs border-gray-300 text-lime-500 focus:ring-lime-500"
                                        />
                                        <span
                                            className={`flex-1 ${
                                                goal.done
                                                    ? `line-through ${isDarkMode ? "text-stone-500" : "text-gray-400"}`
                                                    : isDarkMode
                                                      ? "text-stone-200"
                                                      : ""
                                            }`}
                                        >
                                            {goal.task}
                                        </span>
                                        <button
                                            onClick={() => deleteGoal(goal.id)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="size-full md:w-[33%]">
                        <h2
                            className={`text-xl font-semibold mb-2 md:mb-6 flex justify-start items-center gap-2 ${isDarkMode ? "text-stone-200" : ""}`}
                        >
                            <Target className="size-6" /> Remainders
                        </h2>
                        <div
                            className={`border rounded-xs p-2 md:p-6 ${isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-gray-200"}`}
                        >
                            <form
                                onSubmit={addRemainder}
                                className="flex justify-between gap-2 mb-3 md:mb-6"
                            >
                                <input
                                    type="text"
                                    value={newRemainder}
                                    onChange={(e) =>
                                        setNewRemainder(e.target.value)
                                    }
                                    placeholder="Add remainder eg. next exam date."
                                    className={`flex-1 max-w-[80%] px-4 py-2 text-sm md:text-base border rounded-sm focus:outline-hidden focus:ring-1 focus:ring-lime-500 ${
                                        isDarkMode
                                            ? "border-stone-700 bg-stone-800"
                                            : "border-gray-200"
                                    }`}
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-lime-500 text-white rounded-xs"
                                >
                                    <Plus size={20} />
                                </button>
                            </form>
                            <div
                                className={`space-y-4 divide-y ${isDarkMode ? "divide-stone-700" : "divide-stone-200"}`}
                            >
                                {remainders.map((remainder) => (
                                    <div
                                        key={remainder.id}
                                        className="flex items-center gap-4"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={remainder.done}
                                            onChange={() =>
                                                toggleRemainder(remainder.id)
                                            }
                                            className="h-5 w-5 rounded-xs border-gray-300 text-lime-500 focus:ring-lime-500"
                                        />
                                        <span
                                            className={`flex-1 ${
                                                remainder.done
                                                    ? `line-through ${isDarkMode ? "text-stone-500" : "text-gray-400"}`
                                                    : isDarkMode
                                                      ? "text-stone-200"
                                                      : ""
                                            }`}
                                        >
                                            {remainder.task}
                                        </span>
                                        <button
                                            onClick={() =>
                                                deleteRemainder(remainder.id)
                                            }
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2
                        className={`text-xl font-semibold mb-6 ${isDarkMode ? "text-stone-200" : ""}`}
                    >
                        All Courses
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className={`border rounded-xs ${isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-gray-200"}`}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <GraduationCap
                                            size={24}
                                            className={
                                                isDarkMode
                                                    ? "text-stone-400"
                                                    : "text-stone-600"
                                            }
                                        />
                                        <span
                                            className={
                                                isDarkMode
                                                    ? "text-stone-400"
                                                    : "text-gray-600"
                                            }
                                        >
                                            {course.duration}
                                        </span>
                                    </div>
                                    <h3
                                        className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-stone-200" : ""}`}
                                    >
                                        {course.title}
                                    </h3>
                                    <p
                                        className={`text-sm mb-4 ${isDarkMode ? "text-stone-400" : "text-gray-600"}`}
                                    >
                                        by {course.provider}
                                    </p>
                                    <div
                                        className={`h-1 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-stone-700" : "bg-stone-100"}`}
                                    >
                                        <div
                                            className="h-full bg-lime-500 rounded-full"
                                            style={{
                                                width: `${course.progress}%`,
                                            }}
                                        />
                                    </div>
                                    <div
                                        className={`mt-2 text-sm ${isDarkMode ? "text-stone-400" : "text-gray-600"}`}
                                    >
                                        {course.progress}% Complete
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <a
                href="/add-course"
                className={`fixed right-4 md:right-20 bottom-6 md:bottom-10 rounded-full flex items-center justify-center gap-2
                    box-content px-4 py-4 md:px-3 md:py-1 text-black text-sm md:text-lg
                    ${isDarkMode ? "bg-lime-500 text-black" : "bg-lime-600 text-white"}`}
            >
                <Plus className="size-5" />{" "}
                <span className="hidden md:block">add new course</span>
            </a>
        </div>
    );
};

export default HomeDashboard;
