import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Contacto: React.FC = () => {
  const [message, setMessage] = useState("");
  const [fromName, setFromName] = useState(""); // Estado para el nombre del remitente
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
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
      await emailjs.send(serviceID, templateID, templateParams, userID);
      console.log("Mensaje enviado exitosamente");
      setShowModal(true);
      setMessage("");
      setFromName("");
    } catch (error) {
      console.error("Error al enviar el mensaje", error);
    }
  };

  return (
    <div className="bg-[#005e63] min-h-screen flex items-center justify-center text-black p-4">
      <div className="w-full max-w-5xl bg-green-200 p-8 rounded-lg shadow-2xl">
        <h2 className="text-4xl font-bold mb-6">Contacto</h2>
        <p className="text-lg mb-6">
          Déjanos un mensaje o sugerencia. Estamos atentos a tus comentarios.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#c0c231]"
            placeholder="Tu nombre"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            required
          />
          <textarea
            className="w-full h-40 border border-gray-300 rounded-md p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#c0c231]"
            placeholder="Escribe tu mensaje aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#424319] hover:bg-[#d1ac32] text-white rounded-md shadow-md transition duration-200 text-lg"
          >
            Enviar mensaje
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md">
            <h3 className="text-3xl font-bold text-[#424319] mb-4">
              ¡Gracias por tu mensaje!
            </h3>
            <p className="text-lg text-gray-700">
              Apreciamos tu comentario y te responderemos a la brevedad.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-6 py-2 bg-[#c0c231] hover:bg-[#d1ac32] text-white rounded-md shadow-md transition duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacto;
