import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Plus, Edit, Trash2, LogOut, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PresenceManager from "@/components/PresenceManager";

const Admin = () => {
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("news");
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    summary: "",
  });

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "اجتماع أسبوعي",
      date: "2024-06-20",
      description: "اجتماع دوري لمناقشة الأنشطة",
    },
    {
      id: 2,
      title: "رحلة استكشافية",
      date: "2024-06-25",
      description: "رحلة لاستكشاف الطبيعة",
    },
    {
      id: 3,
      title: "ورشة مهارات",
      date: "2024-06-30",
      description: "ورشة تطوير المهارات الكشفية",
    },
  ]);

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
    navigate("/");
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.description) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({ title: "", date: "", description: "" });
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
    setEvents(events.filter((event) => event.id !== id));
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
      setNewNews({ title: "", content: "", summary: "" });
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                لوحة الإدارة
              </h1>
              <p className="text-xl">إدارة الجدول والأخبار والحضور</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-sm">مرحباً، {user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 space-x-reverse bg-white text-scout-green px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Panel */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex space-x-1 space-x-reverse bg-gray-200 p-1 rounded-lg mb-8">
            <button
              onClick={() => setActiveTab("news")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "news"
                  ? "bg-white text-scout-green shadow-sm"
                  : "text-gray-500 hover:text-scout-green"
              }`}
            >
              إدارة الأخبار
            </button>
            <button
              onClick={() => setActiveTab("presence")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "presence"
                  ? "bg-white text-scout-green shadow-sm"
                  : "text-gray-500 hover:text-scout-green"
              }`}
            >
              كشف الحضور
            </button>
          </div>

         

          {/* News Management */}
          {activeTab === "news" && (
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
                    onChange={(e) =>
                      setNewNews({ ...newNews, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  />
                  <textarea
                    placeholder="ملخص الخبر"
                    value={newNews.summary}
                    onChange={(e) =>
                      setNewNews({ ...newNews, summary: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  />
                  <textarea
                    placeholder="محتوى الخبر الكامل"
                    value={newNews.content}
                    onChange={(e) =>
                      setNewNews({ ...newNews, content: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  />
                  <button onClick={handleAddNews} className="scout-btn-primary">
                    نشر الخبر
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="scout-card p-6 text-center">
                  <div className="text-3xl font-bold text-scout-green mb-2">
                    24
                  </div>
                  <div className="text-gray-600">الأخبار المنشورة</div>
                </div>
                <div className="scout-card p-6 text-center">
                  <div className="text-3xl font-bold text-scout-brown mb-2">
                    156
                  </div>
                  <div className="text-gray-600">المشاهدات الشهرية</div>
                </div>
                <div className="scout-card p-6 text-center">
                  <div className="text-3xl font-bold text-scout-green mb-2">
                    8
                  </div>
                  <div className="text-gray-600">الأحداث القادمة</div>
                </div>
              </div>
            </div>
          )}

          {/* Presence Management */}
          {activeTab === "presence" && <PresenceManager />}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
