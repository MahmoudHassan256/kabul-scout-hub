import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";

const News = () => {
  const news = [
    {
      id: 1,
      title: "انطلاق المخيم الصيفي 2024",
      date: "2024-06-15",
      summary: "بدء فعاليات المخيم الصيفي لهذا العام بمشاركة واسعة من الكشافة",
      content:
        "انطلقت فعاليات المخيم الصيفي السنوي لسرية كابول الكشفية بحضور أكثر من 50 كشاف من مختلف الأعمار. يتضمن المخيم العديد من الأنشطة التعليمية والترفيهية والمغامرات في الطبيعة.",
      image:
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      title: "ورشة مهارات البقاء في الطبيعة",
      date: "2024-06-10",
      summary: "ورشة متخصصة لتعليم مهارات البقاء الأساسية في البيئات المختلفة",
      content:
        "نظمت السرية ورشة متخصصة لتعليم مهارات البقاء في الطبيعة، شملت تعلم كيفية إشعال النار، تنقية المياه، والتوجه باستخدام البوصلة. شارك في الورشة 30 كشاف تحت إشراف خبراء متخصصين.",
      image:
        "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      title: "احتفالية اليوم العالمي للكشافة",
      date: "2024-05-22",
      summary: "احتفال خاص باليوم العالمي للكشافة مع فعاليات متنوعة",
      content:
        "احتفلت سرية كابول الكشفية باليوم العالمي للكشافة من خلال تنظيم فعاليات متنوعة شملت العروض الكشفية، المسابقات الثقافية، والأنشطة الرياضية. كما تم تكريم الكشافة المتميزين خلال هذا العام.",
      image:
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop",
    },
    {
      id: 4,
      title: "حملة تنظيف البيئة",
      date: "2024-05-15",
      summary: "مشاركة فعالة في حملة تنظيف البيئة والمحافظة على الطبيعة",
      content:
        "شاركت السرية في حملة واسعة لتنظيف البيئة والمحافظة على الطبيعة، حيث تم تنظيف عدة مواقع طبيعية وزراعة أشجار جديدة. هذه المبادرة تأتي ضمن التزام السرية بالمسؤولية البيئية.",
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-scout-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">أخبار السرية</h1>
          <p className="text-xl">تابع آخر أخبار وفعاليات سرية كابول الكشفية</p>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {news.map((article) => (
              <article key={article.id} className="scout-card overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={16} className="ml-1" />
                      {new Date(article.date).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h2 className="text-2xl font-bold text-scout-green mb-3">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4 text-lg">
                      {article.summary}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
