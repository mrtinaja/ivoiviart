import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
  viewport: { once: true },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut", delay },
  viewport: { once: true },
});

const Acerca: React.FC = () => {
  return (
    <div className="min-h-screen gap-4 bg-[#05282a] text-white flex items-start justify-center pt-28 pb-16 px-4">
      <motion.div
        className="w-full max-w-4xl text-center"
        {...fadeUp(0)}
      >
        {/* Título */}
        <motion.h1
          className="p-10 text-2xl sm:text-5xl md:text-6xl font-extrabold text-[#f0eceb] inline-block border-b-4 border-[#f0eceb] pb-2"
          {...scaleIn(0)}
        >
          ¡Bienvenid@!
        </motion.h1>

        {/* Intro */}
        <motion.p
          className="mt-8 text-lg sm:text-xl md:text-2xl text-[#f0eceb] leading-relaxed"
          {...fadeUp(0.15)}
        >
          ¡Hola! Bienvenido a{" "}
          <span className="font-semibold text-yellow-300">Ivoivi Art</span>.
          Acá vas a encontrar mis obras en{" "}
          <span className="italic text-yellow-300">
            cerámica, pintura y artesanías
          </span>
          , todo único y hecho a mano.
        </motion.p>

        {/* Aclaración tiempos */}
        <motion.p
          className="mt-10 text-lg sm:text-xl md:text-2xl text-[#f0eceb] leading-relaxed"
          {...fadeUp(0.3)}
        >
          Tené en cuenta que la realización del producto puede tardar
          aproximadamente{" "}
          <span className="font-bold text-yellow-400">15 días</span>{" "}
          siempre y cuando no estén realizados. Ojalá disfrutes la visita.
        </motion.p>

        {/* Cierre */}
        <motion.p
          className="mt-14 text-3xl sm:text-4xl md:text-5xl font-semibold text-yellow-400"
          {...scaleIn(0.45)}
        >
          ¡Muchas gracias! 🎨✨
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Acerca;
