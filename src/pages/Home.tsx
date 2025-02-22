import React from "react";
import Header from "../components/Header";
import CardList from "../components/CardList"; // Cambiado para usar CardList

const Home: React.FC = () => {
  return (
    <div className="bg-[rgb(0,94,99)] min-h-screen flex flex-col justify-center items-center">
      <main className="p-4 sm:p-6 md:p-8 flex-1">
        <h1
          className="text-3xl sm:text-4xl font-bold text-yellow-50 mb-4 sm:mb-6 text-center"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Galería de obras
        </h1>
        <CardList />
      </main>
    </div>
  );
};

export default Home;
