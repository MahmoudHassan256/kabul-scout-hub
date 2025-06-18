
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Videos = () => {
  const videos = [
    {
      id: 1,
      title: 'رحلة المخيم الصيفي 2024',
      description: 'تسجيل لأجمل لحظات المخيم الصيفي وأنشطته المتنوعة',
      thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop',
      embedId: 'dQw4w9WgXcQ' // Example YouTube video ID
    },
    {
      id: 2,
      title: 'تدريبات الكشافة الأساسية',
      description: 'دليل شامل للتدريبات الأساسية في الكشافة',
      thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop',
      embedId: 'dQw4w9WgXcQ'
    },
    {
      id: 3,
      title: 'مغامرة في الطبيعة',
      description: 'استكشاف الطبيعة وتعلم مهارات البقاء',
      thumbnail: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop',
      embedId: 'dQw4w9WgXcQ'
    },
    {
      id: 4,
      title: 'فعاليات اليوم العالمي للكشافة',
      description: 'احتفالية خاصة باليوم العالمي للكشافة',
      thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      embedId: 'dQw4w9WgXcQ'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-scout-brown text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">مكتبة الفيديو</h1>
          <p className="text-xl">شاهد فيديوهات أنشطتنا ومغامراتنا الكشفية</p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="scout-card overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-scout-green border-y-[8px] border-y-transparent mr-1"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-scout-green mb-2">{video.title}</h3>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <button className="scout-btn-primary text-sm">
                    مشاهدة الفيديو
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-scout-green mb-8">
            الفيديو المميز
          </h2>
          <div className="scout-card overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              <img 
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=450&fit=crop"
                alt="الفيديو المميز"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[16px] border-l-scout-green border-y-[12px] border-y-transparent mr-1"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-scout-green mb-2">
                رحلة كابول الكشفية الكبرى 2024
              </h3>
              <p className="text-gray-600 text-lg">
                شاهد أهم أحداث ولحظات رحلتنا الكشفية الكبرى لهذا العام، مليئة بالمغامرات والتعلم والصداقات الجديدة.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Videos;
