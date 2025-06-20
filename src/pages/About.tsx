import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-scout-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            عن سرية كابول الكشفية
          </h1>
          <p className="text-xl">تعرف على تاريخنا ورسالتنا وأهدافنا</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="scout-card p-8 mb-8">
              <h2 className="text-3xl font-bold text-scout-green mb-6">
                من نحن
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                تأسست سرية كابول الكشفية في عام 2004 تحت إطار مركز البسلمة
                لتحفيظ القرآن الكريم في قريتنا كابول. تهدف سريتنا لتنشأة جيل واع
                وملتزم بقيمه الاسلامية من خلال فعاليات وبرامج وحصص تأهيل.
              </p>
            </div>

            <div className="scout-card p-8 mb-8">
              <h2 className="text-3xl font-bold text-scout-green mb-6">
                رسالتنا
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                تقديم برنامج شامل كل المبادرات الكشفية والإسلامية بطرق خارجة عن
                المألوف من خلال كادر قيادي كشفي في بيئة تربوية حاضنة للإبداع
                والقيادة ومحافظة على نهج الدين.
              </p>
            </div>

            <div className="scout-card p-8 mb-8">
              <h2 className="text-3xl font-bold text-scout-green mb-6">
                قيمنا
              </h2>
              <ul className="list-disc pr-6 text-gray-700 text-lg space-y-3">
                <li>المحافظة على شرع الله</li>
                <li>الانتماء</li>
                <li>العطاء</li>
                <li>الإخلاص</li>
                <li>الانضباط</li>
                <li>المسؤولية الجماعية</li>
              </ul>
            </div>

            <div className="scout-card p-8 mb-8">
              <h2 className="text-3xl font-bold text-scout-green mb-6">
                الفئات العمرية التي نستقطبها
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                تستقطب سريتنا الكشفية جميع الفئات العمرية من مرحلة الأشبال حتى
                المراحل المتقدمة القيادية الأشبال من صف رابع حتى صف تاسع المراحل
                المتقدمة من صف عاشر وما فوق
              </p>
            </div>

            <div className="scout-card p-8 ">
              <h2 className="text-3xl font-bold text-scout-green mb-6 text-center">
                قيادة السرية
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-scout-green rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    ق.هـ
                  </div>
                  <h3 className="text-lg font-semibold text-scout-green">
                    قاسم ابو الهيجاء
                  </h3>
                  <p className="text-gray-600">ادارة</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-scout-green rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    أ.م
                  </div>
                  <h3 className="text-lg font-semibold text-scout-green">
                    احمد مرشد
                  </h3>
                  <p className="text-gray-600">ادارة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
