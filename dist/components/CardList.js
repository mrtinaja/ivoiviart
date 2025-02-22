"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const MediaContext_1 = require("../context/MediaContext");
const Card_1 = __importDefault(require("./Card"));
const CardList = () => {
    const media = (0, MediaContext_1.useMedia)();
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-w-full mx-auto place-items-center sm:place-items-start", children: media.map((item) => ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: `/product/${item.id}`, className: "block", children: (0, jsx_runtime_1.jsx)(Card_1.default, { image: item.images.length > 0 ? `/${item.images[0]}` : "/img/default.jpg", description: item.description }) }, item.id))) }));
};
exports.default = CardList;
