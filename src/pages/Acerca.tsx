import React from "react";
import Header from "../components/Header";

const Acerca: React.FC = () => {
  return (
    <div className="p-8 bg-[#005e63] min-h-screen text-white flex flex-col items-center">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-[#f0eceb] mb-4 border-b-4 border-[#f0eceb] pb-2">
          Acerca de IvoIvi Art
        </h1>
        <p className="text-xl  text-[#f0eceb] mt-10">
          ¡Hola! Bienvenido a{" "}
          <span className="font-semibold text-yellow-300">IvoIvi Art</span>. Acá
          vas a encontrar mis obras en{" "}
          <span className="italic text-yellow-300">
            cerámica, pintura y artesanías
          </span>
          , todo único y hecho a mano.
        </p>
        <p className="text-xl leading-relaxed text-[#f0eceb] mt-10">
          Tené en cuenta que la realización del producto puede tardar
          aproximadamente{" "}
          <span className="font-bold text-yellow-400">15 días</span> siempre y
          cuando no esten realizados. . Ojalá disfrutes la visita.
        </p>
        <p className="text-4xl font-semibold text-yellow-400 mt-10">
          ¡Muchas gracias! 🎨✨
        </p>
      </div>
    </div>
  );
};

export default Acerca;
