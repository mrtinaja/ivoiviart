import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Contacto: React.FC = () => {
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);

  // Mejor mover a variables de entorno si querés:
  const serviceID = "service_1moucui";
  const templateID = "template_6qwvmvk";
  const userID = "_0ReyJFzILaT2c50r";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fromName.trim() || !message.trim()) return;

    setSending(true);
    try {
      await emailjs.send(
        serviceID,
        templateID,
        {
          to_name: "Ivo Ivi",
          from_name: fromName.trim(),
          message: message.trim(),
        },
        userID
      );

      setShowModal(true);
      setFromName("");
      setMessage("");
    } catch (error) {
      console.error("Error al enviar el mensaje", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#042021] min-h-screen flex items-center justify-center text-white p-4">
      <div className="w-full max-w-3xl bg-[#102c2e] p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Contacto</h2>

        <p className="text-1xl mb-6">
          Déjanos un mensaje o sugerencia. Estamos atentos a tus comentarios.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="fromName" className="block text-lg mb-2">
              Tu nombre
            </label>
            <input
              id="fromName"
              name="fromName"
              type="text"
              className="text-sxl w-full border border-gray-300 rounded-md p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#c0c231]"
              placeholder="Tu nombre"
              value={fromName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFromName(e.currentTarget.value)
              }
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-lg mb-2">
              Tu mensaje
            </label>
            <textarea
              id="message"
              name="message"
              className="text-1xl w-full h-40 border border-gray-300 rounded-md p-4 text-black focus:outline-none focus:ring-2 focus:ring-[#c0c231]"
              placeholder="Escribe tu mensaje aquí..."
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(e.currentTarget.value)
              }
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className={`px-6 py-3 text-lg font-semibold text-white rounded-md shadow-lg transition-all duration-300 ${
                sending ? "bg-gray-500 cursor-not-allowed" : "bg-[#005e63] hover:bg-[#074a4e]"
              }`}
              aria-busy={sending}
            >
              {sending ? "Enviando..." : "Enviar mensaje"}
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md w-full">
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
