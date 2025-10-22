/** @jsxImportSource preact */
import { FunctionalComponent } from "preact";
import { Link } from "react-router-dom";
import Card from "./Card";

type Props = { id: string; image: string; description: string };

const CarouselItem: FunctionalComponent<Props> = ({ id, image, description }) => {
  return (
    <Link
      to={`/product/${id}`}
      className="block"
      aria-label={description}
    >
      <Card image={image} description={description} />
    </Link>
  );
};

export default CarouselItem;
