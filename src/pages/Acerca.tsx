import React from "react";
import { motion } from "framer-motion";

const Acerca: React.FC = () => {
  return (
    <div className="p-6 bg-[#005e63] min-h-screen text-white flex flex-col items-center justify-center mt-12">
      <motion.div
        className="max-w-3xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        {/* Título principal con mayor tamaño y animación */}
        <motion.h1
          className="text-6xl font-extrabold text-[#f0eceb] mb-6 border-b-4 border-[#f0eceb] pb-3"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          ¡Bienvenid@!
        </motion.h1>

        {/* Animación suave de fade-in para los párrafos */}
        <motion.p
          className="text-3xl text-[#f0eceb] mt-12 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          ¡Hola! Bienvenido a{" "}
          <span className="font-semibold text-yellow-300">IvoIvi Art</span>. Acá
          vas a encontrar mis obras en{" "}
          <span className="italic text-yellow-300">
            cerámica, pintura y artesanías
          </span>
          , todo único y hecho a mano.
        </motion.p>

        <motion.p
          className="text-3xl leading-relaxed text-[#f0eceb] mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Tené en cuenta que la realización del producto puede tardar
          aproximadamente{" "}
          <span className="font-bold text-yellow-400">15 días</span> siempre y
          cuando no estén realizados. Ojalá disfrutes la visita.
        </motion.p>

        {/* Texto final con una animación escalonada */}
        <motion.p
          className="text-5xl font-semibold text-yellow-400 mt-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          ¡Muchas gracias! 🎨✨
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Acerca;
