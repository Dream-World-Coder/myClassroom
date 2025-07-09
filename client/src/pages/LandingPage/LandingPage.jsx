import courses from "../../assets/Courses";

export default function LandingPage() {
  return (
    <>
      {/* hero section */}
      <div className="hero-section bg-linear-to-b from-black to-stone-900 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">myClassroom</h1>
        <p className="text-xl mb-8">Your Self-Study Sanctuary</p>
        <p className="text-lg mb-12">
          Create courses from YouTube videos and PDFs. No ads. Stay focused.
          Study smarter.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-lime-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-400 transition">
            Get Started
          </button>
          <button className="border border-lime-500 text-lime-500 px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 hover:text-black transition">
            Explore Courses
          </button>
        </div>
      </div>

      {/* features section */}
      <div className="features-section bg-stone-900 text-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose myClassroom?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <span className="text-4xl mb-4">🚫📢</span>
            <h3 className="text-xl font-semibold mb-2">Ad-Free Learning</h3>
            <p className="text-gray-400">
              No distractions. Focus on what matters.
            </p>
          </div>
          <div className="text-center">
            <span className="text-4xl mb-4">🎥📚</span>
            <h3 className="text-xl font-semibold mb-2">Custom Courses</h3>
            <p className="text-gray-400">
              Create courses from YouTube videos and PDFs.
            </p>
          </div>
          <div className="text-center">
            <span className="text-4xl mb-4">📊</span>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-400">
              Monitor your learning journey with progress tracking.
            </p>
          </div>
        </div>
      </div>

      {/* showcase section */}
      <div className="course-showcase bg-black text-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Popular Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={index} className="bg-stone-800 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <p className="text-gray-400">{course.duration}</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="w-full bg-stone-700 rounded-full h-2">
                  <div
                    className="bg-lime-500 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <button className="w-full bg-lime-500 text-black py-2 rounded-lg font-semibold hover:bg-lime-400 transition">
                Continue
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="footer bg-stone-900 text-white py-8 px-6 text-center border-t border-stone-700">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-lime-500">
            Home
          </a>
          <a href="#" className="hover:text-lime-500">
            Practice
          </a>
          <a href="#" className="hover:text-lime-500">
            My Courses
          </a>
          <a href="#" className="hover:text-lime-500">
            Profile
          </a>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <a href="#" className="text-gray-400 hover:text-lime-500">
            Twitter
          </a>
          <a href="#" className="text-gray-400 hover:text-lime-500">
            LinkedIn
          </a>
          <a href="#" className="text-gray-400 hover:text-lime-500">
            GitHub
          </a>
        </div>
        <p className="text-gray-400">
          &copy; 2025 myClassroom. All rights reserved.
        </p>
      </div>
    </>
  );
}
