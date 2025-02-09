import Header from "../../components/Headers/Header";
import { useState } from "react";

const AboutPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
    );
    const [activeLink, setActiveLink] = useState("About");
    const featureData = [
        {
            heading: "Express",
            data: "Share your drawings, photographs, poems, and stories. Let your emotions flow through your art.",
        },
        {
            heading: "Curate",
            data: "Create collections that tell your story. Organize your journey in beautiful albums.",
        },
        {
            heading: "Connect",
            data: "Find kindred spirits. Share inspirations. Be part of a community that understands.",
        },
    ];

    return (
        <>
            <Header
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
            />
            <div
                className={`min-h-screen pt-4 ${isDarkMode ? "bg-[#111] text-[#ddd]" : "bg-white text-black"} relative overflow-hidden`}
            >
                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
                    {/* Hero Section */}
                    <div className="text-center space-y-6 mb-16 pointer-events-none md:pointer-events-auto">
                        <h1
                            className="font-serif text-6xl sm:text-7xl
                            leading-14 pb-2 md:pb-12"
                        >
                            <div className="">A Place for</div>
                            <div className="font-serif text-lime-600 text-4xl md:text-5xl">
                                <span className="italic">focused</span>{" "}
                                selfstudy
                            </div>
                        </h1>
                        <p
                            className="text-lg sm:text-xl font-serif
                        pointer-events-none md:pointer-events-auto font-bold md:font-normal
                        leading-tight tracking-normal max-w-2xl mx-auto"
                        >
                            ** will be updated later **
                            <br />
                            myOpenCanvas is an open - canvas for you to fill.
                            Its a platform for art lovers. Any type of art like
                            drawing, photography, writing, narrating etc you can
                            publish in here also describe the philosopy and
                            emotion of your piece alongside. Create albums and
                            collections for organising your art or to express a
                            spcific journey. Discover various artworks and many
                            other dreamy artists like you.
                        </p>
                    </div>

                    {/* Features Section */}
                    <div className="space-y-16 pl-6 max-w-2xl mx-auto font-bold md:font-normal">
                        {featureData.map((item, index) => (
                            <div key={index} className="space-y-2 group">
                                <h2
                                    className="font-serif text-2xl sm:text-3xl italic
                                underline decoration-1 decoration-stone-700 pointer-events-none md:pointer-events-auto"
                                >
                                    <span
                                        className={`box-content p-1 pt-0 ${isDarkMode ? "group-hover:bg-lime-700/60" : "group-hover:bg-lime-100"} rounded-md`}
                                    >
                                        &gt; {item.heading}
                                    </span>
                                </h2>
                                <div className="flex justify-between pointer-events-none md:pointer-events-auto">
                                    <p className="font-serif text-lg md:text-xl leading-tight pl-4">
                                        {item.data}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="mt-32 text-center">
                        <p className="font-serif underline text-xl sm:text-2xl italic pointer-events-none md:pointer-events-auto">
                            Stay focused in your Learning
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutPage;
