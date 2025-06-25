"use client";

import { useState, MouseEvent } from 'react';
import Image, { StaticImageData } from 'next/image';

interface MangaMagnifierProps {
  src: string | StaticImageData;
  zoomLevel?: number;
  magnifierSize?: number;
}

export default function MangaMagnifier({
  src,
  zoomLevel = 2, // Büyütme oranı
  magnifierSize = 200, // Büyütecin boyutu (kare)
}: MangaMagnifierProps) {

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    setPosition({ x, y });
    setImgSize({ width, height });
  };

  return (
    <div
      className="relative w-full h-auto cursor-none"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <Image 
        src={src} 
        alt="Manga Test Sayfası" 
        width={800} 
        height={1200}
        className="w-full h-auto object-contain" 
      />

      {showMagnifier && (
        <div
          style={{
            // Konumlandırma
            position: 'absolute',
            left: `${position.x - magnifierSize / 2}px`,
            top: `${position.y - magnifierSize / 2}px`,
            pointerEvents: 'none',

            // Büyüteç Stili
            height: `${magnifierSize}px`,
            width: `${magnifierSize}px`,
            border: '2px solid white',
            borderRadius: '50%', // Yuvarlak büyüteç için
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',

            // Büyütme Büyüsü
            backgroundImage: `url(${typeof src === 'string' ? src : src.src})`,
            backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
            backgroundPosition: `-${position.x * zoomLevel - magnifierSize / 2}px -${position.y * zoomLevel - magnifierSize / 2}px`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
}