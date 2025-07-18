import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Header from "../../components/Headers/Header";
import CourseCard from "./CourseCard/Course";
import { toast } from "sonner";

const AddCoursePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
  );
  const [activeLink, setActiveLink] = useState("Add Course");
  const [courseName, setCourseName] = useState("");
  const [courseOrganiser, setCourseOrganiser] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseUrl, setCourseUrl] = useState("");
  const [lastFetchedCourseUrl, setLastFetchedCourseUrl] = useState("");
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideoList] = useState([
    {
      videoUrl: "none",
      videoTitle: "none",
      videoDuration: "none",
      videoThumbnailUrl: "none",
    },
  ]);

  // for courses input
  const courseAttributesInputs = [
    {
      inputType: "text",
      inputValue: courseName,
      onChangeFunc: setCourseName,
      labelText: "Course Name",
      placeholder: "eg. Thermodynamics",
    },
    {
      inputType: "text",
      inputValue: courseOrganiser,
      onChangeFunc: setCourseOrganiser,
      labelText: "Course Organiser",
      placeholder: "eg. Physics Galaxy",
    },
    {
      inputType: "text",
      inputValue: courseDuration,
      onChangeFunc: setCourseDuration,
      labelText: "Course Duration",
      placeholder: "eg. 12 weeks",
    },
    {
      inputType: "text",
      inputValue: courseUrl,
      onChangeFunc: setCourseUrl,
      labelText: "Course URL",
      placeholder: "YouTube Playlist or Video URLs",
    },
  ];

  const addStudyMaterial = () => {
    setStudyMaterials([...studyMaterials, { file: null, type: "" }]);
  };

  const updateStudyMaterial = (index, field, value) => {
    const updatedMaterials = [...studyMaterials];
    updatedMaterials[index][field] = value;
    setStudyMaterials(updatedMaterials);
  };

  const removeStudyMaterial = (index) => {
    const updatedMaterials = studyMaterials.filter((_, i) => i !== index);
    setStudyMaterials(updatedMaterials);
  };

  var courseData = {
    courseName,
    courseOrganiser,
    courseDuration,
    courseUrl,
    courseMaterials: studyMaterials,
    videos,
  };

  function fetchPlayListUrl(courseData) {
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/extract-videos-and-save-in-db`;
    const token = localStorage.getItem("token") || null;
    if (!token) {
      toast.error("Authorisation token is NULL.");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseName,
        courseOrganiser,
        courseDuration,
        courseUrl,
        studyMaterials,
      }),
    };
    setIsLoading(true);
    fetch(apiUrl, options)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          throw new Error(data.error);
        }
        if (!data.playListData) {
          toast.error("Some error cccurred. Please try again.");
          throw new Error("Some Error Occurred. Please try again.");
        }
        toast.success("course saved!");

        setVideoList(data.playListData);
        courseData = {
          courseName,
          courseOrganiser,
          courseDuration,
          courseUrl,
          courseMaterials: studyMaterials,
          videos: data.playListData,
        };
        setPreviewCourse(courseData);
      })
      .catch((error) => {
        console.error(error);
        // return "error";
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const saveCourse = () => {
    if (courseName.length === 0 || courseUrl.length === 0) {
      toast.error("provide course name and a playlist url.");
      return;
    }
    // fetch only when the courseUrl changes and the save button is pressed,
    if (courseUrl !== lastFetchedCourseUrl) {
      fetchPlayListUrl();
      // let r = fetchPlayListUrl();
      // if (r === "error") {
      //     return;
      // }
    }
    // else: make a different fetch function for just updating the courseName etc. other attributes
    setLastFetchedCourseUrl(courseUrl);
    courseData = {
      courseName,
      courseOrganiser,
      courseDuration,
      courseUrl,
      courseMaterials: studyMaterials,
      videos,
    };
    setPreviewCourse(courseData);
    // toast.success("course saved!");
  };

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

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course Creation Form */}
        <div className="space-y-6 mb-10 sm:mb-0">
          <h2
            className={`text-2xl font-bold mb-6
                        ${isDarkMode ? "text-stone-200" : "text-gray-800"}`}
          >
            Create New Course
          </h2>

          <form
            action=""
            method=""
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="space-y-4">
              {/* Course Attributes Input */}
              {courseAttributesInputs.map((item, index) => (
                <div key={index} className="relative">
                  <input
                    type={item.inputType}
                    value={item.courseName}
                    onChange={(e) => item.onChangeFunc(e.target.value)}
                    className={`
                                    w-full px-4 py-3 rounded-lg border
                                    focus:outline-hidden transition duration-300
                                    ${
                                      isDarkMode
                                        ? "bg-[#111] border-[#222] text-stone-100 focus:border-lime-600"
                                        : "bg-white border-gray-300 text-gray-800 focus:border-lime-500"
                                    }`}
                    placeholder={item.placeholder}
                    required={(index === 0 || index === 3) && "required"}
                  />
                  <span className="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500">
                    {item.labelText}
                  </span>
                </div>
              ))}

              {/* Study Materials */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold">Study Materials</h3>
                  <button
                    onClick={addStudyMaterial}
                    className={`
                                        p-2 rounded-full
                                        ${
                                          isDarkMode
                                            ? "bg-[#222] text-stone-200 hover:bg-stone-600"
                                            : "bg-lime-500 text-white hover:bg-lime-600"
                                        }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {studyMaterials.map((material, index) => (
                  <div key={index} className="flex space-x-2 mb-3 items-center">
                    <div className="relative grow">
                      <input
                        type="file"
                        onChange={(e) =>
                          updateStudyMaterial(index, "file", e.target.files[0])
                        }
                        className={`
                                                w-full px-4 py-2 rounded-lg border-2
                                                focus:outline-hidden transition duration-300
                                                ${
                                                  isDarkMode
                                                    ? "bg-[#111] border-[#222] text-stone-100"
                                                    : "bg-white border-gray-300 text-gray-800"
                                                }`}
                      />
                      <span className="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500">
                        File
                      </span>
                    </div>
                    <div className="relative grow">
                      <input
                        type="text"
                        value={material.type}
                        onChange={(e) =>
                          updateStudyMaterial(index, "type", e.target.value)
                        }
                        placeholder="e.g., Book, PYQ"
                        className={`
                                                w-full px-4 py-2 rounded-lg border-2
                                                focus:outline-hidden transition duration-300
                                                ${
                                                  isDarkMode
                                                    ? "bg-[#111] border-[#222] text-stone-100 focus:border-lime-600"
                                                    : "bg-white border-gray-300 text-gray-800 focus:border-lime-500"
                                                }`}
                      />
                      <span className="absolute left-3 -top-2 bg-white px-1 text-xs text-gray-500">
                        Material Type
                      </span>
                    </div>
                    <button onClick={() => removeStudyMaterial(index)}>
                      <Trash2 className="text-red-500" size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                type="submit"
                onClick={saveCourse}
                className={`
                                w-full py-3 rounded-lg transition duration-300
                                ${
                                  isDarkMode
                                    ? "bg-lime-600 text-stone-100 hover:bg-lime-700"
                                    : "bg-lime-600 text-white hover:bg-lime-700"
                                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Please wait, it may take some minutes...</span>
                  </div>
                ) : (
                  "Save Course"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Course Preview */}
        <div className="space-y-6 col-span-1 md:col-span-2 h-fit pointer-events-none cursor-none">
          <h2
            className={`text-2xl font-bold mb-6
                        ${isDarkMode ? "text-stone-200" : "text-gray-800"}`}
          >
            Course Preview
          </h2>

          <div
            className={`Xrounded-lg border ${isDarkMode ? "bg-[#111] border-[#222]" : "bg-white border-gray-200"}`}
          >
            {previewCourse ? (
              <CourseCard isDarkMode={isDarkMode} courseData={previewCourse} />
            ) : (
              <p
                className={`text-center p-3 ${isDarkMode ? "text-stone-500" : "text-gray-500"}`}
              >
                Course preview will appear here
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;
