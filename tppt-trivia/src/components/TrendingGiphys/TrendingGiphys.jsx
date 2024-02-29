import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTrendingUrl } from '../../services/GiphyAPI/GiphyApi';

export default function TrendingGiphys({ onSelectMedia }) {
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const response = await fetch(getTrendingUrl());
        const data = await response.json();
        setGifs(data.data);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
      }
    };

    fetchGifs();
  }, []);

  return (
    <div>
      <h3>Trending GIFs</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {gifs.map((gif) => (
          <div key={gif.id} onClick={() => onSelectMedia(gif.images.fixed_height.url)} style={{ cursor: 'pointer' }}>
            <img src={gif.images.fixed_height.url} alt={gif.title} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

TrendingGiphys.propTypes = {
  onSelectMedia: PropTypes.func.isRequired,
};