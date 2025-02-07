/*
    make a add-course page with very minimal design, adjust the input label layouts very beautifully.
    Go creative, very minimal and beautiful, Also create ana amazing course card.
    , here first we have to give the course a title, then
    upload a YouTube playlist url, then the links of all videos under that playlist
    will be extracted, at present I am using pytube for that, but you may use another
    approach if that suits better for jsx, you can store course information in some
    sort of database, you can use any db as its for myself only. Also add options to
    remove  some videos if needed[if we do not need all videos in the playlist],
    and after that add the duration of the corse work, and finally save.
    should be editable later on.

    With each save the preview of course shall be visible on right side, keep things responsive



    const [isDarkMode, setIsDarkMode] = useState(
        () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
    );
    import Header from "../../components/Headers/Header";

    <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
*/

// make this api call only when courseUrl is changed and save is pressed, else just setPreviewCourseData,
/* const courseData = {
    name: courseName,
    organiser: courseOrganiser,
    duration: courseDuration,
    url: courseUrl,
    studyMaterials: studyMaterials,
    videoList: data.playListData,
};
setPreviewCourse(courseData); */

import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import Header from "../../components/Headers/Header";

const AddCoursePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
    );

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "bg-stone-900 text-white" : "bg-gray-50"}`}
        >
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="">
                    <h2
                        className={`text-xl font-semibold mb-6 ${isDarkMode ? "text-stone-200" : ""}`}
                    >
                        Add Course
                    </h2>
                    <div
                        className={`border rounded-xs ${isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-gray-200"}`}
                    >
                        {/* course name */}
                        <label htmlFor="courseName">Course Name: </label>
                        <input type="text" name="courseName" id="courseName" />

                        {/* course organisor name / university */}
                        <label htmlFor="courseOrganiser">
                            Course Organiser:{" "}
                        </label>
                        <input
                            type="text"
                            name="courseOrganiser"
                            id="courseOrganiser"
                        />

                        {/* course duration */}
                        <label htmlFor="courseDuration">
                            Course Duration:{" "}
                        </label>
                        <input
                            type="text"
                            name="courseDuration"
                            id="courseDuration"
                        />

                        {/* course url [youtube playlist url] or add individual video urls */}
                        <label htmlFor="courseUrl">
                            Course Url(playlist or individual links)
                        </label>
                        <input type="text" name="courseUrl" id="courseUrl" />

                        {/* Optional study materials eg books, pyq */}
                        <label htmlFor="">
                            Enter study material if any and their purpose
                        </label>
                        {/* file */}
                        <input type="file" name="" id="" />

                        {/* type: eg PYQ, Book */}
                        <input type="text" name="" id="" />
                    </div>
                </div>

                {/* preview the course gradually on save, */}
            </main>
        </div>
    );
};

export default AddCoursePage;
