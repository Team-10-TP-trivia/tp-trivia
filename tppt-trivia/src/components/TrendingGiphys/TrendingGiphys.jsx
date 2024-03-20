import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getTrendingUrl } from "../../services/GiphyAPI/GiphyApi";

export default function TrendingGiphys({
  onSelectMedia,
  setModal,
  searchParams,
}) {
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const response = await fetch(getTrendingUrl());
        const data = await response.json();
        setGifs(data.data);
      } catch (error) {
        console.error("Error fetching GIFs:", error);
      }
    };

    fetchGifs();
  }, []);

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div>
      <h3>Trending GIFs</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {gifs.map((gif) => {
          if (gif.title.toLowerCase().includes(searchParams.toLowerCase())) {
            return (
              <div
                key={gif.id}
                onClick={() => onSelectMedia(gif.images.fixed_height.url)}
                style={{ cursor: "pointer" }}
              >
                <img
                  onClick={closeModal}
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

TrendingGiphys.propTypes = {
  onSelectMedia: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
  searchParams: PropTypes.string.isRequired,
};
