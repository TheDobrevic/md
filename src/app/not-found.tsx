// app/not-found.tsx
"use client";

import { useRef, useEffect } from "react";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Canvas boyutu
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let width = canvas.width;
    let height = canvas.height;

    const logo = new Image();
    logo.src = "/logo.png";

    let logoW = 100;
    let logoH = 100;
    let x = Math.random() * (width - logoW);
    let y = Math.random() * (height - logoH);
    let vx = 3;
    let vy = 3;
    let hue = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      width = canvas.width;
      height = canvas.height;
    };
    window.addEventListener("resize", handleResize);

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.filter = `hue-rotate(${hue}deg)`;
      ctx.drawImage(logo, x, y, logoW, logoH);

      x += vx;
      y += vy;

      if (x + logoW >= width || x <= 0) {
        vx = -vx;
        hue = (hue + 90) % 360;
      }
      if (y + logoH >= height || y <= 0) {
        vy = -vy;
        hue = (hue + 180) % 360;
      }

      requestAnimationFrame(animate);
    }

    logo.onload = () => {
      logoW = logo.naturalWidth;
      logoH = logo.naturalHeight;
      const maxDim = Math.min(width, height) / 5;
      const scale = Math.min(maxDim / logoW, maxDim / logoH, 1);
      logoW *= scale;
      logoH *= scale;

      animate();
    };

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-[-1]"
      />

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className=" font-pixelify text-[2rem]  select-none flex items-center justify-center flex-col text-center">
            <h1>HATA 404</h1>
          <h1>Aradığın sayfa bulunamadı!</h1>
        </div>
      </div>
    </>
  );
}