import Header from "../../components/Headers/Header";
import { useDarkMode } from "@/contexts/ThemeContext";

const AboutAndContactPage = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen transition-all duration-300 font-[poppins] ${
        isDarkMode ? "bg-[#111] text-white" : "bg-gray-50 text-black"
      }`}
    >
      <Header />

      <main className="max-w-6xl mx-auto pt-6 px-6">
        {/* About */}
        <section className="mb-20">
          <h2
            className={`text-3xl font-bold mb-8 ${
              isDarkMode ? "text-neutral-200" : ""
            }`}
          >
            About myClassroom
          </h2>
          <div className={`prose prose-lg max-w-none`}>
            <p className="text-base leading-relaxed mb-6">
              myClassroom is a platform designed for focused self-study. We
              believe that learning should be uninterrupted and personalized to
              your pace. For YouTube learners ads are a huge pain, thats where
              myClassroom comes in.
            </p>
            <p className="text-base leading-relaxed mb-6">
              Transform any YouTube playlist into a structured course
              experience. Edit courses and design your perfect learning path,
              study without ads or distractions of irrelavent videos. Besides
              there is progress tracking, to-do lists, and study hour monitoring
              to help you manage routines better.
            </p>
            <p className="text-base leading-relaxed Xmb-4">
              myClassroom is absolutely Free and OpenSource.
              <a
                href="https://github.com/dream-World-Coder/myClassroom"
                target="_blank"
                rel="noreferrer"
                className={`block px-2 py-1 rounded-lg border w-fit mt-2
                  ${
                    isDarkMode
                      ? "text-lime-500 border-[#222] bg-[#171717]"
                      : "border-gray-200 bg-gray-200 text-lime-950"
                  }`}
              >
                Contribute / Star This Repo
              </a>
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2
            className={`text-3xl font-bold mb-8 ${
              isDarkMode ? "text-neutral-200" : ""
            }`}
          >
            Contact
          </h2>
          <div className={`text-lg leading-relaxed`}>
            <p className="mb-4">
              Hi, I&apos;m Subhajit, the developer &amp; maintainer of this
              project. Feel free to contact me in case of any queries.
              <ul className="text-sm pt-2">
                <li>
                  <a
                    href="https://github.com/dream-World-Coder"
                    className="text-sky-500 hover:text-sky-400 underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub: @dream-World-Coder
                  </a>
                </li>
                <li>
                  <a
                    href="https://myopencanvas.in"
                    className="text-sky-500 hover:text-sky-400 underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Personal Site: myopencanvas.in
                  </a>
                </li>
              </ul>
            </p>
          </div>
        </section>
      </main>

      <footer
        className={`max-w-6xl mx-auto mt-20 pt-8 border-t border-opacity-20 pb-12 ${
          isDarkMode ? "border-lime-500" : "border-lime-600"
        }`}
      >
        <p className="text-center text-sm opacity-70">© 2025 myClassroom.</p>
      </footer>
    </div>
  );
};

export default AboutAndContactPage;
