// src/components/CarouselDestaques.jsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CarouselDestaques = () => {
  const imagens = [
    '/assets/img1.mp4',
    '/assets/img2.png',
    '/assets/img3.png',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <Slider {...settings}>
      {imagens.map((itemPath, index) => {
        const isVideo = itemPath.endsWith('.mp4');
        const isImage = itemPath.endsWith('.png') || itemPath.endsWith('.jpg') || itemPath.endsWith('.jpeg') || itemPath.endsWith('.gif');

        if (isVideo) {
          return (
            <div key={index}>
              <video autoPlay loop muted controls style={{ width: '100%' }}>
                <source src={itemPath} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
          );
        } else if (isImage) {
          return (
            <div key={index}>
              <img src={itemPath} alt={`Destaque ${index + 1}`} style={{ width: '100%' }} />
            </div>
          );
        } else {
          // Caso haja outros tipos de arquivo que você precise lidar
          return (
            <div key={index}>
              <p>Tipo de arquivo não suportado: {itemPath}</p>
            </div>
          );
        }
      })}
    </Slider>
  );
};

export default CarouselDestaques;
