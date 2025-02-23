import React from "react";
import { Link } from "react-router-dom";
import { getStorageUrl, useMedia } from "../context/MediaContext";
import Card from "./Card";

const CardList: React.FC = () => {
  const media = useMedia();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-w-full mx-auto place-items-center sm:place-items-start">
      {media.map((item) => (
        <Link to={`/product/${item.id}`} key={item.id} className="block">
          <Card
            image={
              item.images.length > 0
                ? item.images[0]
                : getStorageUrl("default.jpg")
            }
            description={item.description}
          />
        </Link>
      ))}
    </div>
  );
};

export default CardList;
