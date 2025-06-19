
import { useState } from "react";
import { Plus, Edit, Trash2, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Scout } from "@/types";
import { mockScouts } from "@/data/mockScouts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ScoutManager = () => {
  const { toast } = useToast();
  const [scouts, setScouts] = useState<Scout[]>(mockScouts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScout, setEditingScout] = useState<Scout | null>(null);
  const [newScout, setNewScout] = useState({
    name: "",
    age: "",
    phone: "",
    parentPhone: "",
  });

  const resetForm = () => {
    setNewScout({
      name: "",
      age: "",
      phone: "",
      parentPhone: "",
    });
    setEditingScout(null);
    setShowAddForm(false);
  };

  const handleAddScout = () => {
    if (!newScout.name || !newScout.age) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الاسم والعمر على الأقل",
        variant: "destructive",
      });
      return;
    }

    const scout: Scout = {
      id: Date.now(),
      name: newScout.name,
      age: parseInt(newScout.age),
      joinDate: new Date().toISOString().split('T')[0],
      pressence: [],
      phone: newScout.phone || undefined,
      parentPhone: newScout.parentPhone || undefined,
    };

    setScouts([...scouts, scout]);
    resetForm();
    toast({
      title: "تم إضافة الكشاف",
      description: `تم إضافة ${newScout.name} بنجاح`,
    });
  };

  const handleEditScout = () => {
    if (!editingScout || !newScout.name || !newScout.age) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الاسم والعمر على الأقل",
        variant: "destructive",
      });
      return;
    }

    setScouts(scouts.map(scout => 
      scout.id === editingScout.id 
        ? { 
            ...scout, 
            name: newScout.name,
            age: parseInt(newScout.age),
            phone: newScout.phone || undefined,
            parentPhone: newScout.parentPhone || undefined,
          }
        : scout
    ));
    resetForm();
    toast({
      title: "تم تحديث البيانات",
      description: `تم تحديث بيانات ${newScout.name} بنجاح`,
    });
  };

  const handleDeleteScout = (id: number, name: string) => {
    setScouts(scouts.filter(scout => scout.id !== id));
    toast({
      title: "تم حذف الكشاف",
      description: `تم حذف ${name} من القائمة`,
    });
  };

  const startEdit = (scout: Scout) => {
    setEditingScout(scout);
    setNewScout({
      name: scout.name,
      age: scout.age.toString(),
      phone: scout.phone || "",
      parentPhone: scout.parentPhone || "",
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="scout-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-scout-green">
            {editingScout ? "تعديل بيانات الكشاف" : "إضافة كشاف جديد"}
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="scout-btn-primary flex items-center space-x-2 space-x-reverse"
          >
            <Plus size={20} />
            <span>كشاف جديد</span>
          </button>
        </div>

        {showAddForm && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="اسم الكشاف"
                value={newScout.name}
                onChange={(e) => setNewScout({ ...newScout, name: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              />
              <input
                type="number"
                placeholder="العمر"
                value={newScout.age}
                onChange={(e) => setNewScout({ ...newScout, age: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف (اختياري)"
                value={newScout.phone}
                onChange={(e) => setNewScout({ ...newScout, phone: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              />
              <input
                type="tel"
                placeholder="رقم هاتف ولي الأمر (اختياري)"
                value={newScout.parentPhone}
                onChange={(e) => setNewScout({ ...newScout, parentPhone: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              />
            </div>
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
        )}
      </div>

      {/* Scouts List */}
      <div className="scout-card p-6">
        <h3 className="text-xl font-bold text-scout-green mb-6">قائمة الكشافة</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-center">العمر</TableHead>
                <TableHead className="text-right">تاريخ الانضمام</TableHead>
                <TableHead className="text-center">الهاتف</TableHead>
                <TableHead className="text-center">هاتف ولي الأمر</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scouts.map((scout) => (
                <TableRow key={scout.id}>
                  <TableCell className="font-medium">{scout.name}</TableCell>
                  <TableCell className="text-center">{scout.age}</TableCell>
                  <TableCell>{scout.joinDate}</TableCell>
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
                    <div className="flex justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => startEdit(scout)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteScout(scout.id, scout.name)}
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
            {scouts.filter(scout => scout.age < 12).length}
          </div>
          <div className="text-gray-600">الأشبال (أقل من 12)</div>
        </div>
        <div className="scout-card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {scouts.filter(scout => scout.age >= 12 && scout.age < 16).length}
          </div>
          <div className="text-gray-600">الكشافة (12-15)</div>
        </div>
        <div className="scout-card p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {scouts.filter(scout => scout.age >= 16).length}
          </div>
          <div className="text-gray-600">المتقدمون (+16)</div>
        </div>
      </div>
    </div>
  );
};

export default ScoutManager;
