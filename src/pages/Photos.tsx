import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  images1,
  images2,
  images3,
  images4,
  images5,
  images6,
  images7,
} from "../assist/photos/index";
const Photos = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const defaultPhotos = [
    { src: images1 },
    { src: images2 },
    { src: images3 },
    { src: images4 },
    { src: images5 },
    { src: images6 },
    { src: images7 },
  ];
  const [photos, setPhotos] = useState(defaultPhotos);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-scout-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">معرض الصور</h1>
          <p className="text-xl">استعرض أجمل اللحظات من أنشطتنا الكشفية</p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {photos.map((photo, key) => (
              <div
                key={key}
                className="scout-card overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedPhoto(photo.src)}
              >
                <img
                  src={photo.src}
                  alt=""
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for enlarged photo */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="صورة مكبرة"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Photos;
