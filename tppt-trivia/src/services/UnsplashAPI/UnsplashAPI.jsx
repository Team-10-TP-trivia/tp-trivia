const accessKey = "r1DrgoIz8i4Qr167Wk2iuGSfMYjOsQq5LEVgnpNtUlk";
export const fetchUnsplashPhotos = async (
  page = 1,
  perPage = 20,
  orderBy = "latest"
) => {
  const url = `https://api.unsplash.com/photos?client_id=${accessKey}&page=${page}&per_page=${perPage}&order_by=${orderBy}`;
  try {
    const response = await fetch(url);
    const photos = await response.json();
    return photos;
  } catch (error) {
    console.error("Error fetching Unsplash photos:", error);
    throw error;
  }
};