import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Search, Moon, Sun } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";

// This is not good i guess, why pass isDarkMode and its setter as prop,

const Header = ({
  isDarkMode,
  setIsDarkMode,
  activeLink = "Home",
  setActiveLink,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, token } = useAuth();
  const isAuthenticated = !!(user && token);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("isDarkModeOn", JSON.stringify(newMode));
  };
  const changeActiveLink = (item) => {
    setActiveLink(item.name);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    // { name: "Practice", href: "/practice" },
    { name: "My Courses", href: "/courses" },
    { name: "Add Course", href: "/add-course" },
    { name: "About & Contact", href: "/about" },
    // { name: "Browse Courses", href: "#" },

    // keep them in last, logic applied that way
    { name: "Login", href: "/login" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <header
      className={`sticky font-[poppins] top-0 z-50 border-b ${isDarkMode ? "bg-[#111] border-[#222] text-white" : "bg-white border-gray-200"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative px-4 flex items-center justify-between h-16">
          {/* Left section - Logo and Nav */}
          <div className="flex-1 flex items-center justify-start">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 md:hidden"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <h1 translate="no" className="text-xl font-bold ml-2 md:ml-0">
                myClassroom
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden flex-1 md:flex items-center ml-8 space-x-6">
              {navLinks.map(
                (item, index) =>
                  ((index === navLinks.length - 2 && isAuthenticated) ||
                  (index === navLinks.length - 1 && !isAuthenticated)
                    ? false
                    : true) && (
                    <NavLink
                      key={index}
                      to={item.href}
                      onClick={(item) => {
                        changeActiveLink(item);
                      }}
                      className={`h-16 inline-flex items-center px-1 text-sm font-medium
                                                    hover:text-lime-500
                                                    ${
                                                      activeLink === item.name
                                                        ? "border-b-2 border-lime-500"
                                                        : ""
                                                    }`}
                    >
                      {item.name}
                    </NavLink>
                  ),
              )}
            </nav>
          </div>

          {/* Right section - Search and Controls */}
          <div className="flex items-center justify-end">
            <div className="max-w-md mx-4 w-fit hidden md:block">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search Your Courses"
                  className={`pl-10 pr-4 py-2 text-sm rounded-sm border
                                    border-gray-200 ${isDarkMode ? "border-stone-800 bg-[#111]" : ""}
                                    focus:outline-hidden focus:ring-1 focus:ring-lime-500`}
                />
              </div>
            </div>
            <div
              className={`p-1.5 mr-2 rounded-xs hover:bg-gray-100 block md:hidden ${isDarkMode ? "hover:bg-stone-800" : ""}`}
            >
              <Search size={18} />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-1.5 rounded-xs hover:bg-gray-100 ${isDarkMode ? "hover:bg-stone-800" : ""}`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div
            className={`px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 ${isDarkMode ? "border-stone-800" : ""}`}
          >
            {navLinks.map(
              (item, index) =>
                ((index === navLinks.length - 2 && isAuthenticated) ||
                (index === navLinks.length - 1 && !isAuthenticated)
                  ? false
                  : true) && (
                  <NavLink
                    key={index}
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-500"
                  >
                    {item.name}
                  </NavLink>
                ),
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
Header.propTypes = {
  isDarkMode: PropTypes.bool,
  setIsDarkMode: PropTypes.func,
  activeLink: PropTypes.string,
  setActiveLink: PropTypes.func,
};
export default Header;
