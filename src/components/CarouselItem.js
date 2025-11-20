import { jsx as _jsx } from "preact/jsx-runtime";
import { Link } from "react-router-dom";
import Card from "./Card";
const CarouselItem = ({ id, image, description }) => {
    return (_jsx(Link, { to: `/product/${id}`, className: "block", "aria-label": description, children: _jsx(Card, { image: image, description: description }) }));
};
export default CarouselItem;
