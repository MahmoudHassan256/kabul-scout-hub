
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LogOut, Users, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import NewsManager from "@/components/NewsManager";
import ScoutManager from "@/components/ScoutManager";
import PresenceManager from "@/components/PresenceManager";

const Admin = () => {
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("news");

  const handleLogout = async () => {
    await logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
    navigate("/");
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
              <p className="text-xl">إدارة الأخبار والكشافة والحضور</p>
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
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 space-x-reverse ${
                activeTab === "news"
                  ? "bg-white text-scout-green shadow-sm"
                  : "text-gray-500 hover:text-scout-green"
              }`}
            >
              <FileText size={18} />
              <span>إدارة الأخبار</span>
            </button>
            <button
              onClick={() => setActiveTab("scouts")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 space-x-reverse ${
                activeTab === "scouts"
                  ? "bg-white text-scout-green shadow-sm"
                  : "text-gray-500 hover:text-scout-green"
              }`}
            >
              <Users size={18} />
              <span>إدارة الكشافة</span>
            </button>
            <button
              onClick={() => setActiveTab("presence")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 space-x-reverse ${
                activeTab === "presence"
                  ? "bg-white text-scout-green shadow-sm"
                  : "text-gray-500 hover:text-scout-green"
              }`}
            >
              <Calendar size={18} />
              <span>كشف الحضور</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "news" && <NewsManager />}
          {activeTab === "scouts" && <ScoutManager />}
          {activeTab === "presence" && <PresenceManager />}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
