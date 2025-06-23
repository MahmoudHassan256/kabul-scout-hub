import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Phone, Calendar, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablesInsert } from "../integrations/supabase/types";
import { supabase } from "../integrations/supabase/client";

const ScoutManager = () => {
  const ages = [
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "ما فوق الثانوية",
  ];

  const { toast } = useToast();
  const [scouts, setScouts] = useState<TablesInsert<"scouts">[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScout, setEditingScout] =
    useState<TablesInsert<"scouts">>(null);
  const [newScout, setNewScout] = useState<TablesInsert<"scouts">>({
    fullName: "",
    class: ages[0],
    phone: "",
    parentPhone: "",
    hasHealthProblem: "",
    joinDate: "",
  });

  // Function to sort scouts by class order
  const sortScoutsByClass = (scoutsArray) => {
    return scoutsArray.sort((a, b) => {
      const indexA = ages.indexOf(a.class);
      const indexB = ages.indexOf(b.class);

      // If class is not found in ages array, put it at the end
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  };

  useEffect(() => {
    fetchScouts();
    const interval = setInterval(fetchScouts, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  async function fetchScouts() {
    const { data, error } = await supabase.from("scouts").select("*");
    if (error) {
      console.error("Error fetching scouts:", error);
    }
    const sortedData = data?.length > 0 ? sortScoutsByClass(data) : [];
    setScouts(sortedData);
  }

  const resetForm = () => {
    setNewScout({
      fullName: "",
      class: ages[0],
      phone: "",
      parentPhone: "",
      hasHealthProblem: "",
      joinDate: "",
    });
    setEditingScout(null);
    setShowAddForm(false);
  };

  const handleAddScout = async () => {
    if (!newScout.fullName || !newScout.class || !newScout.parentPhone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الاسم والعمر وهاتف الاهل على الأقل",
        variant: "destructive",
      });
      return;
    }

    const newItem: TablesInsert<"scouts"> = {
      fullName: newScout.fullName,
      class: newScout.class,
      joinDate: new Date().toISOString().split("T")[0],
      phone: newScout.phone || undefined,
      parentPhone: newScout.parentPhone || undefined,
      hasHealthProblem: newScout.hasHealthProblem || undefined,
    };

    const { error } = await supabase.from("scouts").insert([newItem]);
    if (error) {
      toast({
        title: "فشل الإضافة",
        description: "حدث خطأ أثناء إضافة الطالب",
        variant: "destructive",
      });
      console.error("Supabase insert error:", error.message, error.details);
    } else {
      resetForm();
      toast({
        title: "تم إضافة الكشاف",
        description: `تم إضافة ${newScout.fullName} بنجاح`,
      });
    }
  };

  const handleEditScout = async () => {
    if (
      !editingScout ||
      !newScout.fullName ||
      !newScout.class ||
      !newScout.parentPhone
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الاسم والعمر وهاتف الاهل على الأقل",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("scouts")
      .update({
        class: newScout.class,
        fullName: newScout.fullName,
        parentPhone: newScout.parentPhone,
        hasHealthProblem: newScout.hasHealthProblem ?? null,
        phone: newScout.phone ?? null,
      })
      .eq("id", editingScout.id);
    if (error) {
      toast({
        title: "فشل التحديث",
        description: "حدث خطأ أثناء تحديث معلومات الطالب. حاول مرة أخرى.",
        variant: "destructive",
      });
      console.error("Update scouts error:", error);
      return;
    }
    resetForm();
    toast({
      title: "تم تحديث البيانات",
      description: `تم تحديث بيانات ${newScout.fullName} بنجاح`,
    });
  };

  const handleDeleteScout = async (id: string) => {
    const { error } = await supabase.from("scouts").delete().eq("id", id);
    if (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم حذف الطالب. حاول مرة أخرى.",
      });
      console.error("Delete scouts error:", error);
      return;
    }
    toast({
      title: "تم حذف الكشاف",
      description: `تم حذف الكشاف من القائمة`,
    });
  };

  const startEdit = (scout: TablesInsert<"scouts">) => {
    setEditingScout(scout);
    setNewScout({
      fullName: scout.fullName,
      class: scout.class,
      phone: scout.phone || "",
      parentPhone: scout.parentPhone,
      hasHealthProblem: scout.hasHealthProblem,
    });
    setShowAddForm(true);
  };

  const exportToPDF = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast({
        title: "خطأ",
        description:
          "لم يتمكن من فتح نافذة الطباعة. تأكد من السماح للنوافذ المنبثقة.",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date().toLocaleDateString("ar-EG");

    // Sort scouts for PDF export as well
    const sortedScoutsForPDF = sortScoutsByClass([...scouts]);

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>قائمة الكشافة</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 20px;
            direction: rtl;
            text-align: right;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2d5016;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #2d5016;
            margin: 10px 0;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .stat-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            background-color: #f9fafb;
          }
          .stat-number {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .stat-label {
            color: #6b7280;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 12px 8px;
            text-align: center;
          }
          th {
            background-color: #2d5016;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .no-data {
            color: #9ca3af;
            font-style: italic;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .stats { grid-template-columns: repeat(2, 1fr); }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>قائمة الكشافة</h1>
          <p>تاريخ التصدير: ${currentDate}</p>
        </div>
        

        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الصف</th>
              <th>الهاتف</th>
              <th>هاتف ولي الأمر</th>
              <th>المشاكل الصحية</th>
            </tr>
          </thead>
          <tbody>
            ${sortedScoutsForPDF
              .map(
                (scout) => `
              <tr>
                <td>${scout.fullName}</td>
                <td>${scout.class}</td>
                <td>${
                  scout.phone || '<span class="no-data">غير متوفر</span>'
                }</td>
                <td>${
                  scout.parentPhone || '<span class="no-data">غير متوفر</span>'
                }</td>
                <td>${
                  scout.hasHealthProblem ||
                  '<span class="no-data">لا يوجد</span>'
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>تم إنشاء هذا التقرير بواسطة نظام إدارة الكشافة - ${currentDate}</p>
        </div>
      </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.print();
      // Close the window after printing (optional)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };

    toast({
      title: "تصدير PDF",
      description: "تم فتح نافذة الطباعة. اختر 'حفظ كـ PDF' من خيارات الطابعة.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="scout-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-scout-green">
            {editingScout ? "تعديل بيانات الكشاف" : "إضافة كشاف جديد"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="scout-btn-primary flex items-center space-x-2 space-x-reverse"
            >
              <Plus size={20} />
              <span>كشاف جديد</span>
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="اسم الكشاف"
                value={newScout.fullName}
                onChange={(e) =>
                  setNewScout({ ...newScout, fullName: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              />
              <select
                value={newScout.class}
                onChange={(e) =>
                  setNewScout({ ...newScout, class: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              >
                {ages.map((ele) => (
                  <option key={ele} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="رقم الهاتف (اختياري)"
                dir="rtl"
                value={newScout.phone}
                onChange={(e) =>
                  setNewScout({ ...newScout, phone: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              />
              <input
                type="tel"
                dir="rtl"
                placeholder="رقم هاتف ولي الأمر"
                value={newScout.parentPhone}
                onChange={(e) =>
                  setNewScout({ ...newScout, parentPhone: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              />
              <input
                type="text"
                placeholder="اعاني من مشاكل صحية قد تؤثر علي خلال الرحلات او التمارين الشاقة"
                value={newScout.hasHealthProblem}
                onChange={(e) =>
                  setNewScout({ ...newScout, hasHealthProblem: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              />
              <div className="flex space-x-4 space-x-reverse">
                <button
                  onClick={editingScout ? handleEditScout : handleAddScout}
                  className="scout-btn-primary"
                >
                  {editingScout ? "تحديث البيانات" : "إضافة الكشاف"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scouts List */}
      <div className="scout-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-scout-green mb-6">
            قائمة الكشافة (مرتبة حسب الصف)
          </h3>
          <button
            onClick={exportToPDF}
            className="flex items-center px-4 py-2 bg-scout-green text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="ml-2" size={16} />
            تصدير PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-scout-green text-right">
                  الاسم
                </TableHead>
                <TableHead className="bg-scout-green text-center">
                  الصف
                </TableHead>

                <TableHead className="bg-scout-green text-center">
                  الهاتف
                </TableHead>
                <TableHead className="bg-scout-green text-center">
                  هاتف ولي الأمر
                </TableHead>
                <TableHead className="bg-scout-green text-center">
                  اعاني من مشاكل صحية
                </TableHead>
                <TableHead className="bg-scout-green text-center">
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scouts.map((scout) => (
                <TableRow key={scout.id}>
                  <TableCell className="font-medium">
                    {scout.fullName}
                  </TableCell>
                  <TableCell className="text-center">{scout.class}</TableCell>
                  <TableCell className="text-center">
                    {scout.phone ? (
                      <div className="flex items-center justify-center space-x-1 space-x-reverse">
                        <Phone size={14} />
                        <span>{scout.phone}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">غير متوفر</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {scout.parentPhone ? (
                      <div className="flex items-center justify-center space-x-1 space-x-reverse">
                        <Phone size={14} />
                        <span>{scout.parentPhone}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">غير متوفر</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {scout.hasHealthProblem ? (
                      <div className="flex items-center justify-center space-x-1 space-x-reverse">
                        <span>{scout.hasHealthProblem}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">لا يوجد</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => startEdit(scout)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteScout(scout.id)}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="scout-card p-6 text-center">
          <div className="text-3xl font-bold text-scout-green mb-2">
            {scouts.length}
          </div>
          <div className="text-gray-600">إجمالي الكشافة</div>
        </div>
        <div className="scout-card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {scouts.filter((scout) => ages.indexOf(scout.class) + 4 < 7).length}
          </div>
          <div className="text-gray-600">ابتدائي</div>
        </div>
        <div className="scout-card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {
              scouts.filter(
                (scout) =>
                  ages.indexOf(scout.class) + 4 >= 7 &&
                  ages.indexOf(scout.class) + 4 <= 12
              ).length
            }
          </div>
          <div className="text-gray-600">اعدادي وثانوي</div>
        </div>
        <div className="scout-card p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {scouts.filter((scout) => scout.class === "ما فوق الثانوية").length}
          </div>
          <div className="text-gray-600">ما فوق الثانوي</div>
        </div>
      </div>
    </div>
  );
};

export default ScoutManager;
