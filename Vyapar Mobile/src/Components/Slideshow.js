import React from 'react';
import img1 from "../images/slideIMG/1.png";
function Slideshow() {


  return (
    <div>
      <div className="slideshow-container">
        <div className={`mySlides active`}>
          <img src={img1} alt="Slide 1" />
        </div>
      </div>
    </div>
  );
}

export default Slideshow;

