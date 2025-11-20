import { jsx as _jsx } from "preact/jsx-runtime";
const TrashButton = ({ onClick, disabled }) => {
    return (_jsx("button", { onClick: onClick, className: "relative overflow-hidden px-3 py-2 text-base font-semibold text-white rounded-md \r\n        bg-gradient-to-r from-[#f79647] via-[#e00e03] to-[#90442a] shadow-lg \r\n        transition-all duration-300 hover:from-[#e00e03] hover:via-[#90442a] hover:to-[#e00e03] \r\n        active:scale-95 focus:outline-none", children: "\uD83D\uDDD1\uFE0F" }));
};
export default TrashButton;
