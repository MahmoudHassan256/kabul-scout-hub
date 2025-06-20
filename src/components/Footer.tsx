const Footer = () => {
  return (
    <footer className="bg-scout-green text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">سرية كابول الكشفية</h3>
            <p className="text-gray-300">
              نحن نعمل على بناء جيل واعٍ ومتميز وتهدف سريتنا لتنشأة جيل ملتزم
              بقيمه الاسلامية
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">روابط مهمة</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="/about"
                  className="hover:text-scout-brown transition-colors"
                >
                  عن السرية
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  className="hover:text-scout-brown transition-colors"
                >
                  الأخبار
                </a>
              </li>
              <li>
                <a
                  href="/photos"
                  className="hover:text-scout-brown transition-colors"
                >
                  الصور
                </a>
              </li>
              <li>
                <a
                  href="/videos"
                  className="hover:text-scout-brown transition-colors"
                >
                  الفيديوهات
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <div className="text-gray-300 space-y-2">
              <p>كابول - مركز البسملة</p>
              <p>البريد الإلكتروني:</p>
              <a href="mailto:Islamikashaf@gmail.com">Islamikashaf@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="border-t border-scout-green-light mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 سرية كابول الكشفية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
