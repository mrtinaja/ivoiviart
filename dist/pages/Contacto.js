"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const browser_1 = __importDefault(require("@emailjs/browser"));
const Contacto = () => {
    const [message, setMessage] = (0, react_1.useState)("");
    const [fromName, setFromName] = (0, react_1.useState)(""); // Estado para el nombre del remitente
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const serviceID = "service_1moucui";
        const templateID = "template_6qwvmvk";
        const userID = "_0ReyJFzILaT2c50r";
        const templateParams = {
            to_name: "Ivo Ivi", // Nombre del destinatario
            from_name: fromName, // Nombre del remitente
            message: message, // Mensaje del formulario
        };
        try {
            await browser_1.default.send(serviceID, templateID, templateParams, userID);
            console.log("Mensaje enviado exitosamente");
            setShowModal(true);
            setMessage("");
            setFromName("");
        }
        catch (error) {
            console.error("Error al enviar el mensaje", error);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-[#005e63] min-h-screen flex items-center justify-center text-black p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-5xl bg-green-200 p-8 rounded-lg shadow-2xl", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-4xl font-bold mb-6", children: "Contacto" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg mb-6", children: "D\u00E9janos un mensaje o sugerencia. Estamos atentos a tus comentarios." }), (0, jsx_runtime_1.jsxs)("form", { className: "space-y-6", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("input", { type: "text", className: "w-full border border-gray-300 rounded-md p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#c0c231]", placeholder: "Tu nombre", value: fromName, onChange: (e) => setFromName(e.target.value), required: true }), (0, jsx_runtime_1.jsx)("textarea", { className: "w-full h-40 border border-gray-300 rounded-md p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#c0c231]", placeholder: "Escribe tu mensaje aqu\u00ED...", value: message, onChange: (e) => setMessage(e.target.value), required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "px-6 py-3 bg-[#424319] hover:bg-[#d1ac32] text-white rounded-md shadow-md transition duration-200 text-lg", children: "Enviar mensaje" })] })] }), showModal && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-8 rounded-lg shadow-2xl text-center max-w-md", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-3xl font-bold text-[#424319] mb-4", children: "\u00A1Gracias por tu mensaje!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-700", children: "Apreciamos tu comentario y te responderemos a la brevedad." }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowModal(false), className: "mt-6 px-6 py-2 bg-[#c0c231] hover:bg-[#d1ac32] text-white rounded-md shadow-md transition duration-200", children: "Cerrar" })] }) }))] }));
};
exports.default = Contacto;
