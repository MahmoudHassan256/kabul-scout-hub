
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PresenceManager from "@/components/PresenceManager";
import { LogOut, Calendar } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Mobile-optimized Header */}
      <div className="bg-scout-green text-white py-4 sm:py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Calendar size={24} className="sm:hidden" />
              <div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">
                  كشف الحضور
                </h1>
                <p className="text-xs sm:text-sm text-green-100">
                  سرية كابول الكشفية
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 space-x-reverse bg-white text-scout-green px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base touch-target"
            >
              <LogOut size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <PresenceManager />
        </div>
      </div>
    </div>
  );
};

export default Admin;
