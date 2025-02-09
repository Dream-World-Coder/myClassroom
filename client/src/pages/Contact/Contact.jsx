import { Mail, Globe, BookOpen, Send, Linkedin } from "lucide-react";
import Header from "../../components/Headers/Header";
import { useState } from "react";

const ContactPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
    );
    const [activeLink, setActiveLink] = useState("Contact");

    const connectLinks = [
        { name: "Portfolio", href: "https://subhajit.pages.dev", icon: Globe },
        {
            name: "Blog",
            href: "https://myopencanvas.in",
            icon: BookOpen,
        },
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/subhajitgorai",
            icon: Linkedin,
        },
        { name: "Email", href: "mailto@blog.opencanvas@gmail.com", icon: Mail },
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
                className={`min-h-screen ${isDarkMode ? "bg-[#111] text-[#eee]" : "bg-white text-black"}`}
            >
                <main className="max-w-2xl mx-auto px-6 py-16">
                    {/* Header Section */}
                    <div className="mb-24 text-center space-y-3">
                        <h1 className="font-serif text-4xl pointer-events-none md:pointer-events-auto">
                            Subhajit Gorai
                        </h1>
                        <p className="font-serif text-lg text-stone-500 italic pointer-events-none md:pointer-events-auto">
                            Developer &amp; Maintainer
                        </p>
                    </div>

                    {/* Connect Links */}
                    <div className="mb-24">
                        <div
                            className={`border-t border-b py-8 ${isDarkMode ? "border-stone-800" : "border-stone-200"}`}
                        >
                            <div className="space-y-6 columns-2 items-start">
                                {connectLinks.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        target="_blank"
                                        className="flex items-center justify-center gap-3 cursor-pointer"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span className="font-serif text-lg">
                                            {item.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="relative max-w-xl mx-auto">
                        <h2 className="font-serif text-2xl text-center mb-12 pointer-events-none md:pointer-events-auto">
                            Feel free to suggest any thoughts
                        </h2>
                        <form
                            action="https://api.web3forms.com/submit"
                            method="post"
                            className="space-y-8"
                        >
                            <input
                                type="hidden"
                                name="access_key"
                                value="0d68234c-653f-49f3-b87d-5f09b35e72c3"
                            />
                            <input
                                type="hidden"
                                name="redirect"
                                value="https://www.myopencanvas.in/thanks"
                            />
                            <div>
                                <input
                                    required
                                    type="text"
                                    placeholder="Your name"
                                    name="name"
                                    className={`w-full bg-transparent border-b ${isDarkMode ? "border-stone-800" : "border-stone-200"}
                                    py-2 font-serif text-lg placeholder:text-stone-400 focus:outline-none
                                    focus:border-stone-400 transition-colors`}
                                />
                            </div>
                            <div>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="Your email"
                                    className={`w-full bg-transparent border-b ${isDarkMode ? "border-stone-800" : "border-stone-200"}
                                    py-2  font-serif text-lg placeholder:text-stone-400
                                    focus:outline-none focus:border-stone-400 transition-colors`}
                                />
                            </div>
                            <div>
                                <textarea
                                    required
                                    name="message"
                                    placeholder="Your message"
                                    rows={2}
                                    className={`w-full bg-transparent border-b ${isDarkMode ? "border-stone-800" : "border-stone-200"}
                                    py-2 font-serif text-lg placeholder:text-stone-400
                                    focus:outline-none focus:border-stone-400 transition-colors resize-none`}
                                />
                            </div>
                            <input
                                type="checkbox"
                                name="botcheck"
                                className="hidden"
                                style={{ display: "none" }}
                            />
                            <div className="text-center pt-8">
                                <button
                                    type="submit"
                                    className="font-serif text-lg inline-flex
                                items-center gap-2 bg-lime-300/30 hover:cursor-pointer
                                border border-lime-300 rounded-full box-content px-4 py-1"
                                >
                                    <span>Send</span>
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ContactPage;
