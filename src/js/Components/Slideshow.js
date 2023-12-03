import React, { useState, useEffect } from 'react';
import img1 from "../images/slideIMG/1.png";
import img2 from "../images/slideIMG/2.png";
import img3 from "../images/slideIMG/3.png";
import img4 from "../images/slideIMG/4.png";

function Slideshow() {
  // const [slideIndex, setSlideIndex] = useState(0);

  // useEffect(() => {
  //   const showSlides = () => {
  //     setSlideIndex((prevSlideIndex) => (prevSlideIndex + 1) % 4); // Adjust the number of slides

  //     // Clear the display property for all slides
  //     const slides = document.querySelectorAll(".mySlides");
  //     slides.forEach((slide) => {
  //       slide.style.display = "none";
  //     });

  //     // Set the display property for the current slide to "block"
  //     slides[slideIndex].style.display = "block";
  //   };

  //   const interval = setInterval(showSlides, 5000); // Change image every 5 seconds

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [slideIndex]);

  return (
    <div>
      {/* <div className="history-text p-2">Services...</div>

      <div className="slideshow-container">
        <div className={`mySlides ${slideIndex === 0 ? 'active' : ''}`}>
          <img src={img1} alt="Slide 1" />
        </div>

        <div className={`mySlides ${slideIndex === 1 ? 'active' : ''}`}>
          <img src={img2} alt="Slide 2" />
        </div>

        <div className={`mySlides ${slideIndex === 2 ? 'active' : ''}`}>
          <img src={img3} alt="Slide 3" />
        </div>

        <div className={`mySlides ${slideIndex === 3 ? 'active' : ''}`}>
          <img src={img4} alt="Slide 4" />
        </div>
      </div>
      <br /> */}
    </div>
  );
}

export default Slideshow;

