import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useState } from "react";
import emailjs from "@emailjs/browser";
const Contacto = () => {
    const [fromName, setFromName] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [sending, setSending] = useState(false);
    // Mejor mover a variables de entorno si querés:
    const serviceID = "service_1moucui";
    const templateID = "template_6qwvmvk";
    const userID = "_0ReyJFzILaT2c50r";
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!fromName.trim() || !message.trim())
            return;
        setSending(true);
        try {
            await emailjs.send(serviceID, templateID, {
                to_name: "Ivo Ivi",
                from_name: fromName.trim(),
                message: message.trim(),
            }, userID);
            setShowModal(true);
            setFromName("");
            setMessage("");
        }
        catch (error) {
            console.error("Error al enviar el mensaje", error);
        }
        finally {
            setSending(false);
        }
    };
    return (_jsxs("div", { className: "bg-[#042021] min-h-screen flex items-center justify-center text-white p-4", children: [_jsxs("div", { className: "w-full max-w-3xl bg-[#102c2e] p-8 rounded-lg shadow-2xl", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Contacto" }), _jsx("p", { className: "text-1xl mb-6", children: "D\u00E9janos un mensaje o sugerencia. Estamos atentos a tus comentarios." }), _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, noValidate: true, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "fromName", className: "block text-lg mb-2", children: "Tu nombre" }), _jsx("input", { id: "fromName", name: "fromName", type: "text", className: "text-sxl w-full border border-gray-300 rounded-md p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#c0c231]", placeholder: "Tu nombre", value: fromName, onChange: (e) => setFromName(e.currentTarget.value), required: true, autoComplete: "name" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "message", className: "block text-lg mb-2", children: "Tu mensaje" }), _jsx("textarea", { id: "message", name: "message", className: "text-1xl w-full h-40 border border-gray-300 rounded-md p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#c0c231]", placeholder: "Escribe tu mensaje aqu\u00ED...", value: message, onChange: (e) => setMessage(e.currentTarget.value), required: true })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: sending, className: `px-6 py-3 text-lg font-semibold text-white rounded-md shadow-lg transition-all duration-300 ${sending ? "bg-gray-500 cursor-not-allowed" : "bg-[#005e63] hover:bg-[#074a4e]"}`, "aria-busy": sending, children: sending ? "Enviando..." : "Enviar mensaje" }) })] })] }), showModal && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 flex items-center justify-center bg-black/50", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-2xl text-center max-w-md w-full", children: [_jsx("h3", { className: "text-3xl font-bold text-[#424319] mb-4", children: "\u00A1Gracias por tu mensaje!" }), _jsx("p", { className: "text-lg text-gray-700", children: "Apreciamos tu comentario y te responderemos a la brevedad." }), _jsx("button", { onClick: () => setShowModal(false), className: "mt-6 px-6 py-2 bg-[#c0c231] hover:bg-[#d1ac32] text-white rounded-md shadow-md transition duration-200", children: "Cerrar" })] }) }))] }));
};
export default Contacto;
