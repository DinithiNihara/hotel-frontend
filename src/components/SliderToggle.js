import { motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import { useThemeContext } from "../context/ThemeContext";
const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const SliderToggle = () => {
  const { theme, changeTheme } = useThemeContext();
  return (
    <div className="relative flex w-fit items-center rounded-full h-fit py-1">
      <button
        className={`${TOGGLE_CLASSES} ${
          theme === "light" ? "text-white" : "text-slate-300"
        }`}
        onClick={() => {
          changeTheme("light");
        }}
      >
        <FaSun className="relative z-10 text-lg" />
        {/* <span className="relative z-10">Light</span> */}
      </button>
      <button
        className={`${TOGGLE_CLASSES} ${
          theme === "dark" ? "text-white" : "text-slate-800"
        }`}
        onClick={() => {
          changeTheme("dark");
        }}
      >
        <FaMoon className="relative z-10 text-lg " />
        {/* <span className="relative z-10">Dark</span> */}
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${
          theme === "dark" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600"
        />
      </div>
    </div>
  );
};

export default SliderToggle;