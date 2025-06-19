import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "../integrations/supabase/client";
import { TablesInsert } from "../integrations/supabase/types";

const NewsManager = () => {
  const logoImg = "/logo.png";
  const { toast } = useToast();
  const [news, setNews] = useState<TablesInsert<"news_items">[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNews, setEditingNews] =
    useState<TablesInsert<"news_items"> | null>(null);
  const [newNews, setNewNews] = useState<TablesInsert<"news_items">>({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    category: "عام", // or null if you want it optional
    isPublished: true,
    publishDate: new Date().toISOString(), // or null if generated in DB
  });

  useEffect(() => {
    fetchNews();
  });

  async function fetchNews() {
    const { data, error } = await supabase.from("news_items").select("*");

    if (error) {
      console.error("Error fetching news:", error);
    }
    setNews(data.length > 0 ? data : []);
  }
  const resetForm = () => {
    setNewNews({
      title: "",
      summary: "",
      content: "",
      category: "عام",
      imageUrl: "",
    });
    setEditingNews(null);
    setShowAddForm(false);
  };

  const handleAddNews = async () => {
    if (!newNews.title || !newNews.summary || !newNews.content) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const newsItem: TablesInsert<"news_items"> = {
      title: newNews.title,
      summary: newNews.summary,
      content: newNews.content,
      imageUrl:
        newNews.imageUrl && newNews.imageUrl.trim() !== ""
          ? newNews.imageUrl
          : logoImg,
      category: newNews.category ?? null,
      isPublished: true,
      publishDate: new Date().toISOString().split("T")[0],
    };

    const { error } = await supabase.from("news_items").insert([newsItem]);
    if (error) {
      toast({
        title: "فشل الإضافة",
        description: "حدث خطأ أثناء إضافة الخبر",
        variant: "destructive",
      });
      console.error("Supabase insert error:", error.message, error.details);
    } else {
      console.log(newsItem);

      resetForm();
      toast({
        title: "تم إضافة الخبر",
        description: "تم نشر الخبر الجديد بنجاح",
      });
    }
  };

  const handleEditNews = async () => {
    if (
      !editingNews ||
      !newNews.title ||
      !newNews.summary ||
      !newNews.content
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase
      .from("news_items")
      .update({
        title: newNews.title,
        summary: newNews.summary,
        content: newNews.content,
        category: newNews.category ?? null,
        imageUrl: newNews.imageUrl ?? null,
        isPublished: newNews.isPublished ?? false,
        publishDate: newNews.publishDate ?? new Date().toISOString(),
      })
      .eq("id", editingNews.id);
    if (error) {
      toast({
        title: "فشل التحديث",
        description: "حدث خطأ أثناء تحديث الخبر. حاول مرة أخرى.",
        variant: "destructive",
      });
      console.error("Update news error:", error);
      return;
    }
    resetForm();
    toast({
      title: "تم تحديث الخبر",
      description: "تم تحديث الخبر بنجاح",
    });
  };

  const handleDeleteNews = async (id: string) => {
    const { error } = await supabase.from("news_items").delete().eq("id", id);
    if (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم حذف الخبر. حاول مرة أخرى.",
      });
      console.error("Delete news error:", error);
      return;
    }
    toast({
      title: "تم حذف الخبر",
      description: "تم حذف الخبر بنجاح",
    });
  };

  const togglePublishStatus = async (id: string) => {
    // Find the news item by id in your local state
    const newsItem = news.find((item) => item.id === id);
    if (!newsItem) {
      toast({
        title: "خطأ",
        description: "العنصر غير موجود",
        variant: "destructive",
      });
      return;
    }

    const newStatus = !newsItem.isPublished;

    const { error } = await supabase
      .from("news_items")
      .update({ isPublished: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "فشل التحديث",
        description: "حدث خطأ أثناء تحديث حالة النشر. حاول مرة أخرى.",
        variant: "destructive",
      });
      console.error("Update news error:", error);
      return;
    }

    toast({
      title: "تم تحديث حالة النشر",
      description: "تم تحديث حالة النشر بنجاح",
    });
  };

  const startEdit = (newsItem) => {
    setEditingNews(newsItem);
    setNewNews({
      title: newsItem.title,
      summary: newsItem.summary,
      content: newsItem.content,
      category: newsItem.category,
      imageUrl: newsItem.imageUrl || "",
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="scout-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-scout-green">
            {editingNews ? "تعديل الخبر" : "إضافة خبر جديد"}
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="scout-btn-primary flex items-center space-x-2 space-x-reverse"
          >
            <Plus size={20} />
            <span>خبر جديد</span>
          </button>
        </div>

        {showAddForm && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="عنوان الخبر"
                value={newNews.title}
                onChange={(e) =>
                  setNewNews({ ...newNews, title: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              />
              <select
                value={newNews.category}
                onChange={(e) =>
                  setNewNews({ ...newNews, category: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              >
                <option value="عام">عام</option>
                <option value="أنشطة">أنشطة</option>
                <option value="رحلات">رحلات</option>
                <option value="إعلانات">إعلانات</option>
              </select>
            </div>
            <input
              type="url"
              placeholder="رابط الصورة (اختياري)"
              value={newNews.imageUrl}
              onChange={(e) =>
                setNewNews({ ...newNews, imageUrl: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
            />
            <textarea
              placeholder="ملخص الخبر"
              value={newNews.summary}
              onChange={(e) =>
                setNewNews({ ...newNews, summary: e.target.value })
              }
              rows={3}
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
            <div className="flex space-x-4 space-x-reverse">
              <button
                onClick={editingNews ? handleEditNews : handleAddNews}
                className="scout-btn-primary"
              >
                {editingNews ? "تحديث الخبر" : "نشر الخبر"}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      {/* News List */}
      <div className="scout-card p-6">
        <h3 className="text-xl font-bold text-scout-green mb-6">
          الأخبار المنشورة
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right bg-scout-green">
                  العنوان
                </TableHead>
                <TableHead className="text-right bg-scout-green">
                  التصنيف
                </TableHead>
                <TableHead className="text-right bg-scout-green">
                  تاريخ النشر
                </TableHead>
                <TableHead className="text-right bg-scout-green">
                  ملخص الخبر
                </TableHead>
                <TableHead className="text-center bg-scout-green">
                  الحالة
                </TableHead>
                <TableHead className="text-center bg-scout-green">
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((item: TablesInsert<"news_items">) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.publishDate.split("T")[0]}</TableCell>
                  <TableCell className="text-center truncate max-w-[200px]">
                    {item.summary}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        item.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.isPublished ? "منشور" : "مخفي"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => togglePublishStatus(item.id)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        {item.isPublished ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="scout-card p-6 text-center">
          <div className="text-3xl font-bold text-scout-green mb-2">
            {news.length}
          </div>
          <div className="text-gray-600">إجمالي الأخبار</div>
        </div>
        <div className="scout-card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {news.filter((item) => item.isPublished).length}
          </div>
          <div className="text-gray-600">الأخبار المنشورة</div>
        </div>
        <div className="scout-card p-6 text-center">
          <div className="text-3xl font-bold text-gray-600 mb-2">
            {news.filter((item) => !item.isPublished).length}
          </div>
          <div className="text-gray-600">الأخبار المخفية</div>
        </div>
      </div>
    </div>
  );
};

export default NewsManager;
