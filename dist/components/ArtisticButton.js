"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const ArtisticButton = ({ onClick, children, className = "", }) => {
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { onClick: onClick, className: `relative overflow-hidden px-6 py-3 text-lg font-semibold text-white rounded-md 
                  bg-gradient-to-r from-[#90442a] via-[#005e63] to-[#90442a] shadow-lg 
                  transition-all duration-300 hover:from-[#005e63] hover:via-[#90442a] hover:to-[#005e63] 
                  active:scale-95 focus:outline-none ${className}`, initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, whileHover: {
            scale: 0.85,
            boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.6)",
        }, transition: { duration: 0.3 }, children: [(0, jsx_runtime_1.jsx)("span", { className: "absolute inset-0 bg-white opacity-10 blur-lg" }), children] }));
};
exports.default = ArtisticButton;
