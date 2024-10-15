// Hero.js
import React from 'react';
import { Carousel, Container } from 'react-bootstrap';

export default function Carousels() {
  return (
    <Container className="px-0" style={{ width: '70%' }}>
      <Carousel className="mt-3" prevLabel="" nextLabel="">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://godavaricuts.com/cdn/shop/files/Slider-3b.png?v=1682935548&width=1880"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://godavaricuts.com/cdn/shop/files/Slider-4b.png?v=1682935547&width=1880"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://godavaricuts.com/cdn/shop/files/Slider-1a.png?v=1682935548&width=2000"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>

      <style jsx>{`
        .carousel-control-prev,
        .carousel-control-next {
          width: 5%;
          opacity: 0.8;
        }
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          width: 10px;
          height: 20px;
        }
      `}</style>
    </Container>
  );
}
