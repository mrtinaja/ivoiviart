"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const CardList_1 = __importDefault(require("../components/CardList")); // Cambiado para usar CardList
const Home = () => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-[rgb(0,94,99)] min-h-screen flex flex-col justify-center items-center", children: (0, jsx_runtime_1.jsxs)("main", { className: "p-4 sm:p-6 md:p-8 flex-1", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl sm:text-4xl font-bold text-yellow-50 mb-4 sm:mb-6 text-center", style: { fontFamily: "'Dancing Script', cursive" }, children: "Galer\u00EDa de obras" }), (0, jsx_runtime_1.jsx)(CardList_1.default, {})] }) }));
};
exports.default = Home;
