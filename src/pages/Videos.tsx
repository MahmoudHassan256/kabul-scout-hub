import React, { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  videos1,
  videos2,
  videos3,
  videos4,
  videos5,
  videos6,
  videos7,
} from "../assist/videos/index";

const defaultVideos = [
  { src: videos1 },
  { src: videos2 },
  { src: videos3 },
  { src: videos4 },
  { src: videos5 },
  { src: videos6 },
  { src: videos7 },
];

function VideoModal({
  videoSrc,
  onClose,
}: {
  videoSrc: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleBackgroundClick = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={handleBackgroundClick}
    >
      <div
        className="relative w-full max-w-3xl p-4"
        onClick={stopPropagation} // prevent closing when clicking on the video area
      >
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full rounded-lg"
          controls
          autoPlay
        />
        <button
          onClick={handleBackgroundClick}
          className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 p-2 rounded-full"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function VideoCard({
  video,
  onClick,
}: {
  video: { src: string };
  onClick: () => void;
}) {
  return (
    <div
      className="scout-card overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video bg-gray-200 relative">
        <video
          src={video.src}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex flex-col items-center justify-center text-center text-scout-green font-semibold text-sm shadow-lg transition hover:scale-105">
            <div className="w-0 h-0 border-l-[14px] border-l-scout-green border-y-[10px] border-y-transparent mb-1"></div>
            <span className="text-xs text-scout-green">اضغط للمشاهدة</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Videos() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState(defaultVideos);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-scout-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">مكتبة الفيديو</h1>
          <p className="text-xl">شاهد فيديوهات أنشطتنا ومغامراتنا الكشفية</p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
              <VideoCard
                key={index}
                video={video}
                onClick={() => setActiveVideo(video.src)}
              />
            ))}
          </div>
        </div>
      </section>

      {activeVideo && (
        <VideoModal
          videoSrc={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default Videos;
