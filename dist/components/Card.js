"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_lazy_load_image_component_1 = require("react-lazy-load-image-component");
require("react-lazy-load-image-component/src/effects/blur.css");
const framer_motion_1 = require("framer-motion");
const Card = ({ image, description }) => {
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "card bg-rgb(0,94,99) shadow-md rounded-lg overflow-hidden", style: { width: "260px" }, whileHover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.3)" }, transition: { duration: 0.3 }, children: [(0, jsx_runtime_1.jsx)(react_lazy_load_image_component_1.LazyLoadImage, { src: image, alt: description, effect: "blur", onError: (e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/img/default.jpg";
                }, style: {
                    width: "100%",
                    height: "350px",
                    objectFit: "cover",
                    padding: "10px",
                }, className: "card-img-top rounded-lg" }), (0, jsx_runtime_1.jsx)("div", { className: "card-body bg-light p-3", children: (0, jsx_runtime_1.jsx)("p", { className: "card-text text-center", style: {
                        height: "72px",
                        overflow: "hidden",
                        color: "#d0c9b5",
                        fontFamily: "'Dancing Script', cursive",
                    }, children: description }) })] }));
};
exports.default = Card;
