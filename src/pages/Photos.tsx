
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Photos = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=400&fit=crop',
      title: 'رحلة استكشافية في الطبيعة',
      description: 'رحلة جميلة في الغابات الخضراء'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop',
      title: 'مخيم صيفي',
      description: 'أجواء رائعة في المخيم الصيفي'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop',
      title: 'حياة برية',
      description: 'مراقبة الحياة البرية في الطبيعة'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
      title: 'قمة الجبل',
      description: 'تسلق الجبال والوصول للقمة'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop',
      title: 'ضباب الصباح',
      description: 'جمال الطبيعة في الصباح الباكر'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop',
      title: 'منظر جوي',
      description: 'صورة جوية للمناظر الطبيعية'
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo) => (
              <div 
                key={photo.id}
                className="scout-card overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedPhoto(photo.url)}
              >
                <img 
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-scout-green mb-2">{photo.title}</h3>
                  <p className="text-gray-600">{photo.description}</p>
                </div>
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
