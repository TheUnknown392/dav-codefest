"use client";
import { useState, useEffect } from "react";
const images = [
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
    alt: "People collaborating at a table",
    caption: "Innovation starts with collaboration",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    alt: "A team working together",
    caption: "Building ideas together",
  },
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200",
    alt: "Team collaborating with computers",
    caption: "Turning ideas into reality",
  },
];

export function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, 3000);

  return () => clearInterval(interval);
}, []);

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-12">
          Previous Highlights
        </h2>
	<p className="text-center text-lg mt-6 text-gray-300">
          {images[currentIndex].caption}
        </p>

        <div className="relative max-w-5xl mx-auto">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="w-full h-[450px] object-cover rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}

