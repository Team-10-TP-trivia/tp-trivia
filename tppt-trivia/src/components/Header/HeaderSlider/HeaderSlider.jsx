import { useEffect } from 'react';
import './HeaderSlider.css'; // Import your CSS file

export default function HeaderSlider() {
    useEffect(() => {
        const images = document.querySelectorAll('.slider img');
        let counter = 0;
    
        const rotateImages = () => {
            // Reset the counter if it exceeds the number of images
            if (counter >= images.length) {
                counter = 0;
            }
    
            // Remove the 'active' class from all images
            images.forEach((image) => {
                image.classList.remove('active');
            });
    
            // Add the 'active' class to the current image
            images[counter].classList.add('active');
    
            // Increment the counter
            counter++;
        };
    
        // Call the rotateImages function every 3 seconds
        const interval = setInterval(rotateImages, 3000);
    
        // Clean up the interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div id='header-slider' className="slider">
            <img src="" alt="" className="img" />
            <img src="" alt="" className="img" />
        </div>
    );
}
