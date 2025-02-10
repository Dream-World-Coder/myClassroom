import { useState, useEffect } from "react";
import { Target, Plus, Trash2, ListTodo, TrendingUp } from "lucide-react";
import Header from "../../components/Headers/Header";
import { useAuth } from "../../contexts/AuthContext";
import AllCourses from "../Courses/AllCourses";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
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
    const [date, setDate] = useState(new Date());
    const [activeLink, setActiveLink] = useState("Home");
    const { user, token } = useAuth();

    // Sample data for the videos watched graph
    const videoData = [
        { day: "Monday", lectures: 4, practice: 2 },
        { day: "Tuesday", lectures: 3, practice: 3 },
        { day: "Wednesday", lectures: 5, practice: 4 },
        { day: "Thursday", lectures: 2, practice: 2 },
        { day: "Friday", lectures: 6, practice: 3 },
        { day: "Saturday", lectures: 1, practice: 1 },
        { day: "Sunday", lectures: 3, practice: 2 },
    ];

    const chartConfig = {
        lectures: {
            label: "Lecture Videos",
            color: "hsl(var(--chart-1))",
        },
        practice: {
            label: "Practice Videos",
            color: "hsl(var(--chart-2))",
        },
    };

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

    let asd =
        "https://rr3---sn-qxaelnel.googlevideo.com/videoplayback?expire=1739184604&ei=fIWpZ5jKDs6RssUPpJLF-Qc&ip=2405%3A201%3A800f%3A6841%3Aecbb%3A2726%3A173e%3A5a28&id=o-AIJ4Cijptgof3vGLQs750bSikxPN_dzgstvsEWfufPjG&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AUWDL3zXdOqvM0MqTjCi0ECVMfPgYbh7SElCedy0QMto8r8nGfKzOloTr7ts_xdUczC2PHzEeJl9sPhr&spc=RjZbSa67E2-jJR-U4aMHPSHJwJZCnU5QVcuwqsfv9G4HW5yZzuaydeWnxdZgAjMYWQ&vprv=1&svpuc=1&mime=video%2Fmp4&ns=BfFD40juQQV4xZNXC3B_FEsQ&rqh=1&cnr=14&ratebypass=yes&dur=1607.888&lmt=1708716558756126&lmw=1&fexp=24350590,24350737,24350827,24350934,24350961,24350977,24351028,24351059,24351082,51326932,51371294&c=TVHTML5&sefc=1&txp=4438434&n=WnaZ8Cb6QIBXYQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRAIgR8C-NHDx5unH-yALMUDWBFiVa-pXWDqIkWh_Mn7u-7MCIDZFX128Jp6r1IfcLZR3-Kh20K6HAwBS1zRckHbJXEU6&redirect_counter=1&cm2rm=sn-gwpa-itqed7z&rrc=80&req_id=ec51608c02b3a3ee&cms_redirect=yes&cmsv=e&met=1739163023,&mh=I3&mm=29&mn=sn-qxaelnel&ms=rdu&mt=1739162689&mv=m&mvi=3&pl=51&rms=rdu,au&lsparams=met,mh,mm,mn,ms,mv,mvi,pl,rms&lsig=AGluJ3MwRAIgc_APb2F6EX9ZtDjYgY_2c0qJM1dXxU_teTK5p5i3faACIAQVXCHcRcqI9t1A7W9Ji1QV5j8TSDZl5tNRV7FLUqgB";

    return (
        <div
            className={`min-h-screen font-[poppins] ${highContrast ? "invert" : "invert-0"}  transition-all duration-300
                ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"}`}
        >
            <Header
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
            />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <section className="mb-20 transition-all duration-300">
                    <h2
                        className={`text-2xl font-semibold mb-2 md:mb-4 ${isDarkMode ? "text-stone-200" : ""}`}
                    >
                        Continue Learning
                        <audio
                            className="bg-red h-10 block z-50"
                            preload="auto"
                            autoPlay
                            muted="False"
                        >
                            <source src={asd} type="audio/mp3" />
                        </audio>
                    </h2>
                    <div
                        className={`border rounded-lg ${isDarkMode ? "bg-[#111] border-[#222]" : "bg-white border-gray-200"}`}
                    >
                        <div className="flex items-start gap-6 p-6">
                            <div
                                className={`h-24 w-24 rounded-md overflow-hidden flex items-center justify-center ${isDarkMode ? "bg-stone-700" : "bg-stone-100"}`}
                            >
                                <img src={"https://picsum.photos/200"} alt="" />
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

                <section
                    className="mb-4 flex flex-col-reverse md:flex-row items-start justify-center
                    gap-12 md:gap-4 transition-all duration-300"
                >
                    <Card
                        className={`flex-1 size-full border-none ${isDarkMode ? "bg-[#111]" : "bg-white"} `}
                    >
                        <CardHeader
                            className={`text-xl font-semibold ${isDarkMode ? "text-stone-200" : ""}`}
                        >
                            <CardTitle className="flex justify-start items-center gap-2">
                                <ListTodo className="size-6" /> Today&apos;s
                                Goals
                            </CardTitle>
                            <CardDescription className="font-light">
                                Set to-do tasks and complete timely
                            </CardDescription>
                        </CardHeader>
                        <CardContent
                            className={`px-2 md:px-6 pt-0 pb-2 md:pb-6`}
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
                                            ? "border-stone-800 bg-[#111]"
                                            : "border-gray-200"
                                    }`}
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-lime-500 hover:bg-lime-700 text-white rounded-lg cursor-pointer"
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
                                            className="h-5 w-5 rounded-lg border-gray-300 text-lime-500 focus:ring-lime-500"
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
                        </CardContent>
                    </Card>

                    <Card
                        className={`size-full md:w-[33%] border-none ${isDarkMode ? "bg-[#111]" : "bg-white"}`}
                    >
                        <CardHeader
                            className={`text-xl font-semibold ${isDarkMode ? "text-stone-200" : ""}`}
                        >
                            <CardTitle className="flex justify-start items-center gap-2">
                                <Target className="size-6" /> Remainders
                            </CardTitle>
                            <CardDescription className="font-light">
                                Important Remainders
                            </CardDescription>
                        </CardHeader>
                        <CardContent
                            className={`px-2 md:px-6 pt-0 pb-2 md:pb-6`}
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
                                            ? "border-stone-800 bg-[#111]"
                                            : "border-gray-200"
                                    }`}
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-lime-500 hover:bg-lime-700 text-white rounded-lg cursor-pointer"
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
                                            className="h-5 w-5 rounded-lg border-gray-300 text-lime-500 focus:ring-lime-500"
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
                        </CardContent>
                    </Card>
                </section>

                {/* calander: attandance tracker */}
                {/* adjustable grid of: daily videos watched graph & attendance calendar */}
                {!!user && !!token && (
                    <section className="w-full space-y-6 mb-20">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Attendance Calendar Card */}
                            <Card
                                className={`border-none ${isDarkMode ? "bg-[#111]" : "bg-white"}`}
                            >
                                <CardHeader>
                                    <CardTitle>Attendance Tracker</CardTitle>
                                    <CardDescription className="font-light">
                                        Track your daily attendance
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border-none"
                                        classNames={{
                                            day_selected:
                                                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                            day_today:
                                                "bg-accent text-accent-foreground",
                                        }}
                                    />
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-2 text-sm">
                                    <div className="leading-none text-muted-foreground">
                                        Click on a date to mark attendance
                                    </div>
                                </CardFooter>
                            </Card>

                            {/* Videos Watched Graph Card */}
                            <Card
                                className={`border-none ${isDarkMode ? "bg-[#111]" : "bg-white"}`}
                            >
                                <CardHeader>
                                    <CardTitle>Lectures Watched</CardTitle>
                                    <CardDescription className="font-light">
                                        Weekly Progress
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig}>
                                        <BarChart data={videoData}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="day"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    value.slice(0, 3)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent indicator="dashed" />
                                                }
                                            />
                                            <Bar
                                                dataKey="lectures"
                                                fill="var(--color-lectures)"
                                                radius={4}
                                            />
                                            <Bar
                                                dataKey="practice"
                                                fill="var(--color-practice)"
                                                radius={4}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-2 text-sm">
                                    <div className="flex gap-2 font-medium leading-none">
                                        Weekly progress up by 12%{" "}
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div className="leading-none text-muted-foreground">
                                        Showing lecture and practice videos
                                        watched this week
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </section>
                )}

                {!!user && !!token && (
                    <section>
                        <h2
                            className={`text-2xl font-semibold mb-2 ${isDarkMode ? "text-stone-200" : ""}`}
                        >
                            All Courses
                        </h2>

                        {/* only if logged in */}
                        <AllCourses
                            asComponent={true}
                            parentDarkMode={isDarkMode}
                        />
                    </section>
                )}
            </main>

            <a
                href="/add-course"
                className={`fixed right-4 md:right-20 bottom-6 md:bottom-10 rounded-full flex items-center justify-center gap-2
                    box-content px-4 py-4 md:px-3 md:py-1 text-black text-sm md:text-lg
                    ${isDarkMode ? "bg-lime-500 text-black" : "bg-lime-500 text-white"}`}
            >
                <Plus className="size-5" />{" "}
                <span className="hidden md:block">add new course</span>
            </a>
        </div>
    );
};

export default HomeDashboard;
