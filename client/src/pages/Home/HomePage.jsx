import { useState, useEffect } from "react";
import { Target, Plus, Trash2, ListTodo, ChevronRight } from "lucide-react";
import Header from "../../components/Headers/Header";
import { Graph } from "./Graph";
import { useAuth } from "../../contexts/AuthContext";
import AllCourses from "../Courses/AllCourses";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import note from "./note.svg";

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
        {!!user && !!token ? (
          <section className="mb-20 transition-all duration-300 cursor-pointer">
            <h2
              className={`text-2xl font-semibold mb-2 md:mb-4 ${isDarkMode ? "text-stone-200" : ""}`}
            >
              Continue Learning
            </h2>
            <div
              className={`border rounded-lg ${isDarkMode ? "bg-[#111] border-[#222]" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-start gap-6 p-6">
                <div
                  className={`h-24 w-24 rounded-md overflow-hidden flex items-center justify-center ${isDarkMode ? "bg-stone-700" : "bg-stone-100"}`}
                >
                  <img src="/images/courseThumbnails/2.jpg" alt="" />
                </div>
                <div className="flex-1">
                  <div
                    className={`flex items-center gap-2 text-sm mb-1 ${isDarkMode ? "text-stone-400" : "text-gray-600"}`}
                  >
                    <span>Lecture {12}</span>
                    <span>•</span>
                    <Badge>Prof Kamla krithivasan</Badge>
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-stone-200" : ""}`}
                  >
                    Automata Theory
                    {/* algorithms by prinstone */}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <button
                      className={isDarkMode ? "text-lime-500" : "text-lime-600"}
                    >
                      Continue Lecture
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="">
            <div className="flex items-center justify-start gap-8 group">
              <div className="size-40">
                <img src={note} alt="" className={isDarkMode ? "invert" : ""} />
              </div>

              <NavLink
                to="/login"
                className={`text-2xl underline decoration-dashed group-hover:decoration-solid underline-offset-2
                  flex justify-center items-center ${isDarkMode ? "bg-lime-800" : "bg-lime-300"} rounded-2xl px-3 py-1`}
              >
                Login{" "}
                <ChevronRight
                  className="transform duration-200 transition-all group-hover:translate-x-2"
                  size={20}
                />
              </NavLink>
            </div>
          </section>
        )}

        {!!user && !!token && (
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
                  <ListTodo className="size-6" /> Today&apos;s Goals
                </CardTitle>
                <CardDescription className="font-light">
                  Set to-do tasks and complete timely
                </CardDescription>
              </CardHeader>
              <CardContent className={`px-2 md:px-6 pt-0 pb-2 md:pb-6`}>
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
                    <div key={goal.id} className="flex items-center gap-4">
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
              <CardContent className={`px-2 md:px-6 pt-0 pb-2 md:pb-6`}>
                <form
                  onSubmit={addRemainder}
                  className="flex justify-between gap-2 mb-3 md:mb-6"
                >
                  <input
                    type="text"
                    value={newRemainder}
                    onChange={(e) => setNewRemainder(e.target.value)}
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
                    <div key={remainder.id} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={remainder.done}
                        onChange={() => toggleRemainder(remainder.id)}
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
                        onClick={() => deleteRemainder(remainder.id)}
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
        )}

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
                      day_today: "bg-accent text-accent-foreground",
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
              <Graph isDarkMode={isDarkMode} />
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
            <AllCourses asComponent={true} parentDarkMode={isDarkMode} />
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
