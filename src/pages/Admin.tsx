
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('schedule');
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });
  const [newNews, setNewNews] = useState({ title: '', content: '', summary: '' });
  
  const [events, setEvents] = useState([
    { id: 1, title: 'اجتماع أسبوعي', date: '2024-06-20', description: 'اجتماع دوري لمناقشة الأنشطة' },
    { id: 2, title: 'رحلة استكشافية', date: '2024-06-25', description: 'رحلة لاستكشاف الطبيعة' },
    { id: 3, title: 'ورشة مهارات', date: '2024-06-30', description: 'ورشة تطوير المهارات الكشفية' }
  ]);

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.description) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({ title: '', date: '', description: '' });
      toast({
        title: "تم إضافة الحدث بنجاح",
        description: "تم إضافة الحدث الجديد إلى الجدول",
      });
    } else {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "تم حذف الحدث",
      description: "تم حذف الحدث من الجدول بنجاح",
    });
  };

  const handleAddNews = () => {
    if (newNews.title && newNews.content && newNews.summary) {
      toast({
        title: "تم إضافة الخبر بنجاح",
        description: "تم نشر الخبر الجديد",
      });
      setNewNews({ title: '', content: '', summary: '' });
    } else {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-scout-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">لوحة الإدارة</h1>
          <p className="text-xl">إدارة الجدول والأخبار</p>
        </div>
      </section>

      {/* Admin Panel */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex space-x-1 space-x-reverse bg-gray-200 p-1 rounded-lg mb-8">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-white text-scout-green shadow-sm'
                  : 'text-gray-500 hover:text-scout-green'
              }`}
            >
              إدارة الجدول
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'news'
                  ? 'bg-white text-scout-green shadow-sm'
                  : 'text-gray-500 hover:text-scout-green'
              }`}
            >
              إدارة الأخبار
            </button>
          </div>

          {/* Schedule Management */}
          {activeTab === 'schedule' && (
            <div className="space-y-8">
              {/* Add New Event */}
              <div className="scout-card p-6">
                <h2 className="text-2xl font-bold text-scout-green mb-6 flex items-center">
                  <Plus className="ml-2" size={24} />
                  إضافة حدث جديد
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="عنوان الحدث"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  />
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  />
                </div>
                <textarea
                  placeholder="وصف الحدث"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  rows={3}
                  className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                />
                <button
                  onClick={handleAddEvent}
                  className="scout-btn-primary mt-4"
                >
                  إضافة الحدث
                </button>
              </div>

              {/* Events List */}
              <div className="scout-card p-6">
                <h2 className="text-2xl font-bold text-scout-green mb-6 flex items-center">
                  <Calendar className="ml-2" size={24} />
                  الأحداث المجدولة
                </h2>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-scout-green">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {new Date(event.date).toLocaleDateString('ar-EG')}
                          </p>
                          <p className="text-gray-700">{event.description}</p>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* News Management */}
          {activeTab === 'news' && (
            <div className="space-y-8">
              {/* Add New News */}
              <div className="scout-card p-6">
                <h2 className="text-2xl font-bold text-scout-green mb-6 flex items-center">
                  <Plus className="ml-2" size={24} />
                  إضافة خبر جديد
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="عنوان الخبر"
                    value={newNews.title}
                    onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  />
                  <textarea
                    placeholder="ملخص الخبر"
                    value={newNews.summary}
                    onChange={(e) => setNewNews({...newNews, summary: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  />
                  <textarea
                    placeholder="محتوى الخبر الكامل"
                    value={newNews.content}
                    onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  />
                  <button
                    onClick={handleAddNews}
                    className="scout-btn-primary"
                  >
                    نشر الخبر
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="scout-card p-6 text-center">
                  <div className="text-3xl font-bold text-scout-green mb-2">24</div>
                  <div className="text-gray-600">الأخبار المنشورة</div>
                </div>
                <div className="scout-card p-6 text-center">
                  <div className="text-3xl font-bold text-scout-brown mb-2">156</div>
                  <div className="text-gray-600">المشاهدات الشهرية</div>
                </div>
                <div className="scout-card p-6 text-center">
                  <div className="text-3xl font-bold text-scout-green mb-2">8</div>
                  <div className="text-gray-600">الأحداث القادمة</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
