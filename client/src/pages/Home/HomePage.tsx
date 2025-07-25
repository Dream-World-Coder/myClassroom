import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import { Target, Plus, Trash2, ListTodo, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import "react-calendar-heatmap/dist/styles.css";
import { subMonths, endOfToday } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Header from "../../components/Headers/Header";
import AllCourses from "../Courses/AllCourses";
import { useAuth } from "../../contexts/AuthContext";
import { useDarkMode } from "@/contexts/ThemeContext";
import type { Goal, Remainder } from "@/components/types";

import note from "./note.svg";

// to-do: add a powerful notes section for better organising study materials

const HomeDashboard = () => {
  const { isDarkMode } = useDarkMode();
  const { isAuthenticated } = useAuth();

  /**
   * Goals
   */
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem("studyGoals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [newGoal, setNewGoal] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("studyGoals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setGoals([...goals, { id: Date.now(), task: newGoal, done: false }]);
    setNewGoal("");
  };
  const toggleGoal = (id: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, done: !goal.done } : goal,
      ),
    );
  };
  const deleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  /**
   * Remainders
   */
  const [remainders, setRemainders] = useState<Remainder[]>(() => {
    const savedRemainders = localStorage.getItem("studyRemainders");
    return savedRemainders ? JSON.parse(savedRemainders) : [];
  });
  const [newRemainder, setNewRemainder] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("studyRemainders", JSON.stringify(remainders));
  }, [remainders]);

  const addRemainder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemainder.trim()) return;
    setRemainders([
      ...remainders,
      { id: Date.now(), task: newRemainder, done: false },
    ]);
    setNewRemainder("");
  };
  const toggleRemainder = (id: number) => {
    setRemainders(
      remainders.map((remainder) =>
        remainder.id === id
          ? { ...remainder, done: !remainder.done }
          : remainder,
      ),
    );
  };
  const deleteRemainder = (id: number) => {
    setRemainders(remainders.filter((remainder) => remainder.id !== id));
  };

  /**
   * Heatmap
   */
  const today = endOfToday();
  const startDate = subMonths(today, 13);

  const sampleData = [
    { date: "2025-06-12", count: 5 },
    { date: "2025-06-13", count: 3 },
    { date: "2025-06-14", count: 8 },
    { date: "2025-06-15", count: 2 },
    { date: "2025-06-16", count: 6 },
    { date: "2025-06-17", count: 7 },
    { date: "2025-06-18", count: 4 },
    { date: "2025-06-19", count: 9 }, // streak of 8 ends here

    // break: 2025-06-20, 21

    { date: "2025-06-22", count: 2 },
    { date: "2025-06-23", count: 5 },
    { date: "2025-06-24", count: 1 },

    // break: 2025-06-25

    { date: "2025-06-26", count: 3 },
    { date: "2025-06-27", count: 7 },
    { date: "2025-06-28", count: 6 },

    // break: 2025-06-29, 30

    { date: "2025-07-01", count: 10 },
    { date: "2025-07-02", count: 3 },
    { date: "2025-07-03", count: 8 },
    { date: "2025-07-04", count: 4 },

    // break: 2025-07-05

    { date: "2025-07-06", count: 6 },
    { date: "2025-07-07", count: 2 },

    // break: 2025-07-08 to 2025-07-10

    { date: "2025-07-11", count: 9 },
    { date: "2025-07-12", count: 11 },
    { date: "2025-07-13", count: 5 },

    // break: 2025-07-14

    { date: "2025-07-15", count: 7 },
    { date: "2025-07-16", count: 3 },
    { date: "2025-07-17", count: 4 },
    { date: "2025-07-18", count: 6 },
    { date: "2025-07-19", count: 1 },

    // break: 2025-07-20

    { date: "2025-07-21", count: 5 },
  ];

  return (
    <div
      className={`min-h-screen font-[poppins] transition-all duration-300
        ${isDarkMode ? "bg-[#111] text-white" : "bg-gray-50 text-black"}`}
    >
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAuthenticated ? (
          <section className="mb-20 transition-all duration-300 cursor-pointer">
            <h2
              className={`text-2xl font-semibold mb-2 md:mb-4 ${isDarkMode ? "text-stone-200" : ""}`}
            >
              Continue Learning
            </h2>
            <div
              className={`border rounded-lg ${isDarkMode ? "bg-[#171717] border-[#222]" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-start gap-6 p-6">
                <div
                  className={`h-24 w-24 rounded-md overflow-hidden flex items-center justify-center ${isDarkMode ? "bg-stone-700" : "bg-stone-100"}`}
                >
                  <img src="/images/courseThumbnails/2.png" alt="" />
                </div>
                <div className="flex-1">
                  <div
                    className={`flex flex-col md:flex-row items-start md:items-center gap-2 text-sm mb-1 ${isDarkMode ? "text-stone-400" : "text-gray-600"}`}
                  >
                    <span>Lecture {12}</span>
                    <span className="hidden md:block">•</span>
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

        {isAuthenticated && (
          <section
            className="mb-4 flex flex-col-reverse md:flex-row items-start justify-center
                    gap-12 md:gap-4 transition-all duration-300"
          >
            <Card
              className={`flex-1 size-full border-none ${isDarkMode ? "bg-[#171717]" : "bg-white"} `}
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
                        ? "border-neutral-800 bg-[#111]"
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
              className={`size-full md:w-[33%] border-none ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}
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
                        ? "border-neutral-800 bg-[#111]"
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
        {isAuthenticated && (
          <section className="w-full space-y-6 mb-20">
            {/* <div className="grid gap-4 md:grid-cols-2"> */}
            <Card
              className={`border-none ${isDarkMode ? "bg-[#171717]" : "bg-white"}`}
            >
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
                <CardDescription className="font-light">
                  Track your daily attendance
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <CalendarHeatmap
                  startDate={startDate}
                  endDate={today}
                  values={sampleData}
                  classForValue={(value) => {
                    if (!value || value.count === 0) return "color-empty";
                    if ((value.count ?? 0) < 3) return "color-scale-1";
                    if ((value.count ?? 0) < 5) return "color-scale-2";
                    return "color-scale-3";
                  }}
                  tooltipDataAttrs={(value) => {
                    if (!value || !value.date) return {};
                    return {
                      "data-tooltip": `${value.date} – ${value.count} contributions`,
                    };
                  }}
                  showWeekdayLabels
                />
              </CardContent>
            </Card>

            {/* Graph */}
            {/* </div> */}
          </section>
        )}

        {isAuthenticated && (
          <section>
            <h2
              className={`text-2xl font-semibold mb-2 ${isDarkMode ? "text-stone-200" : ""}`}
            >
              All Courses
            </h2>

            <AllCourses asComponent={true} />
          </section>
        )}
      </main>

      <NavLink
        to="/add-course"
        className={`fixed right-4 md:right-20 bottom-10 rounded-full box-content p-3  bg-lime-500 text-black shadow-xl`}
      >
        <Plus size={24} strokeWidth={3} />
      </NavLink>
    </div>
  );
};

export default HomeDashboard;
