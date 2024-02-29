export const API_KEY = "n3ElOhTqGELG9GpOaoI75pK65hnlHoB2";

export const getTrendingUrl = (limit = 25, offset = 0) =>
  `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${limit}&offset=${offset}&rating=g&bundle=messaging_non_clips`;