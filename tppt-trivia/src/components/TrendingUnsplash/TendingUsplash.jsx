import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchUnsplashPhotos } from "../../services/UnsplashAPI/UnsplashAPI";

export default function TrendingUnsplash({ onSelectMedia, setModal }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const fetchedPhotos = await fetchUnsplashPhotos();
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Error fetching Unsplash photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div>
      <h3>Trending Unsplash Photos</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onSelectMedia(photo.urls.regular)}
            style={{ cursor: "pointer" }}
          >
            <img
              onClick={closeModal}
              src={photo.urls.thumb}
              alt={photo.description}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

TrendingUnsplash.propTypes = {
  onSelectMedia: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
};
