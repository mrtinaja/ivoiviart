import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion";

type CardProps = {
  image: string;
  description: string;
};

const Card: React.FC<CardProps> = ({ image, description }) => {
  return (
    <motion.div
      className="card bg-rgb(0,94,99) shadow-md rounded-lg overflow-hidden"
      style={{ width: "260px" }}
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.3 }}
    >
      <LazyLoadImage
        src={image}
        alt={description}
        effect="blur"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/img/default.jpg";
        }}
        style={{
          width: "100%",
          height: "350px",
          objectFit: "cover",
          padding: "10px",
        }}
        className="card-img-top rounded-lg"
      />
      <div className="card-body bg-light p-3">
        <p
          className="card-text text-center"
          style={{
            height: "72px",
            overflow: "hidden",
            color: "#d0c9b5",
            fontFamily: "'Dancing Script', cursive",
          }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default Card;
