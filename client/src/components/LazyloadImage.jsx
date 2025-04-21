import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function LazyloadComponent({ image, classname }) {
  return (
    <img
      effect="blur"
      alt="postImage"
      width="100%"
      height="100%"
      src={image}
      className={classname}
      onError={() => console.log("Image failed to load:", image)}
    />
  );
}
