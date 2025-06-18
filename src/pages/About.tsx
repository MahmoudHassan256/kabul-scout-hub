
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-scout-brown text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">عن سرية كابول الكشفية</h1>
          <p className="text-xl">تعرف على تاريخنا ورسالتنا وأهدافنا</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="scout-card p-8 mb-8">
              <h2 className="text-3xl font-bold text-scout-green mb-6">رسالتنا</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                نحن في سرية كابول الكشفية نسعى إلى بناء جيل واعٍ ومتميز من خلال تطبيق المبادئ الكشفية الأساسية 
                والتركيز على تنمية الشخصية المتكاملة للشباب. نعمل على غرس القيم النبيلة وتطوير المهارات القيادية 
                والاجتماعية لدى أعضائنا من خلال الأنشطة المتنوعة والمغامرات الهادفة.
              </p>
            </div>

            <div className="scout-card p-8 mb-8">
              <h2 className="text-3xl font-bold text-scout-green mb-6">تاريخنا</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                تأسست سرية كابول الكشفية عام 2010 كمبادرة من مجموعة من الشباب المتحمس للعمل الكشفي. 
                بدأنا بعدد قليل من الأعضاء ونما العدد تدريجياً ليصل اليوم إلى أكثر من 100 عضو نشط. 
                على مدار السنوات، حققت السرية العديد من الإنجازات على المستوى المحلي والوطني، 
                وشاركت في مخيمات وفعاليات كشفية متنوعة.
              </p>
            </div>

            <div className="scout-card p-8 mb-8">
              <h2 className="text-3xl font-bold text-scout-green mb-6">أهدافنا</h2>
              <ul className="list-disc pr-6 text-gray-700 text-lg space-y-3">
                <li>تنمية الشخصية المتكاملة للشباب جسدياً وعقلياً وروحياً</li>
                <li>غرس القيم الإسلامية والوطنية النبيلة</li>
                <li>تطوير مهارات القيادة والعمل الجماعي</li>
                <li>تعزيز الثقة بالنفس والاعتماد على الذات</li>
                <li>تعليم مهارات البقاء والتكيف في البيئات المختلفة</li>
                <li>خدمة المجتمع والمساهمة في حل مشكلاته</li>
                <li>حماية البيئة والمحافظة على الطبيعة</li>
              </ul>
            </div>

            <div className="scout-card p-8 mb-8">
              <h2 className="text-3xl font-bold text-scout-green mb-6">أنشطتنا</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-scout-brown mb-3">الأنشطة الخارجية</h3>
                  <ul className="list-disc pr-6 text-gray-700 space-y-2">
                    <li>المخيمات الصيفية والشتوية</li>
                    <li>رحلات استكشافية في الطبيعة</li>
                    <li>تسلق الجبال والمشي لمسافات طويلة</li>
                    <li>أنشطة الرياضات المائية</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-scout-brown mb-3">الأنشطة التعليمية</h3>
                  <ul className="list-disc pr-6 text-gray-700 space-y-2">
                    <li>ورش تطوير المهارات القيادية</li>
                    <li>دورات الإسعافات الأولية</li>
                    <li>تعلم فنون الحرف اليدوية</li>
                    <li>برامج تطوير الذات</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="scout-card p-8">
              <h2 className="text-3xl font-bold text-scout-green mb-6">قيادة السرية</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-scout-green rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    ع.م
                  </div>
                  <h3 className="text-lg font-semibold text-scout-green">عبد الله محمد</h3>
                  <p className="text-gray-600">قائد السرية</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-scout-brown rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    أ.ح
                  </div>
                  <h3 className="text-lg font-semibold text-scout-brown">احمد حسن</h3>
                  <p className="text-gray-600">نائب قائد السرية</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-scout-green rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    م.ع
                  </div>
                  <h3 className="text-lg font-semibold text-scout-green">محمد علي</h3>
                  <p className="text-gray-600">أمين السر</p>
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
