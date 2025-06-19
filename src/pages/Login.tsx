
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already authenticated, redirect to admin
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await signup(email, password, fullName);
      }

      if (result.error) {
        toast({
          title: isLogin ? "خطأ في تسجيل الدخول" : "خطأ في إنشاء الحساب",
          description: result.error,
          variant: "destructive",
        });
      } else {
        if (isLogin) {
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بك في لوحة الإدارة",
          });
          navigate('/admin');
        } else {
          toast({
            title: "تم إنشاء الحساب بنجاح",
            description: "يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب",
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scout-card p-8">
            <div className="text-center mb-8">
              {isLogin ? (
                <LogIn className="mx-auto mb-4 text-scout-green" size={48} />
              ) : (
                <UserPlus className="mx-auto mb-4 text-scout-green" size={48} />
              )}
              <h1 className="text-3xl font-bold text-scout-green mb-2">
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'دخول لوحة إدارة سرية كابول الكشفية' 
                  : 'إنشاء حساب جديد للوصول إلى لوحة الإدارة'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  placeholder="admin@kabul-scouts.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full scout-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? (isLogin ? 'جاري تسجيل الدخول...' : 'جاري إنشاء الحساب...')
                  : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')
                }
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-scout-green hover:underline"
              >
                {isLogin 
                  ? 'ليس لديك حساب؟ إنشاء حساب جديد' 
                  : 'لديك حساب بالفعل؟ تسجيل الدخول'
                }
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
