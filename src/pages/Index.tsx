
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Image, Video, Newspaper } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="scout-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            سرية كابول الكشفية
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            نبني المستقبل بخطوات واثقة وقلوب مؤمنة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Link to="/about" className="scout-btn-primary">
              تعرف علينا
            </Link>
            <Link to="/photos" className="scout-btn-secondary">
              شاهد صورنا
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-scout-green mb-12">
            استكشف محتوانا
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/photos" className="scout-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <Image className="mx-auto mb-4 text-scout-green" size={48} />
              <h3 className="text-xl font-semibold mb-2 text-scout-green">الصور</h3>
              <p className="text-gray-600">استعرض أجمل اللحظات من أنشطتنا الكشفية</p>
            </Link>
            
            <Link to="/videos" className="scout-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <Video className="mx-auto mb-4 text-scout-brown" size={48} />
              <h3 className="text-xl font-semibold mb-2 text-scout-brown">الفيديوهات</h3>
              <p className="text-gray-600">شاهد فيديوهات أنشطتنا ومغامراتنا</p>
            </Link>
            
            <Link to="/news" className="scout-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <Newspaper className="mx-auto mb-4 text-scout-green" size={48} />
              <h3 className="text-xl font-semibold mb-2 text-scout-green">الأخبار</h3>
              <p className="text-gray-600">اطلع على آخر أخبار وفعاليات السرية</p>
            </Link>
            
            <Link to="/admin" className="scout-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <Calendar className="mx-auto mb-4 text-scout-brown" size={48} />
              <h3 className="text-xl font-semibold mb-2 text-scout-brown">الجدول</h3>
              <p className="text-gray-600">تابع جدول الأنشطة والفعاليات القادمة</p>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-scout-green mb-6">
                مرحباً بكم في سرية كابول الكشفية
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                نحن مجموعة من الشباب المتحمس الذين يؤمنون بأهمية الكشافة في بناء الشخصية 
                وتنمية المهارات القيادية. نسعى إلى تقديم أنشطة متنوعة تهدف إلى تطوير 
                القدرات الجسدية والعقلية والروحية لأعضائنا.
              </p>
              <Link to="/about" className="scout-btn-primary">
                اقرأ المزيد
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={`https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=200&fit=crop`}
                alt="صورة كشفية"
                className="rounded-lg shadow-lg"
              />
              <img 
                src={`https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&h=200&fit=crop`}
                alt="صورة كشفية"
                className="rounded-lg shadow-lg mt-8"
              />
              <img 
                src={`https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=200&fit=crop`}
                alt="صورة كشفية"
                className="rounded-lg shadow-lg -mt-8"
              />
              <img 
                src={`https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop`}
                alt="صورة كشفية"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
